import {
  JOB_SPECS,
  acknowledgeComplete,
  classifyJob,
  isSmallTalk,
  nextMissing,
  reply,
  startConversation,
} from "@/lib/engine";
import type { ConversationState, JobType } from "@/lib/types";

const JOB_TYPES = Object.keys(JOB_SPECS) as JobType[];

type AiTurn = {
  intent?: "closer" | "continue" | "new_job" | "safety";
  jobType?: JobType | null;
  answers?: Record<string, string>;
  reply?: string;
};

function openaiKey() {
  return process.env.OPENAI_API_KEY?.trim() || "";
}

function openaiModel() {
  return process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
}

export async function replySmart(
  state: ConversationState,
  userText: string,
  businessName = "the team",
): Promise<ConversationState> {
  const text = userText.trim();
  if (!text) return state;

  if (state.complete) {
    if (isSmallTalk(text)) return acknowledgeComplete(state, text, businessName);
    const closing = await interpretTurn(state, text, businessName);
    if (!closing || closing.intent === "closer") {
      return acknowledgeComplete(state, text, businessName, sanitizeSms(closing?.reply));
    }
    return continueIntake(startConversation(businessName), text, businessName, closing);
  }

  return continueIntake(state, text, businessName);
}

async function continueIntake(
  state: ConversationState,
  text: string,
  businessName: string,
  ai?: AiTurn | null,
) {
  const turn = ai ?? (await interpretTurn(state, text, businessName));
  if (isSmallTalk(text) || turn?.intent === "closer") {
    const missing = nextMissing(state);
    const fallback = missing ? `No problem. ${missing.question}` : "No problem — I've got what I need.";
    return {
      ...state,
      messages: [
        ...state.messages,
        { role: "customer" as const, text, at: new Date().toISOString() },
        { role: "assistant" as const, text: sanitizeSms(turn?.reply) || fallback, at: new Date().toISOString() },
      ],
    };
  }

  const jobType = validJobType(turn?.jobType) || state.jobType;
  const merged: ConversationState = {
    ...state,
    jobType,
    answers: { ...state.answers, ...(turn?.answers || {}) },
  };
  if (!merged.jobType) merged.jobType = classifyJob(text);

  const before = nextMissing(state);
  const filledCurrent = Boolean(before && merged.answers[before.key]);
  const next = reply(merged, text, businessName, { capture: !filledCurrent });

  if (next.safety) return next;
  const phrased = sanitizeSms(turn?.reply);
  if (!phrased) return next;
  const last = next.messages.at(-1);
  if (!last || last.role !== "assistant") return next;
  return {
    ...next,
    messages: [...next.messages.slice(0, -1), { ...last, text: phrased }],
  };
}

function validJobType(value?: string | null): JobType | null {
  if (!value) return null;
  return JOB_TYPES.includes(value as JobType) ? (value as JobType) : null;
}

function sanitizeSms(text?: string) {
  if (!text) return "";
  return text.replace(/\s+/g, " ").trim().slice(0, 280);
}

async function interpretTurn(state: ConversationState, userText: string, businessName: string) {
  const key = openaiKey();
  if (!key) return null;

  const missing = nextMissing(state);
  const spec = state.jobType ? JOB_SPECS[state.jobType] : null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: openaiModel(),
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You help a UK plumber's missed-call SMS intake. You are not a receptionist and you do not chat for long.
Reply as one short SMS (1-2 sentences, under 240 characters). Plain, calm, local. No marketing, no emoji, no prices.
Always collect structured facts. If a required field is still missing, you MUST ask for it.
If the customer only said thanks / ok / cheers after the job is already taken, intent is closer and reply is a brief thanks — do not start a new job.
If they mention gas smell, CO, flooding the house, or electric shock, intent is safety and tell them to leave and call 0800 111 999 or 999.
Return JSON only: {"intent":"closer|continue|new_job|safety","jobType":"boiler_breakdown|boiler_replacement|burst_pipe|leak|blocked_toilet|blocked_drain|radiator|tap|shower|bathroom|landlord|other|null","answers":{},"reply":""}`,
          },
          {
            role: "user",
            content: JSON.stringify({
              businessName,
              jobType: state.jobType,
              jobLabel: spec?.label || null,
              answers: state.answers,
              complete: state.complete,
              mustAsk: missing?.question || (state.complete ? null : "What's gone wrong?"),
              latestCustomerText: userText,
            }),
          },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) return null;
    return JSON.parse(raw) as AiTurn;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

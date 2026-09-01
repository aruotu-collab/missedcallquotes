import type { ConversationState, JobType, Message } from "./types";

type Field = {
  key: string;
  question: string;
  options?: string[];
};

type JobSpec = {
  label: string;
  likelyJob: string;
  typicalMin: number;
  typicalMax: number;
  keywords: RegExp;
  fields: Field[];
};

export const JOB_SPECS: Record<JobType, JobSpec> = {
  boiler_breakdown: {
    label: "Boiler breakdown",
    likelyJob: "Diagnostic / repair",
    typicalMin: 95,
    typicalMax: 350,
    keywords:
      /\b(boiler|heating|hot water|no heat|combi|worcester|vaillant|ideal|glow[- ]?worm|error code|e\d|ea|f\d)\b/i,
    fields: [
      {
        key: "scope",
        question: "Sorry about that. Do you have no heating, no hot water, or both?",
        options: ["No heating", "No hot water", "Both"],
      },
      {
        key: "error",
        question: "Is there an error code showing on the boiler? If you're not sure, just say so.",
      },
      {
        key: "make",
        question: "What's the boiler make? Worcester Bosch, Ideal, Vaillant — or send a photo if that's easier.",
      },
    ],
  },
  boiler_replacement: {
    label: "Boiler replacement",
    likelyJob: "Survey + installation quote",
    typicalMin: 2200,
    typicalMax: 4500,
    keywords: /\b(new boiler|replace(d|ment)? boiler|boiler install|old boiler)\b/i,
    fields: [
      { key: "current", question: "What make and roughly how old is the current boiler?" },
      {
        key: "property",
        question: "How many bedrooms and bathrooms does the property have?",
      },
      {
        key: "fuel",
        question: "Is it gas, oil, or LPG?",
        options: ["Gas", "Oil", "LPG", "Not sure"],
      },
    ],
  },
  burst_pipe: {
    label: "Burst pipe",
    likelyJob: "Emergency isolation / repair",
    typicalMin: 150,
    typicalMax: 400,
    keywords: /\b(burst|flooding|pipe burst|water everywhere)\b/i,
    fields: [
      {
        key: "active",
        question: "Is water still coming out, or have you managed to stop it?",
        options: ["Still leaking", "Stopped it", "Not sure"],
      },
      {
        key: "stopcock",
        question: "Do you know where the stopcock is, and have you tried turning it off?",
      },
      { key: "location", question: "Where is the burst — kitchen, bathroom, loft, outside?" },
    ],
  },
  leak: {
    label: "Leak",
    likelyJob: "Leak trace / repair",
    typicalMin: 80,
    typicalMax: 250,
    keywords: /\b(leak|leaking|dripping pipe|water coming through)\b/i,
    fields: [
      {
        key: "location",
        question: "Where is the water leaking from — ceiling, pipe, appliance, or not sure?",
      },
      {
        key: "active",
        question: "Is it leaking continuously, or only when something is used?",
        options: ["Continuously", "Only when used", "Not sure"],
      },
      {
        key: "severity",
        question: "Is it a drip, a steady leak, or enough to damage the floor/ceiling?",
        options: ["Drip", "Steady leak", "Causing damage"],
      },
    ],
  },
  blocked_toilet: {
    label: "Blocked toilet",
    likelyJob: "Unblock / reset",
    typicalMin: 80,
    typicalMax: 180,
    keywords: /\b(toilet).*(block|overflow|won't flush|wont flush)|blocked toilet\b/i,
    fields: [
      {
        key: "overflow",
        question: "Is the toilet overflowing, or just not flushing away?",
        options: ["Overflowing", "Not flushing", "Slow"],
      },
      {
        key: "only",
        question: "Is it only this toilet, or are other drains slow as well?",
        options: ["Only this toilet", "Other drains too"],
      },
    ],
  },
  blocked_drain: {
    label: "Blocked drain",
    likelyJob: "Drain unblock",
    typicalMin: 80,
    typicalMax: 220,
    keywords: /\b(blocked|blockage|won't drain|wont drain|standing water).*(sink|drain|bath|shower)|blocked (sink|drain|bath)\b/i,
    fields: [
      { key: "where", question: "Which drain is blocked — sink, bath, shower, or outside?" },
      {
        key: "spread",
        question: "Is it just one fitting, or are several drains backing up?",
        options: ["One fitting", "Several drains"],
      },
    ],
  },
  radiator: {
    label: "Radiator",
    likelyJob: "Bleed / valve / repair",
    typicalMin: 90,
    typicalMax: 250,
    keywords: /\b(radiator|rad\b|cold radiator)\b/i,
    fields: [
      {
        key: "symptom",
        question: "Is the radiator cold, only half hot, or leaking?",
        options: ["Cold", "Half hot", "Leaking"],
      },
      {
        key: "scope",
        question: "Is it one radiator or all of them?",
        options: ["One", "A few", "All"],
      },
    ],
  },
  tap: {
    label: "Tap",
    likelyJob: "Tap repair / replacement",
    typicalMin: 80,
    typicalMax: 180,
    keywords: /\b(tap|mixer tap|dripping tap)\b/i,
    fields: [
      {
        key: "symptom",
        question: "Is the tap dripping, leaking at the base, or broken?",
        options: ["Dripping", "Leaking at base", "Broken / stiff"],
      },
      { key: "which", question: "Kitchen or bathroom, and is it hot, cold, or a mixer?" },
    ],
  },
  shower: {
    label: "Shower",
    likelyJob: "Shower repair",
    typicalMin: 90,
    typicalMax: 400,
    keywords: /\b(shower)\b/i,
    fields: [
      {
        key: "type",
        question: "Is it an electric shower or a mixer / bar shower?",
        options: ["Electric", "Mixer", "Not sure"],
      },
      {
        key: "symptom",
        question: "What's wrong — no pressure, temperature, leaking, or it won't turn on?",
      },
    ],
  },
  bathroom: {
    label: "Bathroom",
    likelyJob: "Survey + renovation quote",
    typicalMin: 3000,
    typicalMax: 8000,
    keywords: /\b(bathroom|wet room|suite|refit|renovation)\b/i,
    fields: [
      {
        key: "scope",
        question: "Is this a full bathroom refit, or a repair to something already in place?",
        options: ["Full refit", "Partial", "Repair"],
      },
      { key: "photos", question: "Can you describe the room, or send a couple of photos?" },
    ],
  },
  landlord: {
    label: "Landlord / tenant",
    likelyJob: "Tenant callout",
    typicalMin: 95,
    typicalMax: 280,
    keywords: /\b(landlord|tenant|rental|letting)\b/i,
    fields: [
      { key: "issue", question: "What's the plumbing issue at the property?" },
      { key: "access", question: "Who will be there for access, and how urgent is it?" },
    ],
  },
  other: {
    label: "Plumbing enquiry",
    likelyJob: "Call to qualify",
    typicalMin: 80,
    typicalMax: 250,
    keywords: /.*/,
    fields: [{ key: "detail", question: "Got it. Can you tell me a bit more about what's happening?" }],
  },
};

const SAFETY =
  /\b(smell of gas|gas leak|carbon monoxide|\bco alarm|flooding the (house|flat)|sparking|electric shock)\b/i;

const SHARED_FIELDS: Field[] = [
  { key: "postcode", question: "What's the postcode?" },
  {
    key: "when",
    question: "And when would you ideally like someone out?",
    options: ["Today / urgent", "In the next few days", "Just looking for a quote"],
  },
];

function now() {
  return new Date().toISOString();
}

function msg(role: Message["role"], text: string): Message {
  return { role, text, at: now() };
}

export function classifyJob(text: string): JobType {
  const order: JobType[] = [
    "boiler_replacement",
    "burst_pipe",
    "blocked_toilet",
    "blocked_drain",
    "boiler_breakdown",
    "bathroom",
    "landlord",
    "radiator",
    "shower",
    "tap",
    "leak",
    "other",
  ];
  for (const type of order) {
    if (type === "other") continue;
    if (JOB_SPECS[type].keywords.test(text)) return type;
  }
  return "other";
}

function nextMissing(state: ConversationState): Field | null {
  if (!state.jobType) return null;
  const fields = [...JOB_SPECS[state.jobType].fields, ...SHARED_FIELDS];
  return fields.find((field) => !state.answers[field.key]) ?? null;
}

function buildLead(state: ConversationState, firstCustomerText: string): ConversationState["lead"] {
  if (!state.jobType) return null;
  const spec = JOB_SPECS[state.jobType];
  return {
    customerName: state.answers.name || "Caller",
    customerPhone: state.answers.phone || "",
    jobType: state.jobType,
    jobLabel: spec.label,
    problem: firstCustomerText,
    answers: state.answers,
    postcode: state.answers.postcode || "",
    urgency: state.answers.when || "",
    preferredTime: state.answers.when || "",
    photoNote: /photo|picture|pic\b/i.test(JSON.stringify(state.answers))
      ? "Customer offered / sent a photo"
      : "None yet",
    likelyJob: spec.likelyJob,
    typicalMin: spec.typicalMin,
    typicalMax: spec.typicalMax,
  };
}

export function startConversation(businessName: string): ConversationState {
  return {
    step: "problem",
    jobType: null,
    answers: {},
    messages: [
      msg(
        "assistant",
        `Hi, it's ${businessName}. Sorry we couldn't answer — we're probably with another customer. I can get the details over now. What's gone wrong?`,
      ),
    ],
    complete: false,
    safety: false,
    lead: null,
  };
}

export function reply(
  state: ConversationState,
  userText: string,
  businessName = "the team",
): ConversationState {
  const text = userText.trim();
  if (!text) return state;

  const next: ConversationState = {
    ...state,
    answers: { ...state.answers },
    messages: [...state.messages, msg("customer", text)],
  };

  if (SAFETY.test(text)) {
    next.safety = true;
    next.complete = true;
    next.jobType = next.jobType ?? classifyJob(text);
    next.answers.detail = text;
    next.messages.push(
      msg(
        "assistant",
        "If you can smell gas, leave the property, don't use electrics, and call the National Gas Emergency Service on 0800 111 999. If you're in immediate danger, call 999. I'll still pass this to the engineer as an emergency.",
      ),
    );
    const first = next.messages.find((m) => m.role === "customer")?.text || text;
    next.lead = buildLead(next, first);
    return next;
  }

  if (!next.jobType) {
    next.jobType = classifyJob(text);
    next.answers = { ...next.answers, ...inferAnswers(text, next.jobType) };
  } else {
    const missing = nextMissing(next);
    if (missing) next.answers[missing.key] = text;
  }

  const missing = nextMissing(next);
  if (missing) {
    next.step = missing.key;
    next.messages.push(msg("assistant", missing.question));
    return next;
  }

  const first = next.messages.find((m) => m.role === "customer")?.text || text;
  next.complete = true;
  next.step = "done";
  next.lead = buildLead(next, first);
  next.messages.push(
    msg(
      "assistant",
      `Thanks — I've sent this through to ${businessName} as a quote-ready job. Someone will be in touch shortly.`,
    ),
  );
  return next;
}

function inferAnswers(text: string, jobType: JobType) {
  const answers: Record<string, string> = { problem: text };
  if (jobType === "boiler_breakdown") {
    if (/no heating.{0,40}hot water|hot water.{0,40}no heat|both/i.test(text)) {
      answers.scope = "Both";
    } else if (/no hot water/i.test(text)) {
      answers.scope = "No hot water";
    } else if (/no heat/i.test(text)) {
      answers.scope = "No heating";
    }
    const code = text.match(/\b(E[A-Z0-9]{1,3}|F\d{1,2})\b/i);
    if (code) answers.error = code[1].toUpperCase();
  }
  if (jobType === "burst_pipe" || jobType === "leak") {
    if (/still (coming|leaking|running)|water everywhere/i.test(text)) answers.active = "Still leaking";
    if (/kitchen|bathroom|loft|ceiling/i.test(text)) {
      answers.location = text.match(/kitchen|bathroom|loft|ceiling/i)?.[0] || text;
    }
  }
  const postcode = text.match(/\b([A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2})\b/i);
  if (postcode) answers.postcode = postcode[1].toUpperCase();
  return answers;
}

export function estimatedRange(jobType: JobType) {
  const spec = JOB_SPECS[jobType];
  return { min: spec.typicalMin, max: spec.typicalMax, label: spec.label };
}

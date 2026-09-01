import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { hashPassword } from "./auth-crypto";
import type { Business, Lead, Quote, Store, User } from "./types";

const DIR = path.join(process.env.VERCEL ? "/tmp" : process.cwd(), ".data");
const FILE = path.join(DIR, "store.json");

function empty(): Store {
  return { users: [], businesses: [], leads: [], quotes: [] };
}

function ago(ms: number) {
  const start = new Date();
  start.setDate(1);
  start.setHours(1, 0, 0, 0);
  return new Date(Math.max(Date.now() - ms, start.getTime())).toISOString();
}

function demoStore(): Store {
  const createdAt = ago(1000 * 60 * 60 * 24 * 10);
  const user: User = {
    id: "user_dave",
    email: "dave@davesplumbing.test",
    passwordHash: hashPassword("plumber123"),
    createdAt,
  };
  const business: Business = {
    id: "biz_dave",
    userId: user.id,
    name: "Dave's Plumbing",
    ownerFirstName: "Dave",
    phone: "0161 000 1840",
    notificationMobile: "07700 900184",
    city: "Manchester",
    serviceAreas: ["M20", "M21", "SK3", "SK4", "M14"],
    services: [
      "Boiler repair",
      "Boiler installation",
      "Leaks",
      "Blocked drains",
      "Bathrooms",
      "Radiators",
      "Taps & showers",
    ],
    callOut: 95,
    emergencyCallOut: 150,
    hourlyLabour: 65,
    minimumJob: 80,
    boilerDiagnostic: 95,
    tone: "plain, calm, local Manchester plumber",
    plan: "founding",
    onboarded: true,
    ownerEmail: user.email,
    createdAt,
  };

  const lead = (
    partial: Omit<Lead, "businessId" | "existingCustomer" | "conversation"> & {
      conversation?: Lead["conversation"];
    },
  ): Lead => ({
    businessId: business.id,
    existingCustomer: false,
    conversation: partial.conversation ?? [],
    ...partial,
  });

  const leads: Lead[] = [
    lead({
      id: "lead_burst",
      customerName: "Sarah Khan",
      customerPhone: "07700 900221",
      jobType: "burst_pipe",
      jobLabel: "Burst pipe",
      problem: "Pipe burst under the kitchen sink, water still coming out",
      answers: {
        problem: "Pipe burst under the kitchen sink",
        active: "Still leaking",
        stopcock: "Turned it off now",
        location: "Kitchen",
        postcode: "M20 2XY",
        when: "Today / urgent",
      },
      postcode: "M20",
      urgency: "Today / urgent",
      preferredTime: "Today / urgent",
      photoNote: "Photo of pipe attached",
      likelyJob: "Emergency isolation / repair",
      typicalMin: 150,
      typicalMax: 300,
      quotedAmount: null,
      wonAmount: null,
      collectedAmount: null,
      status: "new",
      createdAt: ago(1000 * 60 * 18),
      updatedAt: ago(1000 * 60 * 18),
    }),
    lead({
      id: "lead_boiler",
      customerName: "Mark Ellis",
      customerPhone: "07700 900334",
      jobType: "boiler_replacement",
      jobLabel: "Boiler replacement",
      problem: "Want the old Worcester boiler replacing",
      answers: {
        current: "Worcester Bosch, about 14 years",
        property: "3 bed, 1 bath",
        fuel: "Gas",
        postcode: "SK4 1AB",
        when: "Just looking for a quote",
      },
      postcode: "SK4",
      urgency: "Just looking for a quote",
      preferredTime: "Next week",
      photoNote: "Photos received",
      likelyJob: "Survey + installation quote",
      typicalMin: 2200,
      typicalMax: 4500,
      quotedAmount: 3250,
      wonAmount: null,
      collectedAmount: null,
      status: "following_up",
      createdAt: ago(1000 * 60 * 60 * 20),
      updatedAt: ago(1000 * 60 * 60 * 20),
    }),
    lead({
      id: "lead_bath",
      customerName: "James Wright",
      customerPhone: "07700 900445",
      jobType: "leak",
      jobLabel: "Bathroom repair",
      problem: "Leaking shower tray damaging the ceiling below",
      answers: {
        location: "Shower tray",
        active: "Only when used",
        severity: "Causing damage",
        postcode: "M21 9HG",
        when: "In the next few days",
      },
      postcode: "M21",
      urgency: "In the next few days",
      preferredTime: "This week",
      photoNote: "None yet",
      likelyJob: "Leak trace / repair",
      typicalMin: 180,
      typicalMax: 480,
      quotedAmount: 480,
      wonAmount: 480,
      collectedAmount: 480,
      status: "won",
      createdAt: ago(1000 * 60 * 60 * 30),
      updatedAt: ago(1000 * 60 * 60 * 8),
    }),
    lead({
      id: "lead_wash",
      customerName: "Priya Shah",
      customerPhone: "07700 900556",
      jobType: "other",
      jobLabel: "Washing machine repair",
      problem: "Washing machine not draining",
      answers: { detail: "Appliance not draining", postcode: "M21 1AA", when: "Today / urgent" },
      postcode: "M21",
      urgency: "Today / urgent",
      preferredTime: "Today",
      photoNote: "None",
      likelyJob: "Not a service provided",
      typicalMin: 0,
      typicalMax: 0,
      quotedAmount: null,
      wonAmount: null,
      collectedAmount: null,
      status: "declined",
      createdAt: ago(1000 * 60 * 60 * 8),
      updatedAt: ago(1000 * 60 * 60 * 8),
    }),
    lead({
      id: "lead_diag",
      customerName: "Helen Brooks",
      customerPhone: "07700 900667",
      jobType: "boiler_breakdown",
      jobLabel: "Boiler breakdown",
      problem: "No heating or hot water, EA error",
      answers: {
        scope: "Both",
        error: "EA",
        make: "Worcester Bosch",
        postcode: "M20 4RL",
        when: "Today / urgent",
      },
      postcode: "M20",
      urgency: "Today / urgent",
      preferredTime: "Today after 4pm",
      photoNote: "Boiler photo attached",
      likelyJob: "Diagnostic / repair",
      typicalMin: 95,
      typicalMax: 350,
      quotedAmount: 95,
      wonAmount: 95,
      collectedAmount: null,
      status: "quoted",
      createdAt: ago(1000 * 60 * 50),
      updatedAt: ago(1000 * 60 * 40),
    }),
  ];

  const quotes: Quote[] = [
    {
      id: "quote_boiler",
      businessId: business.id,
      leadId: "lead_boiler",
      amount: 3250,
      description: "Worcester 4000 combi replacement, 3 bed house, flue + filter",
      status: "following_up",
      sentAt: ago(1000 * 60 * 60 * 20),
      lastFollowUpAt: ago(1000 * 60 * 60 * 6),
      createdAt: ago(1000 * 60 * 60 * 20),
    },
    {
      id: "quote_bath",
      businessId: business.id,
      leadId: "lead_bath",
      amount: 480,
      description: "Shower tray reseal and waste replacement",
      status: "accepted",
      sentAt: ago(1000 * 60 * 60 * 26),
      lastFollowUpAt: null,
      createdAt: ago(1000 * 60 * 60 * 26),
    },
    {
      id: "quote_diag",
      businessId: business.id,
      leadId: "lead_diag",
      amount: 95,
      description: "Boiler diagnostic visit",
      status: "sent",
      sentAt: ago(1000 * 60 * 40),
      lastFollowUpAt: null,
      createdAt: ago(1000 * 60 * 40),
    },
  ];

  return { users: [user], businesses: [business], leads, quotes };
}

function ensure() {
  if (!existsSync(DIR)) mkdirSync(DIR, { recursive: true });
  if (!existsSync(FILE)) {
    writeFileSync(FILE, JSON.stringify(demoStore(), null, 2));
  }
}

export function readStore(): Store {
  ensure();
  try {
    return JSON.parse(readFileSync(FILE, "utf8")) as Store;
  } catch {
    const store = demoStore();
    writeFileSync(FILE, JSON.stringify(store, null, 2));
    return store;
  }
}

export function writeStore(store: Store) {
  ensure();
  writeFileSync(FILE, JSON.stringify(store, null, 2));
}

export function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

export function getUserByEmail(email: string) {
  return readStore().users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function getUserById(id: string) {
  return readStore().users.find((u) => u.id === id) ?? null;
}

export function getBusinessByUserId(userId: string) {
  return readStore().businesses.find((b) => b.userId === userId) ?? null;
}

export function getBusinessById(id: string) {
  return readStore().businesses.find((b) => b.id === id) ?? null;
}

export function leadsFor(businessId: string) {
  return readStore()
    .leads.filter((l) => l.businessId === businessId)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function quotesFor(businessId: string) {
  return readStore()
    .quotes.filter((q) => q.businessId === businessId)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

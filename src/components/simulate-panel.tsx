"use client";

import { DemoChat } from "./demo-chat";

export function SimulatePanel({ businessName }: { businessName: string }) {
  return (
    <DemoChat
      businessName={businessName}
      persist
      customerName="Test caller"
      customerPhone="07700 900001"
    />
  );
}

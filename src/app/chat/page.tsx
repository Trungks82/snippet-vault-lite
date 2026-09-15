import type { Metadata } from "next";
import { ChatPanel } from "@/components/ChatPanel";

export const metadata: Metadata = {
  title: "Chat",
  description: "Ask Acme Support AI about pricing, refunds, and product FAQ.",
};

export default function ChatPage() {
  return <ChatPanel />;
}

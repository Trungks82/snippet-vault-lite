import { NextResponse } from "next/server";
import { generateDemoAnswer, generateOpenAIAnswer } from "@/lib/answer";
import { retrieveRelevantChunks } from "@/lib/knowledge";
import type { ChatRequest, ChatResponse } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequest;
    const message = body.message?.trim();

    if (!message) {
      return NextResponse.json(
        { error: "message is required" },
        { status: 400 },
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: "message too long (max 2000 chars)" },
        { status: 400 },
      );
    }

    const citations = retrieveRelevantChunks(message, 3);
    const apiKey = process.env.OPENAI_API_KEY?.trim();

    let mode: ChatResponse["mode"] = "demo";
    let answer = generateDemoAnswer(message, citations);

    if (apiKey) {
      const openaiAnswer = await generateOpenAIAnswer(
        message,
        citations,
        apiKey,
      );
      if (openaiAnswer) {
        answer = openaiAnswer;
        mode = "openai";
      }
    }

    const payload: ChatResponse = { answer, citations, mode };
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 },
    );
  }
}

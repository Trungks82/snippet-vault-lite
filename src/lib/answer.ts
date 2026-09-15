import type { Citation } from "./types";

function buildContextBlock(citations: Citation[]): string {
  if (citations.length === 0) return "";
  return citations
    .map(
      (c, i) =>
        `[${i + 1}] (${c.source}) ${c.title}\n${c.excerpt}`,
    )
    .join("\n\n");
}

function citationFooter(citations: Citation[]): string {
  if (citations.length === 0) return "";
  const list = citations
    .map((c, i) => `${i + 1}. **${c.title}** (\`${c.source}\`)`)
    .join("\n");
  return `\n\n---\n**Sources**\n${list}`;
}

/** Deterministic mock answer grounded in retrieved chunks — no API key needed. */
export function generateDemoAnswer(
  question: string,
  citations: Citation[],
): string {
  if (citations.length === 0) {
    return (
      "I could not find anything in the Acme Support AI knowledge base that matches your question. " +
      "Try asking about pricing plans, refunds, the free trial, or how the knowledge base works. " +
      "For anything else, a human agent at support@acme-support-ai.example can help."
    );
  }

  const q = question.toLowerCase();
  const primary = citations[0];
  const bullets = citations
    .slice(0, 3)
    .map((c) => {
      // Prefer the first substantial sentence/paragraph from the excerpt
      const sentence =
        c.excerpt.split(/(?<=[.!?])\s+/).find((s) => s.length > 40) ??
        c.excerpt;
      return `• From *${c.title}*: ${sentence}`;
    })
    .join("\n");

  let lead: string;
  if (/refund|money.?back|chargeback|cancel/.test(q)) {
    lead =
      "Based on our refunds policy, here is what applies:";
  } else if (/price|pricing|cost|plan|subscription|trial|billing/.test(q)) {
    lead =
      "Here is what our pricing docs say:";
  } else if (/faq|how does|what is|knowledge|api key|accurate|white.?label/.test(q)) {
    lead =
      "From the FAQ:";
  } else {
    lead = `I found ${citations.length} relevant section${citations.length > 1 ? "s" : ""} in the knowledge base:`;
  }

  return (
    `${lead}\n\n${bullets}\n\n` +
    `The strongest match was **${primary.title}** (score ${primary.score}). ` +
    `This is demo mode — answers are assembled from retrieved chunks without calling an LLM. ` +
    `Set \`OPENAI_API_KEY\` to enable optional OpenAI phrasing while keeping the same citations.` +
    citationFooter(citations)
  );
}

/** Optional OpenAI call; falls back to demo on any failure. */
export async function generateOpenAIAnswer(
  question: string,
  citations: Citation[],
  apiKey: string,
): Promise<string | null> {
  if (citations.length === 0) return null;

  const context = buildContextBlock(citations);
  const system = `You are Acme Support AI, a helpful customer-support assistant.
Answer ONLY using the provided context. If the context is insufficient, say you don't know and suggest contacting support@acme-support-ai.example.
Be concise (2–4 short paragraphs or bullets). Mention source filenames inline when useful.
Do not invent policies.`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        messages: [
          { role: "system", content: system },
          {
            role: "user",
            content: `Context:\n${context}\n\nQuestion: ${question}`,
          },
        ],
      }),
    });

    if (!res.ok) return null;
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) return null;
    return content + citationFooter(citations);
  } catch {
    return null;
  }
}

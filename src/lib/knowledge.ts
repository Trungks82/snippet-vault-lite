import fs from "fs";
import path from "path";
import type { Citation, KnowledgeChunk, KnowledgeDoc } from "./types";

const KNOWLEDGE_DIR = path.join(process.cwd(), "content", "knowledge");

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "is", "are", "was", "were", "be", "been", "being", "have", "has",
  "had", "do", "does", "did", "will", "would", "could", "should", "may",
  "might", "must", "shall", "can", "i", "you", "he", "she", "it", "we",
  "they", "what", "which", "who", "whom", "this", "that", "these", "those",
  "am", "with", "from", "by", "about", "into", "through", "during", "before",
  "after", "above", "below", "up", "down", "out", "off", "over", "under",
  "again", "further", "then", "once", "here", "there", "when", "where",
  "why", "how", "all", "each", "few", "more", "most", "other", "some",
  "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too",
  "very", "just", "me", "my", "your", "our", "their", "if", "any",
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s$-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

function titleFromFilename(filename: string): string {
  const base = filename.replace(/\.md$/i, "");
  const map: Record<string, string> = {
    faq: "FAQ",
    pricing: "Pricing",
    refunds: "Refunds & Cancellations",
  };
  return map[base] ?? base.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function loadKnowledgeDocs(): KnowledgeDoc[] {
  if (!fs.existsSync(KNOWLEDGE_DIR)) return [];
  return fs
    .readdirSync(KNOWLEDGE_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((filename) => {
      const content = fs.readFileSync(path.join(KNOWLEDGE_DIR, filename), "utf8");
      const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
      return {
        id: filename.replace(/\.md$/i, ""),
        title: heading ?? titleFromFilename(filename),
        filename,
        content,
      };
    });
}

function chunkDoc(doc: KnowledgeDoc): KnowledgeChunk[] {
  const sections = doc.content.split(/\n(?=##\s+)/);
  const chunks: KnowledgeChunk[] = [];

  sections.forEach((section, index) => {
    const trimmed = section.trim();
    if (!trimmed) return;
    const sectionTitle =
      trimmed.match(/^##\s+(.+)$/m)?.[1]?.trim() ?? doc.title;
    // Further split long sections by paragraphs if needed
    const parts =
      trimmed.length > 900
        ? trimmed.split(/\n\n+/).reduce<string[]>((acc, para) => {
            const last = acc[acc.length - 1];
            if (last && last.length + para.length < 700) {
              acc[acc.length - 1] = `${last}\n\n${para}`;
            } else {
              acc.push(para);
            }
            return acc;
          }, [])
        : [trimmed];

    parts.forEach((part, partIndex) => {
      const text = part.trim();
      if (text.length < 40) return;
      chunks.push({
        id: `${doc.id}-${index}-${partIndex}`,
        docId: doc.id,
        title: `${doc.title} — ${sectionTitle}`,
        source: doc.filename,
        text,
        tokens: tokenize(text),
      });
    });
  });

  return chunks;
}

let cachedChunks: KnowledgeChunk[] | null = null;

export function getKnowledgeChunks(): KnowledgeChunk[] {
  if (cachedChunks) return cachedChunks;
  cachedChunks = loadKnowledgeDocs().flatMap(chunkDoc);
  return cachedChunks;
}

/** Simple TF-style token overlap retrieval (embedding-free). */
export function retrieveRelevantChunks(
  query: string,
  topK = 3,
): Citation[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const querySet = new Set(queryTokens);
  const scored = getKnowledgeChunks().map((chunk) => {
    const tf = new Map<string, number>();
    for (const t of chunk.tokens) tf.set(t, (tf.get(t) ?? 0) + 1);

    let score = 0;
    for (const qt of querySet) {
      const count = tf.get(qt) ?? 0;
      if (count > 0) {
        // Boost exact token hits; slight boost for rarer tokens in chunk
        score += 1 + Math.log(1 + count);
      }
    }
    // Phrase-ish bonus: consecutive query tokens appearing in text
    const lower = chunk.text.toLowerCase();
    for (let i = 0; i < queryTokens.length - 1; i++) {
      const bigram = `${queryTokens[i]} ${queryTokens[i + 1]}`;
      if (lower.includes(bigram)) score += 1.5;
    }

    return { chunk, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(({ chunk, score }) => ({
      id: chunk.id,
      title: chunk.title,
      source: chunk.source,
      excerpt: chunk.text.slice(0, 280).replace(/\n+/g, " ").trim() + (chunk.text.length > 280 ? "…" : ""),
      score: Math.round(score * 100) / 100,
    }));
}

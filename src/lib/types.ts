export type Citation = {
  id: string;
  title: string;
  source: string;
  excerpt: string;
  score: number;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  mode?: "demo" | "openai";
};

export type ChatRequest = {
  message: string;
  history?: { role: "user" | "assistant"; content: string }[];
};

export type ChatResponse = {
  answer: string;
  citations: Citation[];
  mode: "demo" | "openai";
};

export type KnowledgeDoc = {
  id: string;
  title: string;
  filename: string;
  content: string;
};

export type KnowledgeChunk = {
  id: string;
  docId: string;
  title: string;
  source: string;
  text: string;
  tokens: string[];
};

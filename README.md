# Acme Support AI

Portfolio demo for **Trungks82**: a polished customer-support chatbot SaaS built with **Next.js App Router**, **TypeScript**, and **Tailwind CSS**. It answers questions with **RAG over local markdown** and always shows **citations**. Demo mode works **without any API keys**.

> This branch replaces an earlier NestJS learning tree with a client-facing Next.js portfolio piece.

---

## Problem

Support teams spend hours answering the same questions about pricing, refunds, and product basics. Generic chatbots invent policies; ticket queues create wait times. Buyers want a demo that shows **grounded** answers — retrieved from *their* docs — with sources they can audit.

**Acme Support AI** is that walkthrough: ask about plans or the 14-day refund window, watch retrieval + citations, optionally turn on OpenAI for nicer phrasing.

---

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js (App Router) + React |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Knowledge | Markdown in `content/knowledge/` |
| Retrieval | Embedding-free token overlap / TF-style scoring |
| LLM | Optional OpenAI (`gpt-4o-mini`) when `OPENAI_API_KEY` is set |

---

## Architecture

```
Browser (/chat)
    │  POST { message }
    ▼
Route handler  POST /api/chat
    │
    ├──► load + chunk content/knowledge/*.md
    ├──► score chunks vs query (token overlap + bigram bonus)
    ├──► top-K citations
    │
    ├──► if OPENAI_API_KEY → chat completions with context
    └──► else → deterministic demo answer from chunks
    │
    ▼
JSON { answer, citations, mode: "demo" | "openai" }
```

**Key routes**

| Route | Purpose |
|-------|---------|
| `/` | Landing — product story, features, architecture |
| `/chat` | Chat UI with suggestions, simulated streaming, citation cards |
| `/docs` | Browse the sample knowledge base |
| `POST /api/chat` | RAG retrieve → answer (demo or OpenAI) |

---

## Setup

```bash
npm install
cp .env.example .env.local   # optional: add OPENAI_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build && npm start   # production check
```

---

## How to demo for clients

1. Open **Home** — explain the Tier-1 deflection story in 30 seconds.
2. Open **Knowledge Base** — show FAQ / Pricing / Refunds as “your policy pack.”
3. Open **Chat** — click a suggestion or ask:
   - “What does the Growth plan cost?”
   - “Can I get a refund after 10 days?”
   - “Do I need an API key?”
4. Expand **Citations** — point at filenames and excerpts. Emphasize: no key required for this flow.
5. (Optional) Add `OPENAI_API_KEY` to `.env.local`, restart, ask again — badge flips to **OpenAI**, same citations.

---

## Sample knowledge

| File | Topics |
|------|--------|
| `content/knowledge/faq.md` | Product overview, KB behavior, API keys, accuracy |
| `content/knowledge/pricing.md` | Starter / Growth / Scale, trials, add-ons |
| `content/knowledge/refunds.md` | 14-day guarantee, cancellations, chargebacks |

Edit or add `.md` files, restart the server, and retrieval picks them up.

---

## Extending for a real client

- **Ingest**: Notion / Confluence / Zendesk Help Center → chunking pipeline + incremental re-index.
- **Embeddings**: swap token overlap for OpenAI/Voyage embeddings + pgvector or a hosted vector store.
- **Auth & tenancy**: Clerk/Auth.js, per-workspace document isolation, role-based admin upload.
- **Handoff**: escalate low-confidence answers to Intercom/Zendesk with transcript + citations.
- **Eval**: golden-question set, citation precision/recall, hallucination checks before go-live.
- **Observability**: Langfuse/Helicone, rate limits, PII redaction.
- **UI**: white-label theme, embeddable widget, multi-language.

---

## Project layout

```
content/knowledge/     # RAG source docs
src/app/               # App Router pages + API
src/components/        # Nav, ChatPanel
src/lib/               # knowledge retrieval, answer generation, types
.env.example           # OPENAI_API_KEY=
```

---

## License

MIT — portfolio / demo use. Replace Acme branding before shipping to a customer.

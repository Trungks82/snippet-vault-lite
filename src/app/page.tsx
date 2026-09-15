import Link from "next/link";

const features = [
  {
    title: "RAG over your docs",
    body: "Token-overlap retrieval over local markdown — no vector DB required for the demo. Top chunks become citations on every reply.",
  },
  {
    title: "Demo mode, zero keys",
    body: "Ship a portfolio walkthrough without OpenAI. Deterministic grounded answers still cite FAQ, pricing, and refunds.",
  },
  {
    title: "Optional OpenAI",
    body: "Set OPENAI_API_KEY and the same retrieval pipeline feeds gpt-4o-mini for polished phrasing while keeping sources.",
  },
  {
    title: "Client-ready UI",
    body: "Landing, chat with simulated streaming, and a knowledge-base browser — the shape of a real SaaS support product.",
  },
];

const steps = [
  { n: "1", t: "Ask", d: "User sends a support question from /chat." },
  {
    n: "2",
    t: "Retrieve",
    d: "POST /api/chat scores knowledge chunks and picks the top matches.",
  },
  {
    n: "3",
    t: "Answer + cite",
    d: "Demo mock or OpenAI answers from context; UI shows citations.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-200/40 via-transparent to-transparent dark:from-indigo-900/30" />
        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="mb-3 inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
            Freelance portfolio demo · Trungks82
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Acme Support AI
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            A polished customer-support chatbot SaaS demo: Next.js App Router,
            TypeScript, Tailwind, and retrieval-augmented answers over sample
            policy docs — with citations you can show clients in a live walkthrough.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/chat"
              className="inline-flex items-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500"
            >
              Open chat demo
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Browse knowledge base
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Why this demo exists
        </h2>
        <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
          Support teams drown in repetitive questions about pricing, refunds,
          and product basics. Generic chatbots hallucinate; ticket queues lag.
          Acme Support AI shows how a grounded RAG assistant can deflect Tier-1
          volume while keeping humans in the loop via clear source citations.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
            >
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Architecture at a glance
          </h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-3">
            {steps.map((s) => (
              <li
                key={s.n}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950/50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                  {s.n}
                </span>
                <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">
                  {s.t}
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {s.d}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="rounded-2xl bg-indigo-600 px-6 py-10 text-center text-white shadow-xl shadow-indigo-600/20 sm:px-10">
          <h2 className="text-2xl font-semibold">Ready for a client walkthrough?</h2>
          <p className="mx-auto mt-2 max-w-xl text-indigo-100">
            Run locally, ask about refunds or pricing, and expand the citation
            cards. No API key required for the full story.
          </p>
          <Link
            href="/chat"
            className="mt-6 inline-flex rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
          >
            Start chatting
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500 dark:border-slate-800">
        Portfolio demo for <strong>Trungks82</strong> · Next.js · TypeScript ·
        Tailwind
      </footer>
    </div>
  );
}

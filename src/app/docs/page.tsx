import type { Metadata } from "next";
import { loadKnowledgeDocs } from "@/lib/knowledge";

export const metadata: Metadata = {
  title: "Knowledge Base",
  description: "Sample markdown docs used for RAG retrieval.",
};

export const dynamic = "force-dynamic";

export default function DocsPage() {
  const docs = loadKnowledgeDocs();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        Knowledge base
      </h1>
      <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
        These markdown files in{" "}
        <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm dark:bg-slate-800">
          content/knowledge/
        </code>{" "}
        are chunked and scored at chat time. Add or edit files and restart the
        server to refresh retrieval.
      </p>

      <div className="mt-8 space-y-6">
        {docs.length === 0 && (
          <p className="text-slate-500">No documents found.</p>
        )}
        {docs.map((doc) => (
          <article
            key={doc.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
          >
            <header className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-5 py-3 dark:border-slate-800 dark:bg-slate-950/50">
              <h2 className="font-semibold text-slate-900 dark:text-white">
                {doc.title}
              </h2>
              <span className="rounded-md bg-slate-200 px-2 py-0.5 font-mono text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {doc.filename}
              </span>
            </header>
            <pre className="max-h-[28rem] overflow-auto whitespace-pre-wrap p-5 font-mono text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              {doc.content}
            </pre>
          </article>
        ))}
      </div>
    </div>
  );
}

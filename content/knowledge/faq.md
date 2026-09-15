# Acme Support AI — Frequently Asked Questions

## What is Acme Support AI?

Acme Support AI is a customer-support chatbot that answers questions using your company's knowledge base. It retrieves relevant policy and product docs, then generates grounded answers with citations so agents and customers can trust the source.

## Who is it for?

Product-led SaaS teams, support managers, and founders who want 24/7 first-line answers without hiring a night shift. Typical use cases: pricing questions, refund status, onboarding help, and common troubleshooting.

## How does the knowledge base work?

You upload markdown or HTML docs (FAQs, pricing pages, refund policies). At query time we chunk those docs, score them against the user question with token-overlap retrieval, and pass the top chunks to the answer model. Every reply lists the source documents used.

## Do I need an OpenAI API key?

No. Demo mode works without any API keys using a deterministic mock that still cites sources. For production-quality phrasing, set `OPENAI_API_KEY` and the chat API will optionally call OpenAI with the retrieved context.

## How accurate are the answers?

Answers are grounded in retrieved chunks. If nothing relevant is found, the bot says it does not know and suggests contacting human support. Always review citations before treating an answer as policy.

## Can I white-label it?

Yes. The UI, brand name, and sample docs are placeholders. A real engagement would swap the theme, connect your CMS or Notion export, and add authentication plus usage metering.

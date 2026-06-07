# Developer Snippet Network (Snippet Vault)

A modern, production-grade enterprise platform designed to autonomously capture, validate, and securely organize high-value reusable code snippets directly from engineering workflows.

Instead of letting highly optimized solutions get buried deep inside historical pull requests, this platform serves as an automated, AI-driven knowledge ecosystem that prevents developers from reinventing the wheel.

---

## 🏗️ The Architecture Vision

The platform is designed using a decoupled, multi-tier architecture to maximize developer velocity, security, and algorithmic scalability:

* **The Ingestion Interface (Frontend):** A streamlined dashboard built with robust state management to monitor development metrics and flag high-value code blocks.
* **The Core REST Engine (Backend):** A strictly typed, enterprise-patterned NestJS API utilizing dependency injection and controller-service decoupling to safely pipeline incoming data.
* **The Database Warehouse:** A performance-optimized SQLite instance driven by Prisma 7 and a custom native driver adapter for sub-millisecond persistence.
* **The AI Synthesis Layer:** An autonomous processing layer leveraging large language models (LLMs) via the Google Gemini API (`gemini-1.5-flash`) to execute structured code reviews, programmatic meta-tagging, and automated vulnerability scanning.

---

## 🛠️ Tech Stack

* **Framework:** NestJS (Node.js v22)
* **Language:** TypeScript (Strict Mode)
* **Database ORM:** Prisma 7 (with modern driver adapters)
* **Database Engine:** SQLite (`better-sqlite3`)
* **AI Integration:** Google Generative AI Core (`@google/generative-ai`)
* **Security & Validation:** `class-validator`, `bcrypt`, JSON Web Tokens (JWT)

---

## 📁 System Module Map

The core engine segregates business domains into isolated modules to ensure clean decoupling and testing boundaries:

```text
src/
├── app.module.ts       # Central framework orchestrator
├── prisma/             # Direct database connection abstraction
├── auth/               # Access control and stateless JWT verification
├── ai/                 # Background worker layer interfacing with Gemini
└── snippet/            # Code ingestion pipeline and metadata database mapping
```

---

## 🗺️ Development Roadmap

### Project 1: Core Engine & Secure Pipeline
- [x] Set up modular NestJS application structure.
- [x] Implement strict request validation using Data Transfer Objects (DTOs).
- [x] Connect Prisma 7 database engine with localized SQLite warehouse.
- [x] Build secure, cryptographic User Registration & Authentication (JWT).

### Project 2: AI Orchestration & Metadata Synthesis
- [x] Integrate AI Agent communication pathways via LLM APIs (Gemini 1.5 Flash).
- [x] Build background processing services to pipe incoming code for analysis.
- [x] Implement automated code-quality assessment and programmatic JSON parsing/tagging.

### Project 3: Visual Interface & Integration
- [ ] Develop the unified dashboard UI for tracking code repositories.
- [ ] Establish secure state-management patterns for handling authenticated user sessions.

---

## 🔧 Local Setup & Environment Vault

Clone the repository and install dependencies:

```bash
npm install
```

Create a `.env` file at the root of the project to act as your secure local credentials vault:

```dotenv
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-cryptographic-secret-key"
GEMINI_API_KEY="AIzaSyYourSecretKeyFromGoogleAIStudio"
```

Initialize and sync your local SQLite warehouse schema using Prisma:

```bash
npx prisma migrate dev --name init_system
```

Boot up the local engine in development watch mode:

```bash
npm run start:dev
```

---

## 🔮 Future Architecture Target: "Bring Your Own AI"

To prevent tight coupling with a single upstream LLM provider, the AI layer is designed for a near-future refactor utilizing the Strategy Pattern via NestJS Custom Providers.

This abstraction will allow individual departments or repositories to seamlessly switch runtime engines (e.g., lightweight validation handled via Gemini, deep logical architecture validation routed dynamically to OpenAI or Claude) without altering core application controllers.

```typescript
export interface AiProvider {
  analyzeSnippet(codeSnippet: string, customRules?: string): Promise<SnippetMetadata>;
}
```
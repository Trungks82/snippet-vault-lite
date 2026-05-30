# Developer Snippet Network (Snippet Vault)

A modern, production-grade enterprise platform designed to autonomously capture, validate, and securely organize high-value reusable code snippets directly from engineering workflows. 

Instead of letting highly optimized solutions get buried deep inside historical pull requests, this platform serves as an automated, AI-driven knowledge ecosystem that prevents developers from reinventing the wheel.

## 🚀 The Architecture Vision

The platform is designed using a decoupled, multi-tier architecture to maximize developer velocity, security, and algorithmic scalability:

* **The Ingestion Interface (Frontend):** A streamlined dashboard built with robust state management to monitor development metrics and flags high-value code blocks.
* **The Core REST Engine (Backend):** A strictly typed, enterprise-patterned NestJS API utilizing dependency injection and controller-service decoupling to safely pipeline incoming data.
* **The Database Warehouse:** A performance-optimized SQLite instance driven by Prisma 7 and a custom native driver adapter for sub-millisecond persistence.
* **The AI Synthesis Layer:** An autonomous processing layer leveraging large language models (LLMs) to perform automated code reviews, vulnerability checks, and programmatic meta-tagging.

---

## 🛠️ Tech Stack

* **Framework:** NestJS (Node.js v22)
* **Language:** TypeScript (Strict Mode)
* **Database ORM:** Prisma 7 (With modern driver adapters)
* **Database Engine:** SQLite (`better-sqlite3`)
* **Security & Validation:** `class-validator`, `bcrypt`, JSON Web Tokens (JWT)

---

## 🏗️ Development Roadmap

### Project 1: Core Engine & Secure Pipeline 
* [x] Set up modular NestJS application structure.
* [x] Implement strict request validation using Data Transfer Objects (DTOs).
* [x] Connect Prisma 7 database engine with localized SQLite warehouse.
* [x] Build secure, cryptographic User Registration & Authentication (JWT) (*In Progress*).

### Project 2: AI Orchestration & Metadata Synthesis
* [ ] Integrate AI Agent communication pathways via LLM APIs.
* [ ] Build background processing services to queue incoming code for analysis.
* [ ] Implement automated code-quality assessment and programmatic tagging.

### Project 3: Visual Interface & Integration
* [ ] Develop the unified dashboard UI for tracking code repositories.
* [ ] Establish secure state-management patterns for handling authenticated user sessions.

---

## 🔧 Local Setup

1. Clone the repository and install dependencies:
   ```bash
   npm install
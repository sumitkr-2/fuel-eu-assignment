AI Agent Workflow Log
Overview

This log documents my complete usage of AI coding assistants — Gemini (Google), ChatGPT (GPT-5), Cursor Agent, and GitHub Copilot — during development of the FuelEU Maritime Compliance Platform (full-stack assignment).

Each agent was used at different stages of the project:

Gemini — Initial environment setup, PostgreSQL config, and project bootstrapping.

ChatGPT (GPT-5) — Core backend logic, Prisma debugging, frontend integration, and bug analysis.

Cursor Agent — Refactoring and path-alias fixes for TypeScript imports.

GitHub Copilot — Inline completions and minor syntax fixes (especially JSX + Tailwind).

🧩 Agents Used
Agent	Primary Use
Gemini	Initial scaffolding, Prisma schema, DB setup
ChatGPT (GPT-5)	Core backend API design, compliance formulas, debugging
Cursor Agent	TypeScript refactoring, alias debugging
Copilot	Tailwind and boilerplate JSX generation
🧱 Example 1 — Project Setup and Database Schema (Gemini)

Prompt:

“I’m working on a full-stack assignment using Node.js, TypeScript, and PostgreSQL with Hexagonal Architecture. Please guide me through initializing dependencies, configuring TypeScript, and defining Prisma schema based on the provided table.”

AI Output Highlights

Generated full tsconfig.json with path mappings (@core, @adapters, etc.).

Installed and configured express, prisma, @prisma/client, ts-node-dev, dotenv.

Suggested PostgreSQL installation via brew install postgresql@16.

Created initial schema.prisma with Route model fields from the brief.

Fixes Made After Testing

psql: command not found → fixed with brew link postgresql@16.

Prisma couldn’t connect → added .env with DATABASE_URL.

Migration permission error →

ALTER USER fueleu_admin CREATEDB;


Validation – npx prisma migrate dev created fueleu_db and seeded 5 routes.
Observation – Gemini was great for boilerplate, weak on alias/path issues.

⚙️ Example 2 — Express Server Entrypoint (Gemini → Cursor)

Prompt:

“Create the backend entrypoint (server.ts, index.ts) and include a dev script using ts-node-dev.”

Output

// server.ts
import express from "express";
export function createServer() {
  const app = express();
  app.use(express.json());
  app.get("/health", (_, res) => res.status(200).send({ status: "ok" }));
  return app;
}

// index.ts
import * as dotenv from "dotenv";
dotenv.config();
import { createServer } from "./infrastructure/server/server";
const port = process.env.PORT || 4000;
const app = createServer();
app.listen(port, () => console.log(`[Server] Running at ${port}`));


Correction by Cursor Agent
Added alias loader:

"dev": "ts-node-dev -r tsconfig-paths/register --respawn --transpile-only src/index.ts"


Result: server reachable at http://localhost:4000/health.

📊 Example 3 — Database Seeding (Gemini → ChatGPT)

Prompt:

“Seed the five route records from the KPIs dataset using Prisma.”

Output

await prisma.route.deleteMany();
await prisma.route.createMany({ data: routesData });


Debugging

Gemini missed the seed script line; ChatGPT fixed it with
"prisma": { "seed": "ts-node prisma/seed.ts" }.

Explained running npx prisma db seed.

Validation: Data visible in Prisma Studio.
Observation: Gemini handled data; ChatGPT fixed execution context.

🧮 Example 4 — Routes API (GPT-5)

Prompt:

“Implement /routes and /routes/:routeId/baseline endpoints using Hexagonal Architecture.”

Generated Files

core/domain/Route.ts

core/ports/outbound/RouteRepository.ts

adapters/outbound/postgres/PrismaRouteRepository.ts

core/application/usecases/GetRoutes.ts

core/application/usecases/SetBaselineRoute.ts

adapters/inbound/http/RouteController.ts

Key Feature:
setBaseline() used prisma.$transaction() to unset/set baseline atomically.

Validation: /routes returned JSON; aliases fixed manually.
Observation: GPT-5 followed Clean Architecture flawlessly.

⚖️ Example 5 — Comparison Endpoint

Prompt:

“Implement /routes/comparison returning baseline, percentDiff, and compliant flag.”

const percentDiff = ((r.ghgIntensity - baseline.ghgIntensity) / baseline.ghgIntensity) * 100;
const compliant = r.ghgIntensity <= baseline.ghgIntensity;


Fix: renamed differencePercent → percentDiff to match frontend.
Result: comparison chart and table rendered correctly.

🌍 Example 6 — Compliance Balance (CB)

Prompt:

“Build /compliance/cb and /compliance/adjusted-cb using formula
CB = (Baseline GHG − Route GHG) × Distance.”

const cbGco2eq = (baseline.ghgIntensity - route.ghgIntensity) * route.distance;
const adjustedCb = cbGco2eq * 0.95;


Handled missing baselines; validated via curl.
GPT-5 reasoning accurate; negatives handled gracefully.

💰 Example 7 — Banking API (Article 20)

Prompt:

“Implement /banking/bank and /banking/apply validating surplus/deficit.”

Highlights:

Domain BankEntry.ts, repository, immutable ledger (credits/debits).

Validations for insufficient balance.

Test Flow

/compliance/cb?routeId=R002&year=2024

POST /banking/bank

GET /banking/records → shows surplus

POST /banking/apply → deficit reduced

Observation: Clean use-case separation and validation logic.

⚓ Example 8 — Pooling API (Article 21)

Prompt:

“Implement pooling with Σ(adjustedCB) ≥ 0 and prevent worsening deficits.”

Features:

Pool & PoolMember models.

Greedy surplus-to-deficit allocation.

Validation for invalid pools.

Result: Invalid pools blocked; valid pools accepted; UI shows red/green totals.

🧠 Validation & Debugging Summary
Problem	Agent	Fix
Prisma unique constraint	GPT-5	deleteMany before seed
TS path alias error	Cursor	Added -r tsconfig-paths/register
PercentDiff not showing	GPT-5	Renamed key
CB negative handling	Manual	Added baseline check
DB permissions	Gemini	ALTER USER ... CREATEDB
📈 Observations
Area	Value of AI
Setup	10× faster project bootstrapping
Prisma schema	Saved manual modeling time
Business logic	GPT-5 accurately modeled EU formulas
Debugging	GPT-5 + Cursor fixed TS/alias errors
Documentation	Generated structured MDs rapidly
🧩 Best Practices Followed

Hexagonal architecture (core / adapters / infrastructure)

Prisma transactions for atomicity

Validation before mutations

TypeScript strict mode

Reusable domain logic for CB/Banking/Pooling

Incremental commits showing AI workflow

🚀 Summary

AI agents dramatically accelerated development while maintaining architectural integrity.
Gemini handled setup, GPT-5 managed reasoning and refactoring, and Cursor + Copilot filled syntax gaps.
Manual validation ensured regulatory and logical correctness.
FuelEU Maritime Compliance Platform 🛳️

A full-stack implementation of the FuelEU Maritime Regulation (EU 2023/1805) compliance platform.
It models Compliance Balances (CB), Banking, Pooling, and Route Comparison using a clean Hexagonal Architecture.

⚙️ Tech Stack
Layer	Technology
Frontend	React + TypeScript + TailwindCSS
Backend	Node.js + Express + TypeScript
Database	PostgreSQL + Prisma ORM
Architecture	Hexagonal / Ports & Adapters
Tools	Docker (optional), ESLint, Prettier
AI Agents	Gemini, ChatGPT (GPT-5), Cursor, Copilot
🧱 Architecture Overview
backend/
  core/
    domain/            # Entities (Route, BankEntry, Pool, etc.)
    application/        # Use-cases (ComputeCB, BankSurplus, etc.)
    ports/              # Interfaces (repositories)
  adapters/
    inbound/http/       # Controllers / Routers
    outbound/postgres/  # Prisma repository adapters
  infrastructure/
    db/                 # Prisma schema & migrations
    server/             # Express server setup
frontend/
  src/
    core/               # Domain logic & hooks
    adapters/           # API clients / UI
    shared/             # Components & utils


Principles followed

Dependency inversion (core → ports → adapters)

No framework dependencies in core/

All formulas implemented in use-cases, not controllers

🚀 Quick Start
1️⃣ Backend Setup
cd backend
npm install
cp .env.example .env
# edit DATABASE_URL if needed
npx prisma migrate dev --name init
npx prisma db seed
npm run dev


Server runs at http://localhost:3001.

2️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Frontend runs at http://localhost:5173 (Vite default).

3️⃣ Environment Variables

backend/.env

DATABASE_URL="postgresql://fueleu_admin:password@localhost:5432/fueleu_db?schema=public"
PORT=3001


frontend/.env

VITE_API_BASE_URL="http://localhost:3001"

🔗 API Endpoints
/routes
Method	Endpoint	Description
GET	/routes	Fetch all routes
POST	/routes/:routeId/baseline	Set baseline route
GET	/routes/comparison	Compare baseline vs others
/compliance
Method	Endpoint	Description
GET	/compliance/cb?routeId&year	Compute Compliance Balance
GET	/compliance/adjusted-cb?routeId&year	Compute Adjusted CB (× 0.95)
/banking
Method	Endpoint	Description
GET	/banking/records?routeId&year	Get bank history
POST	/banking/bank	Bank surplus CB
POST	/banking/apply	Apply banked surplus to deficit
/pools
Method	Endpoint	Description
POST	/pools	Create compliance pool
GET	/pools	View pools & members
🧮 Core Formulae
Concept	Formula
Target Intensity (2025)	89.3368 gCO₂e/MJ
Energy in scope (MJ)	fuelConsumption × 41 000
Compliance Balance	(Target − Actual) × Energy
Adjusted CB	CB × 0.95
Pooling Rule	Σ(adjustedCB) ≥ 0
💡 Example Requests
Compute CB
curl "http://localhost:3001/compliance/cb?routeId=R002&year=2024"

Bank Surplus
curl -X POST http://localhost:3001/banking/bank \
     -H "Content-Type: application/json" \
     -d '{"routeId":"R002","year":2024}'

Pooling
curl -X POST http://localhost:3001/pools \
     -H "Content-Type: application/json" \
     -d '{"members":[{"routeId":"R002"},{"routeId":"R004"}],"year":2025}'

🧩 Frontend Tabs
Tab	Function
Routes	Lists routes, lets you set baseline
Compare	Baseline vs others, % difference chart
Banking	Bank surplus / apply deficit
Pooling	Combine ships, validate pool compliance
🧰 AI Agent Collaboration

See AGENT_WORKFLOW.md
 for detailed AI usage log:
Gemini → setup, GPT-5 → logic & debugging, Cursor → path fixes, Copilot → UI boilerplate.

🧩 Reflection & Documentation

REFLECTION.md
: personal essay on AI-assisted workflow

AGENT_WORKFLOW.md
: detailed AI usage log

🏁 Author

# Sumit Kumar  
**Full-Stack Developer | AI-Assisted Engineering**

[🔗 LinkedIn Profile](https://www.linkedin.com/in/sumit-kumar2004/)

📧 **sumit.kumar120664@gmail.com**

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { routesRouter } from "./adapters/inbound/http/routesController";
import { bankingRouter } from "./adapters/inbound/http/bankingController";
import { poolingRouter } from "./adapters/inbound/http/poolingController";
import { complianceRouter } from "./adapters/inbound/http/complianceController";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/", (_req, res) => res.send("🚢 FuelEU Maritime Backend running!"));

// ✅ Mount API routes
app.use("/routes", routesRouter);
app.use("/banking", bankingRouter);
app.use("/pooling", poolingRouter);
app.use("/compliance", complianceRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log("✅ Prisma connected");
    console.log(`🚀 Backend running at http://localhost:${PORT}`);
  } catch (e) {
    console.error("❌ Prisma connection failed", e);
  }
});

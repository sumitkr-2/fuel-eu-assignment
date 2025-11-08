import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const bankingRouter = express.Router();
const prisma = new PrismaClient();

// --- Utility: Compute Compliance Balance (CB) ---
async function computeCB(year: number) {
  const routes = await prisma.route.findMany({ where: { year } });
  const target = 89.3368;
  const MJ_PER_TON = 41000;

  return routes.map((r) => {
    const energy = r.fuelConsumption * MJ_PER_TON;
    const cb = (target - r.ghgIntensity) * energy;
    return {
      routeId: r.routeId,
      year: r.year,
      cb,
      status: cb >= 0 ? "Surplus" : "Deficit",
    };
  });
}

// ✅ GET /banking/banked — Fetch total banked balance
bankingRouter.get("/banked", async (req: Request, res: Response) => {
  try {
    const { routeId } = req.query;
    if (!routeId) return res.status(400).json({ error: "routeId required" });

    const entries = await prisma.bankEntry.findMany({
      where: { routeId: String(routeId) },
    });

    const total = entries.reduce(
      (sum, e) => sum + (e.credit ?? 0) - (e.debit ?? 0),
      0
    );

    res.json({ routeId, amount: total });
  } catch (err) {
    console.error("❌ Error fetching banked balance:", err);
    res.status(500).json({ error: "Failed to fetch banked balance" });
  }
});

// ✅ POST /banking/bank — Bank surplus
bankingRouter.post("/bank", async (req: Request, res: Response) => {
  try {
    const { routeId, year } = req.body;
    const cbData = await computeCB(year);
    const routeCB = cbData.find((r) => r.routeId === routeId);

    if (!routeCB) return res.status(404).json({ error: "Route not found" });
    if (routeCB.cb <= 0) return res.status(400).json({ error: "No surplus CB to bank" });

    const entry = await prisma.bankEntry.create({
      data: {
        routeId,
        credit: routeCB.cb,
        debit: 0,
        balance: routeCB.cb,
      },
    });

    res.json({ message: "CB banked successfully", entry });
  } catch (err) {
    console.error("❌ Banking error:", err);
    res.status(500).json({ error: "Failed to bank CB" });
  }
});

// ✅ POST /banking/apply — Apply banked CB
bankingRouter.post("/apply", async (req: Request, res: Response) => {
  try {
    const { routeId, amount } = req.body;

    const banked = await prisma.bankEntry.findMany({
      where: { routeId },
      orderBy: { createdAt: "desc" },
    });

    const totalBanked = banked.reduce(
      (sum, e) => sum + (e.credit ?? 0) - (e.debit ?? 0),
      0
    );

    if (totalBanked < amount)
      return res.status(400).json({ error: "Insufficient banked balance" });

    const entry = await prisma.bankEntry.create({
      data: {
        routeId,
        credit: 0,
        debit: amount,
        balance: totalBanked - amount,
      },
    });

    res.json({
      message: "Applied banked CB successfully",
      entry,
    });
  } catch (err) {
    console.error("❌ Apply error:", err);
    res.status(500).json({ error: "Failed to apply banked CB" });
  }
});

export { bankingRouter };

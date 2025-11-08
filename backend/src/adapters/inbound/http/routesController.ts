import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// ✅ Get all routes
router.get("/", async (_req: Request, res: Response) => {
  try {
    const routes = await prisma.route.findMany();
    res.json(routes);
  } catch (err) {
    console.error("Error fetching routes:", err);
    res.status(500).json({ error: "Failed to fetch routes" });
  }
});

// ✅ Set baseline route
router.post("/:routeId/baseline", async (req: Request, res: Response) => {
  try {
    const { routeId } = req.params;

    // 1️⃣ Reset all routes to non-baseline
    await prisma.route.updateMany({ data: { isBaseline: false } });

    // 2️⃣ Set the chosen route as baseline
    const updated = await prisma.route.update({
      where: { routeId },
      data: { isBaseline: true },
    });

    res.json({ message: `✅ Baseline set for ${routeId}`, updated });
  } catch (err) {
    console.error("Error setting baseline:", err);
    res.status(500).json({ error: "Failed to set baseline" });
  }
});

// ✅ Compare baseline vs others
router.get("/comparison", async (_req: Request, res: Response) => {
  try {
    const baseline = await prisma.route.findFirst({ where: { isBaseline: true } });
    if (!baseline) return res.json({ error: "No baseline route found" });

    const others = await prisma.route.findMany({
      where: { routeId: { not: baseline.routeId } },
    });

    const comparison = others.map((r) => {
      const percentDiff = ((r.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
      return {
        routeId: r.routeId,
        vesselType: r.vesselType,
        fuelType: r.fuelType,
        ghgIntensity: r.ghgIntensity,
        baselineIntensity: baseline.ghgIntensity,
        percentDiff: Number(percentDiff.toFixed(2)),
        compliant: r.ghgIntensity <= 89.3368,
      };
    });

    res.json({ baseline, comparison });
  } catch (err) {
    console.error("Comparison error:", err);
    res.status(500).json({ error: "Comparison failed" });
  }
});

export const routesRouter = router;

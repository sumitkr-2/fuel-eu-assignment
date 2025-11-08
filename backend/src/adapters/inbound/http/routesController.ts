import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * ✅ Get all routes
 */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const routes = await prisma.route.findMany();
    res.json(routes);
  } catch (err) {
    console.error("❌ Error fetching routes:", err);
    res.status(500).json({ error: "Failed to fetch routes" });
  }
});

/**
 * ✅ Set a route as the baseline
 */
router.post("/:routeId/baseline", async (req: Request, res: Response) => {
  try {
    const { routeId } = req.params;

    // Reset all to non-baseline
    await prisma.route.updateMany({ data: { isBaseline: false } });

    // Set chosen route as baseline
    const updated = await prisma.route.update({
      where: { routeId },
      data: { isBaseline: true },
    });

    res.json({ message: `✅ Baseline set for ${routeId}`, updated });
  } catch (err) {
    console.error("❌ Error setting baseline:", err);
    res.status(500).json({ error: "Failed to set baseline" });
  }
});

/**
 * ✅ Compare baseline vs all other routes
 * Difference (%) = ((routeGHG - baselineGHG) / baselineGHG) * 100
 * Compliant = routeGHG <= baselineGHG
 */
router.get("/comparison", async (_req: Request, res: Response) => {
  try {
    const baseline = await prisma.route.findFirst({ where: { isBaseline: true } });

    if (!baseline) {
      return res.status(404).json({ error: "No baseline route found" });
    }

    const others = await prisma.route.findMany({
      where: { routeId: { not: baseline.routeId } },
    });

    const comparison = others.map((r) => {
      const percentDiff =
        ((r.ghgIntensity - baseline.ghgIntensity) / baseline.ghgIntensity) * 100;

      return {
        routeId: r.routeId,
        vesselType: r.vesselType,
        fuelType: r.fuelType,
        ghgIntensity: r.ghgIntensity,
        baselineIntensity: baseline.ghgIntensity,
        percentDiff: Number(percentDiff.toFixed(2)), // ✅ renamed
        compliant: r.ghgIntensity <= baseline.ghgIntensity,
      };
    });

    res.json({
      baseline: {
        routeId: baseline.routeId,
        fuelType: baseline.fuelType,
        ghgIntensity: baseline.ghgIntensity,
        year: baseline.year,
      },
      comparison,
    });
  } catch (err) {
    console.error("❌ Comparison error:", err);
    res.status(500).json({ error: "Comparison failed" });
  }
});

export const routesRouter = router;

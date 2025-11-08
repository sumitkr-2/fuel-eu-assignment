import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * Compliance Balance (CB) logic:
 * CB = (baseline GHG - route GHG) * distance
 * AdjustedCB = CB * 0.95
 * Compliance: route GHG <= baseline GHG → "Yes" else "No"
 */

// ✅ Get compliance balance (CB)
router.get("/cb", async (req: Request, res: Response) => {
  try {
    const { routeId, year } = req.query;

    const route = await prisma.route.findFirst({
      where: { routeId: String(routeId), year: Number(year) },
    });

    if (!route)
      return res.status(404).json({ error: "Route not found for given year" });

    // find baseline of same or nearest previous year
    const baseline = await prisma.route.findFirst({
      where: {
        isBaseline: true,
        year: { lte: route.year },
      },
      orderBy: { year: "desc" },
    });

    if (!baseline)
      return res.status(404).json({ error: "No baseline route found" });

    const cbGco2eq =
      (baseline.ghgIntensity - route.ghgIntensity) * route.distance;

    const compliant = route.ghgIntensity <= baseline.ghgIntensity ? "Yes" : "No";

    res.json({
      routeId,
      year,
      cbGco2eq: Number(cbGco2eq.toFixed(2)),
      compliant,
      baselineYear: baseline.year,
    });
  } catch (err) {
    console.error("❌ Error computing CB:", err);
    res.status(500).json({ error: "Failed to compute CB" });
  }
});

// ✅ Get adjusted compliance balance
router.get("/adjusted-cb", async (req: Request, res: Response) => {
  try {
    const { routeId, year } = req.query;

    const route = await prisma.route.findFirst({
      where: { routeId: String(routeId), year: Number(year) },
    });

    if (!route)
      return res.status(404).json({ error: "Route not found for given year" });

    const baseline = await prisma.route.findFirst({
      where: {
        isBaseline: true,
        year: { lte: route.year },
      },
      orderBy: { year: "desc" },
    });

    if (!baseline)
      return res.status(404).json({ error: "No baseline route found" });

    const cbGco2eq =
      (baseline.ghgIntensity - route.ghgIntensity) * route.distance;
    const adjustedCb = cbGco2eq * 0.95;

    const compliant = route.ghgIntensity <= baseline.ghgIntensity ? "Yes" : "No";

    res.json({
      routeId,
      year,
      adjustedCb: Number(adjustedCb.toFixed(2)),
      compliant,
      baselineYear: baseline.year,
    });
  } catch (err) {
    console.error("❌ Error computing adjusted CB:", err);
    res.status(500).json({ error: "Failed to compute adjusted CB" });
  }
});

export { router as complianceRouter };

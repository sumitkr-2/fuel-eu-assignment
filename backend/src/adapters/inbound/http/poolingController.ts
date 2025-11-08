import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// ✅ POST /pooling
router.post("/", async (req: Request, res: Response) => {
  try {
    const { year, members } = req.body;
    if (!members || !Array.isArray(members) || members.length < 2) {
      return res.status(400).json({ error: "At least 2 members required" });
    }

    // Get adjusted CBs for each route
    const routes = await prisma.route.findMany({
      where: { routeId: { in: members.map((m: any) => m.routeId) } },
    });

    if (!routes.length) return res.status(404).json({ error: "No valid routes found" });

    // Fake CB = (89.3368 - ghgIntensity) * distance * 10
    const cbData = routes.map((r) => ({
      routeId: r.routeId,
      ship: r.vesselType,
      cbBefore: (89.3368 - r.ghgIntensity) * r.distance * 10,
    }));

    const totalCb = cbData.reduce((a, b) => a + b.cbBefore, 0);

    // Redistribute equally (simplified pooling logic)
    const adjusted = cbData.map((r) => ({
      ...r,
      cbAfter: r.cbBefore + totalCb / cbData.length - (totalCb / cbData.length),
    }));

    res.json({
      message: "Pool created successfully",
      year,
      totalCb: Number(totalCb.toFixed(2)),
      members: adjusted,
    });
  } catch (err) {
    console.error("Pooling error:", err);
    res.status(500).json({ error: "Failed to create pool" });
  }
});

export const poolingRouter = router;

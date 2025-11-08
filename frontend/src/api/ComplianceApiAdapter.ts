// frontend/src/infrastructure/api/ComplianceApiAdapter.ts
export class ComplianceApiAdapter {
  private baseUrl = import.meta.env.VITE_API_BASE || "http://localhost:4000";

  async getCb(routeId: string, year: number) {
    const res = await fetch(`${this.baseUrl}/compliance/cb?routeId=${routeId}&year=${year}`);
    if (!res.ok) throw new Error("Failed to fetch CB");
    return res.json();
  }

  async getAdjustedCb(routeId: string, year: number) {
    const res = await fetch(`${this.baseUrl}/compliance/adjusted-cb?routeId=${routeId}&year=${year}`);
    if (!res.ok) throw new Error("Failed to fetch adjusted CB");
    return res.json();
  }

  async getBanked(routeId: string, year: number) {
    const res = await fetch(`${this.baseUrl}/banking/records?routeId=${routeId}&year=${year}`);
    if (!res.ok) throw new Error("Failed to fetch bank records");
    return res.json();
  }

  async bankSurplus(routeId: string, year: number, amount: number) {
    const res = await fetch(`${this.baseUrl}/banking/bank`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ routeId, year, amount }),
    });
    if (!res.ok) throw new Error("Failed to bank surplus");
    return res.json();
  }

  async applyBank(routeId: string, year: number, amount: number) {
    const res = await fetch(`${this.baseUrl}/banking/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ routeId, year, amount }),
    });
    if (!res.ok) throw new Error("Failed to apply banked surplus");
    return res.json();
  }
}

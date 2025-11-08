export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export async function getRoutes() {
  const res = await fetch(`${API_BASE}/routes`);
  return res.json();
}

export async function setBaseline(routeId: string) {
  const res = await fetch(`${API_BASE}/routes/${routeId}/baseline`, { method: 'POST' });
  return res.json();
}

export async function getComparison() {
  const res = await fetch(`${API_BASE}/routes/comparison`);
  return res.json();
}

export async function computeCB(routeId: string, year: number) {
  const res = await fetch(`${API_BASE}/compliance/cb?routeId=${routeId}&year=${year}`);
  return res.json();
}

// frontend/src/api/apiClient.ts
const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:4000';

// ====================== ROUTES ======================
export async function getRoutes() {
  const res = await fetch(`${API_BASE}/routes`);
  if (!res.ok) throw new Error('Failed to fetch routes');
  return res.json();
}

export async function setBaseline(routeId: string) {
  const res = await fetch(`${API_BASE}/routes/${routeId}/baseline`, { method: 'POST' });
  if (!res.ok) {
    let err = 'Failed to set baseline';
    try {
      const j = await res.json();
      err = j.error || err;
    } catch {}
    throw new Error(err);
  }
  return res.json();
}

export async function getComparison() {
  const res = await fetch(`${API_BASE}/routes/comparison`);
  if (!res.ok) throw new Error('Failed to fetch comparison');
  return res.json();
}

// ====================== BANKING ======================
export async function getCb(routeId: string, year: number) {
  const res = await fetch(`${API_BASE}/compliance/cb?routeId=${encodeURIComponent(routeId)}&year=${year}`);
  if (!res.ok) throw new Error('Failed to fetch CB');
  return res.json();
}

export async function getAdjustedCb(routeId: string, year: number) {
  // ✅ FIXED: correct endpoint name
  const res = await fetch(`${API_BASE}/compliance/adjusted-cb?routeId=${encodeURIComponent(routeId)}&year=${year}`);
  if (!res.ok) throw new Error('Failed to fetch adjusted CB');
  return res.json();
}

export async function getBanked(routeId: string, year: number) {
  const res = await fetch(`${API_BASE}/banking/banked?routeId=${encodeURIComponent(routeId)}&year=${year}`);
  if (!res.ok) throw new Error('Failed to fetch banked balance');
  return res.json();
}

export async function bankSurplus(routeId: string, year: number, amount: number) {
  const res = await fetch(`${API_BASE}/banking/bank`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ routeId, year, amount }),
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({ error: 'Bank failed' }));
    throw new Error(j.error || 'Bank failed');
  }
  return res.json();
}

export async function applyBank(routeId: string, year: number, amount: number) {
  const res = await fetch(`${API_BASE}/banking/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ routeId, year, amount }),
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({ error: 'Apply failed' }));
    throw new Error(j.error || 'Apply failed');
  }
  return res.json();
}

// ====================== POOLING ======================
export async function createPool(year: number, members: { routeId: string }[]) {
  const res = await fetch(`${API_BASE}/pooling`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ year, members }),
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({ error: 'Create pool failed' }));
    throw new Error(j.error || 'Create pool failed');
  }
  return res.json();
}

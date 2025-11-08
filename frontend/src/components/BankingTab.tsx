import { useState } from "react";
import { getCb, getAdjustedCb, getBanked, bankSurplus, applyBank } from "../api/apiClient";

export default function BankingTab() {
  const [shipId, setShipId] = useState("R001");
  const [year, setYear] = useState<number>(2025);
  const [cb, setCb] = useState<number | null>(null);
  const [adjusted, setAdjusted] = useState<number | null>(null);
  const [banked, setBanked] = useState<number | null>(0);
  const [message, setMessage] = useState<string | null>(null);
  const [amountToBank, setAmountToBank] = useState<number>(0);
  const [amountToApply, setAmountToApply] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    try {
      const cbRec = await getCb(shipId, year);
      const adj = await getAdjustedCb(shipId, year);
      const bankRec = await getBanked(shipId, year);
      setCb(cbRec.cbGco2eq);
      setAdjusted(adj.adjustedCb);
      setBanked(bankRec.amount);
      setMessage(null);
    } catch (err: any) {
      setMessage("❌ Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const onBank = async () => {
    try {
      await bankSurplus(shipId, year, amountToBank);
      setMessage("✅ Banked successfully");
      await loadAll();
    } catch (err: any) {
      setMessage("⚠️ " + err.message);
    }
  };

  const onApply = async () => {
    try {
      await applyBank(shipId, year, amountToApply);
      setMessage("✅ Applied successfully");
      await loadAll();
    } catch (err: any) {
      setMessage("⚠️ " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-sky-100 to-cyan-200 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">💰 Banking Dashboard</h1>
      <div className="flex gap-4 items-center mb-6">
        <input
          value={shipId}
          onChange={(e) => setShipId(e.target.value)}
          className="border rounded px-3 py-2 shadow-sm focus:ring-2 focus:ring-sky-400"
        />
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border rounded px-3 py-2 shadow-sm focus:ring-2 focus:ring-sky-400"
        />
        <button
          onClick={loadAll}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded hover:opacity-90"
        >
          Reload
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white/80 p-4 rounded-lg shadow">
          <p className="text-gray-600">CB:</p>
          <h2 className={`text-2xl font-bold ${cb && cb < 0 ? "text-red-600" : "text-green-600"}`}>
            {cb ?? "-"}
          </h2>
        </div>
        <div className="bg-white/80 p-4 rounded-lg shadow">
          <p className="text-gray-600">Adjusted CB:</p>
          <h2 className="text-2xl font-bold text-blue-600">{adjusted ?? "-"}</h2>
        </div>
        <div className="bg-white/80 p-4 rounded-lg shadow">
          <p className="text-gray-600">Banked:</p>
          <h2 className="text-2xl font-bold text-sky-600">{banked ?? 0}</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white/80 p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">🏦 Bank Surplus</h3>
          <div className="flex gap-2">
            <input
              type="number"
              value={amountToBank}
              onChange={(e) => setAmountToBank(Number(e.target.value))}
              className="border rounded px-3 py-2 w-40"
            />
            <button
              onClick={onBank}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded hover:opacity-90"
            >
              Bank
            </button>
          </div>
        </div>

        <div className="bg-white/80 p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">📤 Apply Banked Surplus</h3>
          <div className="flex gap-2">
            <input
              type="number"
              value={amountToApply}
              onChange={(e) => setAmountToApply(Number(e.target.value))}
              className="border rounded px-3 py-2 w-40"
            />
            <button
              onClick={onApply}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded hover:opacity-90"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div className="mt-6 p-3 rounded text-sm bg-white/70 shadow text-gray-800">
          {message}
        </div>
      )}
    </div>
  );
}

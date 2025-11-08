import { useState } from "react";
import { createPool, getAdjustedCb } from "../api/apiClient";

export default function PoolingTab() {
  const [year, setYear] = useState(2025);
  const [poolData, setPoolData] = useState<any[] | null>(null);
  const [message, setMessage] = useState("");
  
  // --- ADDED for better UX ---
  // We use two so the buttons can load independently
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingPool, setLoadingPool] = useState(false);
  // ---

  const handleFetch = async () => {
    setLoadingFetch(true);
    setMessage(""); // Clear old messages
    setPoolData(null); // Clear old data
    try {
      // NOTE: Your logic fetches R001 and R002. This is preserved.
      const adjusted1 = await getAdjustedCb("R001", year);
      const adjusted2 = await getAdjustedCb("R002", year);
      setPoolData([
        { routeId: "R001", adjustedCb: adjusted1.adjustedCb },
        { routeId: "R002", adjustedCb: adjusted2.adjustedCb },
      ]);
    } catch (e: any) {
      setMessage(e?.response?.data?.error ?? "❌ Failed to fetch adjusted CB");
    } finally {
      setLoadingFetch(false);
    }
  };

  const handlePool = async () => {
    setLoadingPool(true);
    setMessage(""); // Clear old messages
    try {
      // NOTE: Your logic creates a pool for R001 and R002. This is preserved.
      const res = await createPool(year, [
        { routeId: "R001" },
        { routeId: "R002" },
      ]);
      setMessage(`✅ ${res.message}` || "✅ Pool created successfully");
    } catch (e: any) {
      setMessage(e?.response?.data?.error ?? "❌ Failed to create pool");
    } finally {
      setLoadingPool(false);
    }
  };

  // --- Helpers for styling the message ---
  const isLoading = loadingFetch || loadingPool;
  const isSuccess = message?.startsWith("✅");
  const isError = message?.startsWith("❌");

  return (
    // --- Card Layout ---
    <div className="max-w-3xl mx-auto p-6 md:p-8 bg-white rounded-xl shadow-2xl">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6 border-b pb-4">
        ⚓ Pooling
      </h2>

      {/* --- Controls Area --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-6">
        <div>
          <label
            htmlFor="pool-year"
            className="block text-sm font-medium text-slate-600 mb-1"
          >
            Year
          </label>
          <input
            type="number"
            id="pool-year"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            disabled={isLoading}
          />
        </div>
        
        <button
          onClick={handleFetch}
          className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-wait"
          disabled={isLoading}
        >
          {loadingFetch ? "Fetching..." : "Fetch adjusted CBs"}
        </button>

        <button
          onClick={handlePool}
          className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-wait"
          disabled={isLoading}
        >
          {loadingPool ? "Creating..." : "Create & Allocate Pool"}
        </button>
      </div>

      {/* --- Message/Alert Area --- */}
      {message && (
        <div
          className={`mb-4 p-4 rounded-md font-medium text-sm ${
            isSuccess
              ? "bg-green-50 text-green-800 border border-green-200"
              : isError
              ? "bg-red-50 text-red-800 border border-red-200"
              : "bg-slate-50 text-slate-700 border border-slate-200" // Default
          }`}
        >
          {message}
        </div>
      )}

      {/* --- Data Table Area --- */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-slate-200">
        <table className="w-full text-sm">
          {/* --- Table Header --- */}
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Route ID
              </th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Adjusted CB (gCO₂eq)
              </th>
            </tr>
          </thead>
          
          {/* --- Table Body --- */}
          <tbody className="divide-y divide-slate-200">
            {poolData &&
              poolData.map((r: any) => (
                <tr key={r.routeId} className="hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-800">
                    {r.routeId}
                  </td>
                  <td className="p-4 text-slate-700">
                    {/* Added number formatting like in your BankingPanel */}
                    {r.adjustedCb?.toFixed(0) ?? "N/A"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* --- Empty/Loading States --- */}
        {!poolData && (
          <div className="p-12 text-center">
            <h3 className="text-lg font-medium text-slate-600">
              {loadingFetch ? "Loading Data..." : "No Data"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {loadingFetch
                ? "Fetching compliance data for routes..."
                : "Click 'Fetch adjusted CBs' to see data."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
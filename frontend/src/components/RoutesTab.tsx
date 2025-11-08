import { useEffect, useState } from "react";
import { getRoutes, setBaseline } from "../api/apiClient";

// --- LOGIC UNCHANGED ---
export default function RoutesTab() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadRoutes = async () => {
    try {
      setLoading(true);
      setMessage(null);
      const data = await getRoutes();
      setRoutes(data);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to load routes");
    } finally {
      setLoading(false);
    }
  };

  const handleBaseline = async (routeId: string) => {
    try {
      setMessage(null);
      setUpdatingId(routeId);

      await setBaseline(routeId);
      setMessage("✅ Baseline updated successfully");

      const data = await getRoutes();
      setRoutes(data);
    } catch (err: any) {
      setMessage(err.message || "❌ Error setting baseline");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);
  // --- END OF LOGIC ---

  const isSuccess = message?.startsWith("✅");
  const isError = message?.startsWith("❌");

  // --- START OF NEW STYLED JSX (DARK THEME) ---
  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-8 text-slate-300">
      <div className="max-w-7xl mx-auto transition-all duration-300">
        <h1 className="text-3xl font-bold mb-6 text-white">
          🌊 Routes Overview
        </h1>

        {/* --- Alert / Message Area (Dark Theme) --- */}
        {message && (
          <div
            className={`mb-4 p-4 rounded-lg shadow-md font-medium text-sm transition-all duration-300 ${
              isSuccess
                ? "bg-green-900/30 border border-green-700 text-green-300"
                : isError
                ? "bg-red-900/30 border border-red-700 text-red-300"
                : "bg-slate-700 border border-slate-600 text-slate-300"
            }`}
            role="alert"
          >
            {message}
          </div>
        )}

        {/* --- Loading State (Dark Theme) --- */}
        {loading && routes.length === 0 && (
          <div className="flex justify-center items-center p-12 bg-slate-800/70 backdrop-blur-md rounded-xl shadow-md animate-pulse">
            <p className="text-lg font-medium text-slate-300">
              Loading routes...
            </p>
          </div>
        )}

        {/* --- Table Container (Dark Theme) --- */}
        <div className="overflow-x-auto bg-slate-800/70 backdrop-blur-md rounded-xl shadow-lg transition-opacity duration-500 border border-slate-700/50">
          <table className="w-full text-sm">
            {/* --- Table Header (Dark Theme) --- */}
            <thead className="bg-slate-700 text-slate-300">
              <tr>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Route ID
                </th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Vessel Type
                </th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Fuel Type
                </th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider">
                  GHG Intensity
                </th>
                <th className="p-4 text-center text-xs font-semibold uppercase tracking-wider">
                  Baseline
                </th>
                <th className="p-4 text-center text-xs font-semibold uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>

            {/* --- Table Body (Dark Theme) --- */}
            <tbody className="divide-y divide-slate-700">
              {routes.map((r) => (
                <tr
                  key={r.routeId}
                  className={`relative transition-all duration-300 ease-in-out
                            ${
                              r.isBaseline
                                ? "bg-indigo-900/50" // Selected state
                                : "hover:bg-slate-700/50" // Hover state
                            }
                            ${
                              updatingId === r.routeId
                                ? "opacity-50 animate-pulse" // Updating state
                                : ""
                            }
                           `}
                >
                  <td className="p-4 font-medium text-white">{r.routeId}</td>
                  <td className="p-4 text-slate-300">{r.vesselType}</td>
                  <td className="p-4 text-slate-300">{r.fuelType}</td>
                  <td className="p-4 text-slate-300">{r.ghgIntensity}</td>
                  <td className="p-4 text-center">
                    {/* --- Badges (Dark Theme) --- */}
                    {r.isBaseline ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-400 text-green-900">
                        ✅ Selected
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-600 text-slate-200">
                        ❌ Not Baseline
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {/* --- Button (Dark Theme) --- */}
                    <button
                      className="px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium rounded-md shadow-sm 
                                 hover:from-indigo-400 hover:to-purple-400 hover:scale-105 hover:shadow-lg
                                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-400 
                                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                                 transition-all duration-300 ease-in-out"
                      onClick={() => handleBaseline(r.routeId)}
                      disabled={loading || !!updatingId}
                    >
                      {updatingId === r.routeId ? "Setting..." : "Set Baseline"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* --- Empty State (Dark Theme) --- */}
          {!loading && routes.length === 0 && (
            <div className="p-12 text-center">
              <h3 className="text-lg font-medium text-slate-400">
                No Routes Found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                There are no routes to display at this time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
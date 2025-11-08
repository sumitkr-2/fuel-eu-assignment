import { useEffect, useState } from "react";
import { getRoutes, setBaseline } from "../api/apiClient";

// --- LOGIC UPDATED SLIGHTLY FOR TRANSITIONS ---
export default function RoutesTab() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  
  // --- NEW STATE ---
  // Tracks the ID of the route being updated for a per-row loading state
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
      // --- START SELECTION TRANSITION ---
      setUpdatingId(routeId); 

      await setBaseline(routeId);
      setMessage("✅ Baseline updated successfully");
      
      // Reload routes *without* the global loading screen
      // to see the transition
      const data = await getRoutes();
      setRoutes(data);

    } catch (err: any) {
      setMessage(err.message || "❌ Error setting baseline");
    } finally {
      // --- END SELECTION TRANSITION ---
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);
  // --- END OF LOGIC CHANGES ---

  const isSuccess = message?.startsWith("✅");
  const isError = message?.startsWith("❌");

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-cyan-100 to-blue-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto transition-all duration-300">
        <h1 className="text-3xl font-bold mb-6 text-slate-900">
          🌊 Routes Overview
        </h1>

        {/* --- Alert / Message Area --- */}
        {message && (
          <div
            className={`mb-4 p-4 rounded-lg shadow-md font-medium text-sm transition-all duration-300 ${
              isSuccess
                ? "bg-green-100/80 border border-green-300 text-green-800"
                : isError
                ? "bg-red-100/80 border border-red-300 text-red-800"
                : "bg-white/80 border border-slate-200 text-slate-700"
            }`}
            role="alert"
          >
            {message}
          </div>
        )}

        {/* --- Loading State (for initial load) --- */}
        {loading && routes.length === 0 && (
          <div className="flex justify-center items-center p-12 bg-white/70 backdrop-blur-md rounded-xl shadow-md animate-pulse">
            <p className="text-lg font-medium text-sky-700">Loading routes...</p>
          </div>
        )}

        {/* --- Table Container --- */}
        <div className="overflow-x-auto bg-white/70 backdrop-blur-md rounded-xl shadow-lg transition-opacity duration-500">
          <table className="w-full text-sm">
            {/* --- Table Header --- */}
            <thead className="bg-gradient-to-r from-sky-600 to-blue-600 text-white">
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

            {/* --- Table Body --- */}
            <tbody className="divide-y divide-blue-100">
              {routes.map((r) => (
                /*
                  --- TRANSITIONS ADDED HERE ---
                  1. `r.isBaseline ? 'bg-sky-100/90' : '...'` - Highlights the selected row.
                  2. `hover:bg-white/90` - Only applies if NOT the selected baseline.
                  3. `updatingId === r.routeId ? 'opacity-50 animate-pulse' : ''` - Fades and pulses the row during its specific update.
                */
                <tr
                  key={r.routeId}
                  className={`relative transition-all duration-300 ease-in-out
                            ${r.isBaseline
                              ? 'bg-sky-100/90' // Selected state
                              : 'hover:bg-white/90 hover:shadow-lg hover:z-10' // Hover state
                            }
                            ${updatingId === r.routeId
                              ? 'opacity-50 animate-pulse' // Updating state
                              : ''
                            }
                           `}
                >
                  <td className="p-4 font-medium text-slate-800">
                    {r.routeId}
                  </td>
                  <td className="p-4 text-slate-700">{r.vesselType}</td>
                  <td className="p-4 text-slate-700">{r.fuelType}</td>
                  <td className="p-4 text-slate-700">{r.ghgIntensity}</td>
                  <td className="p-4 text-center">
                    {/* --- IMPROVED BADGE TEXT --- */}
                    {r.isBaseline ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✅ Selected
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        ❌ Not Baseline
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {/* --- UPDATED BUTTON --- */}
                    <button
                      className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium rounded-md shadow-sm 
                                 hover:from-blue-600 hover:to-cyan-600 hover:scale-105 hover:shadow-lg
                                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 transition-all duration-300 ease-in-out"
                      onClick={() => handleBaseline(r.routeId)}
                      // Disable ALL buttons if initial load OR *any* row is updating
                      disabled={loading || !!updatingId} 
                    >
                      {/* Show 'Setting...' only for the row being updated */}
                      {updatingId === r.routeId ? 'Setting...' : 'Set Baseline'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* --- Empty State --- */}
          {!loading && routes.length === 0 && (
            <div className="p-12 text-center">
              <h3 className="text-lg font-medium text-slate-600">
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
import { useEffect, useState } from "react";
import { getRoutes, setBaseline } from "../api/apiClient";

export default function RoutesTab() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getRoutes()
      .then(setRoutes)
      .catch((err) => setError("Failed to load routes"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6 text-gray-500">Loading routes...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Routes Overview</h2>
      {routes.length === 0 ? (
        <p>No routes available.</p>
      ) : (
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Route</th>
              <th className="p-2 border">Fuel Type</th>
              <th className="p-2 border">Emission</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((r) => (
              <tr key={r.id}>
                <td className="p-2 border">{r.name}</td>
                <td className="p-2 border">{r.fuelType}</td>
                <td className="p-2 border">{r.emission}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => setBaseline(r.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Set Baseline
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

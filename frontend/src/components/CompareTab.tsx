// frontend/src/components/CompareTab.tsx
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

// --- NO CHANGES TO ANY LOGIC ---
export default function CompareTab() {
  const [data, setData] = useState<any[]>([]);
  const [baseline, setBaseline] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

  const fetchComparison = async () => {
    try {
      const res = await fetch(`${API_BASE}/routes/comparison`);
      const json = await res.json();
      if (json.error) {
        setError(json.error);
        setLoading(false);
        return;
      }
      setBaseline(json.baseline);
      setData(json.comparison);
      setLoading(false);
    } catch (e: any) {
      setError("Failed to fetch comparison data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison();
  }, []);
  // --- END OF UNCHANGED LOGIC ---

  // --- START OF NEW STYLED JSX ---

  // --- Styled Loading State ---
  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg font-medium text-indigo-600">
          Loading comparison data...
        </p>
      </div>
    );
  }

  // --- Styled Error State ---
  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg shadow-md font-medium">
          {error}
        </div>
      </div>
    );
  }

  // --- Styled Empty State ---
  if (!data.length) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-medium text-slate-600">No Data</h3>
        <p className="mt-1 text-sm text-slate-500">
          No comparison data available.
        </p>
      </div>
    );
  }

  // --- Main Styled Component ---
  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 bg-white rounded-xl shadow-2xl">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6 border-b pb-4">
        📊 GHG Intensity Comparison
      </h2>

      {/* --- Baseline Stat Card --- */}
      <div className="p-6 bg-slate-50 rounded-lg shadow-sm mb-8">
        <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">
          Baseline Route
        </div>
        <div className="mt-1">
          <span className="text-3xl font-bold text-slate-900">
            {baseline.routeId}
          </span>
          <span className="ml-2 text-xl font-medium text-slate-600">
            ({baseline.ghgIntensity} gCO₂e/MJ)
          </span>
        </div>
      </div>

      {/* --- Chart Section --- */}
      <div className="p-6 border border-slate-200 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Intensity Chart
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 40, bottom: 60, left: 20 }}
          >
            <XAxis dataKey="routeId" angle={-20} textAnchor="end" interval={0} />
            <YAxis
              label={{
                value: "GHG Intensity (gCO₂e/MJ)",
                angle: -90,
                position: "insideLeft",
                dy: 40, // Adjust position
              }}
            />
            <Tooltip />
            <Legend verticalAlign="top" />

            <Bar
              dataKey="ghgIntensity"
              name="GHG Intensity"
              fill="#4f46e5" // Theme: Indigo 600
              radius={[6, 6, 0, 0]}
            >
              <LabelList dataKey="ghgIntensity" position="top" fontSize="10" />
            </Bar>

            <Bar
              dataKey="baselineIntensity"
              name="Baseline"
              fill="#22c55e" // Theme: Green 500
              radius={[6, 6, 0, 0]}
            >
              <LabelList
                dataKey="baselineIntensity"
                position="top"
                fontSize="10"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* --- Table Section --- */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Compliance Summary
        </h3>
        <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Route
                </th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Fuel Type
                </th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  GHG Intensity
                </th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Difference (%)
                </th>
                <th className="p-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Compliant
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-800">
                    {r.routeId}
                  </td>
                  <td className="p-4 text-slate-700">{r.fuelType}</td>
                  <td className="p-4 text-slate-700">
                    {r.ghgIntensity.toFixed(2)}
                  </td>
                  <td
                    className={`p-4 font-medium ${
                      r.percentDiff <= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {r.percentDiff.toFixed(2)}%
                  </td>
                  <td className="p-4 text-center">
                    {r.compliant ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✅ Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        ❌ No
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
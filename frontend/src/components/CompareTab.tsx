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
      setData(json.comparison || []); // ✅ handle missing comparison
      setLoading(false);
    } catch (e: any) {
      setError("Failed to fetch comparison data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[500px] w-full flex-col items-center justify-center p-8 bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        <p className="mt-4 text-lg font-medium text-slate-700">
          Loading comparison data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[500px] w-full items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-lg rounded-lg bg-red-50 p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-red-900 mb-1">
            An Error Occurred
          </h3>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex min-h-[500px] w-full flex-col items-center justify-center p-8 text-center bg-slate-50">
        <h3 className="mt-4 text-xl font-semibold text-slate-700">No Data</h3>
        <p className="mt-2 text-sm text-slate-500">
          No comparison data available to display.
        </p>
      </div>
    );
  }

  return (
    // --- BACKGROUND ADDED HERE ---
    <div className="bg-slate-50 min-h-screen p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          GHG Intensity Comparison
        </h2>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* --- Baseline Card --- */}
          <div className="lg:col-span-1">
            <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 text-white shadow-lg">
              <div className="text-sm font-medium uppercase tracking-wider text-indigo-200">
                Selected Baseline
              </div>
              <div className="mt-4">
                <span className="text-4xl font-extrabold">
                  {baseline?.routeId || "N/A"}
                </span>
                <div className="mt-1 text-2xl font-medium text-indigo-100 opacity-90">
                  {baseline?.ghgIntensity
                    ? `${baseline.ghgIntensity} gCO₂e/MJ`
                    : "No baseline"}
                </div>
              </div>
            </div>
          </div>

          {/* --- Chart --- */}
          <div className="rounded-xl bg-white p-6 shadow-lg lg:col-span-2">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Intensity Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, bottom: 60, left: 20 }}
              >
                <XAxis
                  dataKey="routeId"
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                  height={70}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  label={{
                    value: "GHG Intensity (gCO₂e/MJ)",
                    angle: -90,
                    position: "insideLeft",
                    dy: 80,
                    fontSize: 14,
                    fill: "#334155",
                  }}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Legend verticalAlign="top" iconType="circle" />
                <Bar
                  dataKey="ghgIntensity"
                  name="GHG Intensity"
                  fill="#4f46e5"
                  radius={[6, 6, 0, 0]}
                >
                  <LabelList
                    dataKey="ghgIntensity"
                    position="top"
                    fontSize="10"
                  />
                </Bar>
                <Bar
                  dataKey="baselineIntensity"
                  name="Baseline"
                  fill="#22c55e"
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
        </div>

        {/* --- Table --- */}
        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
          <h3 className="border-b border-slate-200 p-6 text-xl font-semibold text-slate-900">
            Compliance Summary
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
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
                    Difference vs. Baseline (%)
                  </th>
                  <th className="p-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Compliance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.map((r, i) => (
                  <tr key={i} className="hover:bg-indigo-50">
                    <td className="p-4 font-medium text-slate-800">
                      {r.routeId || "N/A"}
                    </td>
                    <td className="p-4 text-slate-700">{r.fuelType || "N/A"}</td>
                    <td className="p-4 text-slate-700">
                      {r.ghgIntensity !== undefined
                        ? r.ghgIntensity.toFixed(2)
                        : "N/A"}
                    </td>
                    <td
                      className={`p-4 font-medium ${
                        r.percentDiff <= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {r.percentDiff !== undefined
                        ? `${
                            r.percentDiff > 0 ? "+" : ""
                          }${r.percentDiff.toFixed(2)}%`
                        : "N/A"}
                    </td>
                    <td className="p-4 text-center">
                      {r.compliant ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                          ✅ Compliant
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
                          ❌ Non-Compliant
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
    </div>
  );
}
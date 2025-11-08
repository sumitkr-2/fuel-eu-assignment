import { useEffect, useState } from "react";
import { getComparison } from "../api/apiClient";

export default function CompareTab() {
  const [comparison, setComparison] = useState<any[]>([]);

  useEffect(() => {
    getComparison().then(setComparison);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Route Comparison</h2>
      {comparison.length === 0 ? (
        <p>No comparison data available.</p>
      ) : (
        <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(comparison, null, 2)}</pre>
      )}
    </div>
  );
}

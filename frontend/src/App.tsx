import { useState } from "react";
import RoutesTab from "./components/RoutesTab";
import CompareTab from "./components/CompareTab";
import BankingTab from "./components/BankingTab";
import PoolingTab from "./components/PoolingTab";

export default function App() {
  const [tab, setTab] = useState("routes");

  const renderTab = () => {
    switch (tab) {
      case "compare":
        return <CompareTab />;
      case "banking":
        return <BankingTab />;
      case "pooling":
        return <PoolingTab />;
      default:
        return <RoutesTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow">
        <h1 className="text-2xl font-bold">Fuel EU Maritime Dashboard</h1>
        <nav className="flex gap-4">
          {["routes", "compare", "banking", "pooling"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`capitalize px-3 py-2 rounded ${
                tab === t ? "bg-white text-blue-700 font-semibold" : "hover:bg-blue-600"
              }`}
            >
              {t}
            </button>
          ))}
        </nav>
      </header>
      <main>{renderTab()}</main>
    </div>
  );
}

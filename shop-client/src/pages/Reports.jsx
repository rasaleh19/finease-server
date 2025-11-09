import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import toast from "react-hot-toast";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const Reports = () => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState("");

  useEffect(() => {
    async function fetchTxns() {
      if (!user) return setLoading(false);
      try {
        let url = `http://localhost:3000/transactions?userId=${user.id}`;
        if (month) url += `&month=${month}`;
        const res = await fetch(url);
        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch transactions");
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTxns();
  }, [user, month]);

  // Pie chart data (by category)
  const pieLabels = [...new Set(transactions.map((t) => t.categoryId))];
  const pieData = {
    labels: pieLabels,
    datasets: [
      {
        data: pieLabels.map((cat) =>
          transactions
            .filter((t) => t.categoryId === cat)
            .reduce((sum, t) => sum + Number(t.amount), 0)
        ),
        backgroundColor: [
          "#2563eb",
          "#f59e42",
          "#10b981",
          "#ef4444",
          "#6366f1",
          "#fbbf24",
          "#14b8a6",
          "#eab308",
        ],
      },
    ],
  };

  // Bar chart data (by month)
  const months = [...new Set(transactions.map((t) => t.date?.slice(0, 7)))];
  const barData = {
    labels: months,
    datasets: [
      {
        label: "Total Amount",
        data: months.map((m) =>
          transactions
            .filter((t) => t.date?.slice(0, 7) === m)
            .reduce((sum, t) => sum + Number(t.amount), 0)
        ),
        backgroundColor: "#2563eb",
      },
    ],
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Reports</h2>

      {/* Month Filter */}
      <div className="flex flex-col gap-4 mb-4">
        <label className="form-control">
          <span className="label-text">Filter by Month</span>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="input input-bordered"
          />
        </label>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : transactions.length === 0 ? (
        <p className="text-center text-gray-500">No transactions found</p>
      ) : (
        <>
          <div className="mb-8">
            <h3 className="font-semibold mb-2">Pie Chart (Categories)</h3>
            <Pie
              data={pieData}
              key={transactions.length + pieLabels.join("-")}
            />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Bar Chart (Monthly Totals)</h3>
            <Bar data={barData} key={transactions.length + months.join("-")} />
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;

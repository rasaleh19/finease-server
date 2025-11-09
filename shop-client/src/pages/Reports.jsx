import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Pie, Bar } from "react-chartjs-2";
import toast from "react-hot-toast";

const Reports = () => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    async function fetchTxns() {
      if (!user) return setLoading(false);
      try {
        let url = `http://localhost:3000/transactions?userId=${user.id}`;
        if (month) url += `&month=${month}`;
        if (category) url += `&categoryId=${category}`;
        const res = await fetch(url);
        const data = await res.json();
        setTransactions(data);
      } catch {
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTxns();
  }, [user, month, category]);

  // Pie chart data (by category)
  const pieData = {
    labels: [...new Set(transactions.map((t) => t.categoryId))],
    datasets: [
      {
        data: pieData.labels.map((cat) =>
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
        <label className="form-control">
          <span className="label-text">Filter by Category</span>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input input-bordered"
            placeholder="Category ID"
          />
        </label>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h3 className="font-semibold mb-2">Pie Chart (Categories)</h3>
            <Pie data={pieData} />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Bar Chart (Monthly Totals)</h3>
            <Bar data={barData} />
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;

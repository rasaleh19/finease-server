import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const TransactionDetails = () => {
  const { user, loading: userLoading } = useContext(AuthContext);
  const { id } = useParams(); // now id refers to the _id passed from MyTransactions
  const navigate = useNavigate();
  const [txn, setTxn] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    document.documentElement.setAttribute("data-theme", storedTheme);
  }, []);

  useEffect(() => {
    if (userLoading) return; // Wait for user context to finish loading
    if (!user) {
      navigate("/login");
      return;
    }

    async function fetchDetails() {
      try {
        // Fetch the specific transaction by _id
        const res = await fetch(`http://localhost:3000/transactions/${id}`);
        if (!res.ok) throw new Error("Transaction not found");
        const data = await res.json();
        setTxn(data);

        // Fetch all transactions for this user (for total per category)
        const resAll = await fetch(
          `http://localhost:3000/transactions?userId=${user.id}`
        );
        const allData = await resAll.json();
        setTransactions(allData);
      } catch (err) {
        console.error(err);
        setTxn(null);
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [id, user, userLoading, navigate]);

  if (userLoading || loading)
    return <div className="spinner text-center mt-12">Loading...</div>;

  if (!txn)
    return (
      <div className="text-center mt-12 text-lg text-gray-600">
        Transaction not found.
      </div>
    );

  // Total amount for this category (among all user's transactions)
  const totalInCategory = transactions
    .filter((t) => t.categoryId === txn.categoryId)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-base-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Transaction Details
        </h2>
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">Type:</span>
            <span className="text-base text-gray-900">{txn.type}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">Description:</span>
            <span className="text-base text-gray-900">{txn.description}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">Category:</span>
            <span className="text-base text-gray-900">{txn.categoryId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">Amount:</span>
            <span className="text-base text-green-700 font-bold">
              ${txn.amount}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">Date:</span>
            <span className="text-base text-gray-900">{txn.date}</span>
          </div>
          <div className="flex justify-between items-center bg-yellow-50 rounded px-2 py-1">
            <span className="font-semibold text-gray-700">
              Total Amount in Category:
            </span>
            <span className="text-base text-blue-700 font-bold">
              ${totalInCategory}
            </span>
          </div>
        </div>
        <div className="flex justify-center mt-2">
          <button
            className={
              `btn btn-outline px-8 py-2 rounded` +
              (theme === "dark"
                ? " text-black border-white bg-white hover:bg-gray-200"
                : "")
            }
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;

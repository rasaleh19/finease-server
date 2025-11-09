import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MyTransactions = () => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTxn, setEditTxn] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTxns() {
      if (!user) return setLoading(false);

      console.log("User object:", user);
      console.log("User ID:", user.id);

      const fetchUrl = `http://localhost:3000/transactions?userId=${user.id}`;
      console.log("Fetch URL:", fetchUrl);

      try {
        const res = await fetch(fetchUrl);
        if (!res.ok) {
          console.log("Fetch error:", res.status, await res.text());
          setTransactions([]);
          return;
        }
        const data = await res.json();
        // Always use id, fallback to _id for MongoDB
        const txns = data.map((t) => ({
          ...t,
          id: t.id || t._id?.toString(),
        }));
        setTransactions(txns);
      } catch (err) {
        console.log("Fetch catch error:", err);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTxns();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;

    try {
      const res = await fetch(`http://localhost:3000/transactions/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTransactions(transactions.filter((t) => t.id !== id));
        toast.success("Transaction deleted!");
      } else {
        toast.error("Delete failed.");
      }
    } catch {
      toast.error("Delete failed.");
    }
  };

  const handleEdit = (txn) => {
    setEditTxn(txn);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditTxn(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;

    const updated = {
      type: form.type.value,
      categoryId: form.categoryId.value,
      amount: Number(form.amount.value),
      description: form.description.value,
      date: form.date.value,
    };

    try {
      const res = await fetch(
        `http://localhost:3000/transactions/${editTxn.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        }
      );

      if (res.ok) {
        setTransactions(
          transactions.map((t) =>
            t.id === editTxn.id ? { ...t, ...updated } : t
          )
        );
        toast.success("Transaction updated!");
        handleModalClose();
      } else {
        toast.error("Update failed.");
      }
    } catch {
      toast.error("Update failed.");
    }
  };

  return (
    <div className="transactions-container max-w-2xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800">My Transactions</h2>

      {loading ? (
        <div className="spinner">Loading...</div>
      ) : (
        <div className="txn-list">
          {transactions.length === 0 ? (
            <p className="text-gray-700">No transactions found.</p>
          ) : (
            transactions.map((txn) => (
              <div
                className="txn-card bg-gray-100 p-4 rounded shadow mb-4"
                key={txn.id}
              >
                <div className="text-gray-800">
                  <strong>Type:</strong> {txn.type}
                </div>
                <div className="text-gray-800">
                  <strong>Description:</strong> {txn.description}
                </div>
                <div className="text-gray-800">
                  <strong>Category:</strong> {txn.categoryId}
                </div>
                <div className="text-gray-800">
                  <strong>Amount:</strong> ${txn.amount}
                </div>
                <div className="text-gray-800">
                  <strong>Date:</strong> {txn.date}
                </div>

                <div className="txn-actions flex gap-2 mt-2">
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => handleEdit(txn)}
                  >
                    Update
                  </button>

                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleDelete(txn.id)}
                  >
                    Delete
                  </button>

                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => navigate(`/transaction/${txn.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showModal && editTxn && (
        <div
          className="modal-overlay fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          onClick={handleModalClose}
        >
          <div
            className="modal-content bg-white rounded shadow p-6 min-w-[300px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Edit Transaction
            </h3>

            <form onSubmit={handleUpdate} className="edit-form grid gap-4">
              <label className="text-gray-700 flex flex-col">
                Type:
                <select
                  name="type"
                  defaultValue={editTxn.type}
                  required
                  className="select select-bordered w-full"
                >
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                  <option value="Savings">Savings</option>
                </select>
              </label>

              <label className="text-gray-700 flex flex-col">
                Description:
                <input
                  name="description"
                  defaultValue={editTxn.description}
                  required
                  className="input input-bordered w-full"
                />
              </label>

              <label className="text-gray-700 flex flex-col">
                Category:
                <input
                  name="categoryId"
                  defaultValue={editTxn.categoryId}
                  required
                  className="input input-bordered w-full"
                />
              </label>

              <label className="text-gray-700 flex flex-col">
                Amount:
                <input
                  name="amount"
                  type="number"
                  defaultValue={editTxn.amount}
                  required
                  className="input input-bordered w-full"
                />
              </label>

              <label className="text-gray-700 flex flex-col">
                Date:
                <input
                  name="date"
                  type="date"
                  defaultValue={editTxn.date}
                  required
                  className="input input-bordered w-full"
                />
              </label>

              <div className="modal-actions flex gap-2">
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleModalClose}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTransactions;

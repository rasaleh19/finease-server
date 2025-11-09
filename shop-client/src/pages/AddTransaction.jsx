import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const AddTransaction = () => {
  const { user } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("http://localhost:3000/categories");
        const data = await res.json();
        setCategories(data);
      } catch {
        setCategories([]);
      }
    }
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const txn = {
      type: form.type.value,
      categoryId: form.categoryId.value,
      amount: Number(form.amount.value),
      description: form.description.value,
      date: form.date.value,
      userEmail: user.email,
      userName: user.displayName || user.email,
      userId: user.id,
      createdAt: new Date().toISOString(),
    };
    try {
      const res = await fetch("http://localhost:3000/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(txn),
      });
      if (res.ok) {
        toast.success("Transaction added!");
        form.reset();
      } else {
        toast.error("Failed to add transaction.");
      }
    } catch {
      toast.error("Failed to add transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-base-100 rounded shadow p-6">
        <h2 className="text-xl font-bold mb-6 text-center">Add Transaction</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
          {/* TYPE RADIO */}
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-2">Type</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="Income"
                  className="radio"
                  required
                />
                <span>Income</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="Expense"
                  className="radio"
                />
                <span>Expense</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="Savings"
                  className="radio"
                />
                <span>Savings</span>
              </label>
            </div>
          </div>

          {/* CATEGORY */}
          <label className="col-span-1 text-sm self-center">Category</label>
          <div className="col-span-2">
            <select
              name="categoryId"
              className="select select-bordered w-full"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* AMOUNT */}
          <label className="col-span-1 text-sm self-center">Amount</label>
          <div className="col-span-2">
            <input
              name="amount"
              type="number"
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <label className="col-span-1 text-sm self-center">Description</label>
          <div className="col-span-2">
            <input
              name="description"
              type="text"
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* DATE */}
          <label className="col-span-1 text-sm self-center">Date</label>
          <div className="col-span-2">
            <input
              name="date"
              type="date"
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* USER EMAIL */}
          <label className="col-span-1 text-sm self-center">User Email</label>
          <div className="col-span-2">
            <input
              name="userEmail"
              type="text"
              className="input input-bordered w-full"
              value={user?.email || ""}
              readOnly
            />
          </div>

          {/* USER NAME */}
          <label className="col-span-1 text-sm self-center">User Name</label>
          <div className="col-span-2">
            <input
              name="userName"
              type="text"
              className="input input-bordered w-full"
              value={user?.displayName || user?.email || ""}
              readOnly
            />
          </div>

          {/* SUBMIT BUTTON FULL WIDTH */}
          <div className="col-span-3">
            <button
              type="submit"
              className="btn btn-primary w-full mt-2"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );  
};

export default AddTransaction;

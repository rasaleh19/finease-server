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
    <div className="max-w-md mx-auto p-4 bg-base-100 rounded shadow mt-4">
      <h2 className="text-xl font-bold mb-4">Add Transaction</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label className="form-control">
          <span className="label-text">Type</span>
          <select name="type" className="select select-bordered" required>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
            <option value="Savings">Savings</option>
          </select>
        </label>
        <label className="form-control">
          <span className="label-text">Category</span>
          <select name="categoryId" className="select select-bordered" required>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>
        <label className="form-control">
          <span className="label-text">Amount</span>
          <input
            name="amount"
            type="number"
            className="input input-bordered"
            required
          />
        </label>
        <label className="form-control">
          <span className="label-text">Description</span>
          <input
            name="description"
            type="text"
            className="input input-bordered"
            required
          />
        </label>
        <label className="form-control">
          <span className="label-text">Date</span>
          <input
            name="date"
            type="date"
            className="input input-bordered"
            required
          />
        </label>
        <label className="form-control">
          <span className="label-text">User Email</span>
          <input
            name="userEmail"
            type="text"
            className="input input-bordered"
            value={user?.email || ""}
            readOnly
          />
        </label>
        <label className="form-control">
          <span className="label-text">User Name</span>
          <input
            name="userName"
            type="text"
            className="input input-bordered"
            value={user?.displayName || user?.email || ""}
            readOnly
          />
        </label>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Adding..." : "Add Transaction"}
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;

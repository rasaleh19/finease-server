import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TransactionDetails = () => {
  const { id } = useParams();
  const [txn, setTxn] = useState(null);
  const [categoryTotal, setCategoryTotal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const res = await fetch(`http://localhost:3000/transactions/${id}`);
        const data = await res.json();
        setTxn(data);
        if (data?.categoryId && data?.userId) {
          const res2 = await fetch(
            `http://localhost:3000/category-total/${data.categoryId}/${data.userId}`
          );
          const totalData = await res2.json();
          setCategoryTotal(totalData.total);
        }
      } catch {
        setTxn(null);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  if (loading) return <div className="spinner">Loading...</div>;
  if (!txn) return <div>Transaction not found.</div>;

  return (
    <div className="txn-details-container">
      <h2>Transaction Details</h2>
      <div className="txn-details-card">
        <div>
          <strong>Type:</strong> {txn.type}
        </div>
        <div>
          <strong>Description:</strong> {txn.description}
        </div>
        <div>
          <strong>Amount:</strong> ${txn.amount}
        </div>
        <div>
          <strong>Date:</strong> {txn.date}
        </div>
        <div>
          <strong>Category:</strong> {txn.categoryId}
        </div>
        <div>
          <strong>Total Amount in Category:</strong> ${categoryTotal ?? "-"}
        </div>
        <button
          className="btn btn-primary mt-4"
          onClick={() => alert("Update functionality coming soon!")}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default TransactionDetails;

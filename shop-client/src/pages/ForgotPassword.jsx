import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || "");
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Redirecting to Gmail...");
      setTimeout(() => {
        window.location.href = "https://mail.google.com";
      }, 1500);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100">
      <form
        className="card w-full max-w-sm bg-base-200 shadow-xl p-6"
        onSubmit={handleReset}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        <div className="mb-3">
          <label className="label">Email</label>
          <input
            type="email"
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Sending..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

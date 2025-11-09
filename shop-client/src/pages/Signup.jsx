import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useAuth } from "../hooks/useAuth";
import { FcGoogle } from "react-icons/fc";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const authContext = useAuth() || {};
  const { googleSignIn } = authContext;
  const auth = getAuth();

  const validatePassword = (pw) => {
    if (pw.length < 6) return "Password must be at least 6 characters.";
    if (!/[A-Z]/.test(pw)) return "Password must contain an uppercase letter.";
    if (!/[a-z]/.test(pw)) return "Password must contain a lowercase letter.";
    return "";
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    const pwError = validatePassword(password);
    if (pwError) {
      setError(pwError);
      return;
    }
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const defaultPhotoURL =
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb";
      await updateProfile(res.user, {
        displayName: name,
        photoURL: photoURL || defaultPhotoURL,
      });
      toast.success("Signup successful!");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await googleSignIn();
      toast.success("Google signup successful!");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-100">
      <form
        className="card w-full max-w-sm bg-white shadow-xl p-6"
        onSubmit={handleSignup}
        autoComplete="off"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Signup
        </h2>
        <div className="mb-3">
          <label className="label text-gray-700">Name</label>
          <input
            type="text"
            className="input input-bordered w-full bg-gray-200 text-gray-900"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="off"
          />
        </div>
        <div className="mb-3">
          <label className="label text-gray-700">Email</label>
          <input
            type="email"
            className="input input-bordered w-full bg-gray-200 text-gray-900"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
          />
        </div>
        <div className="mb-3">
          <label className="label text-gray-700">Photo URL</label>
          <input
            type="url"
            className="input input-bordered w-full bg-gray-200 text-gray-900"
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
            required
            autoComplete="off"
          />
        </div>
        <div className="mb-3 relative">
          <label className="label text-gray-700">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            className="input input-bordered w-full pr-10 bg-gray-200 text-gray-900"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute right-2 top-9 text-xl"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? <span>👁️</span> : <span>🙈</span>}
          </button>
        </div>
        {error && <div className="text-error text-sm mb-2">{error}</div>}
        <div className="flex justify-between mb-3">
          <Link to="/login" className="link link-hover text-sm text-blue-600">
            Login
          </Link>
        </div>
        <button className="btn btn-primary w-full mb-2" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        <button
          type="button"
          className="btn btn-outline w-full flex items-center gap-2"
          onClick={handleGoogle}
          disabled={loading}
        >
          <FcGoogle className="text-xl" /> Google Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;

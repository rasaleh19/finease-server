import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const { googleSignIn, auth, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (user) {
      toast.success("Login successful!");
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await googleSignIn();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-100">
      <form
        className="card w-full max-w-sm bg-white shadow-xl p-6"
        onSubmit={handleLogin}
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Login
        </h2>
        <div className="mb-3">
          <label className="label text-gray-700">Email</label>
          <input
            type="email"
            className="input input-bordered w-full bg-gray-200 text-gray-900"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
          />
          <button
            type="button"
            className="absolute right-2 top-9 text-xl"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? <span>👁️</span> : <span>🙈</span>}
          </button>
        </div>
        <div className="flex justify-between mb-3">
          <Link
            to="/forgot-password"
            state={{ email }}
            className="link link-hover text-sm text-blue-600"
          >
            Forgot Password?
          </Link>
          <Link to="/signup" className="link link-hover text-sm text-blue-600">
            Signup
          </Link>
        </div>
        <button className="btn btn-primary w-full mb-2" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <button
          type="button"
          className="btn btn-outline w-full flex items-center gap-2"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <FcGoogle className="text-xl" /> Google Login
        </button>
      </form>
    </div>
  );
};

export default Login;

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import PasswordInput from "../components/PasswordInput";

const Login = () => {
  // Signup page se aane wala data (success message aur email) yahan milta hai
  const location = useLocation();
  const successMessage = location.state?.message;

  // Signup se aaye hain to email pehle se bhari hui hogi
  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { saveUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // page reload hone se roko
    setError("");
    setLoading(true);
    try {
      // Backend ko email/password bhejo
      const { data } = await API.post("/auth/login", { email, password });
      saveUser(data); // token + user browser mein save
      navigate("/");  // chat page par bhej do
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false); // button wapas normal, chahe success ho ya error
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to your conversations."
      footer={
        <>
          Don't have an account? <Link to="/signup">Create one</Link>
        </>
      }
    >
      {successMessage && <div className="alert-success">{successMessage}</div>}
      {error && <div className="alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">Email address</label>
          <div className="input-wrap">
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <PasswordInput
            id="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading && <span className="spinner" />}
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;
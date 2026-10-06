import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

import AuthLayout from "../components/AuthLayout";
import PasswordInput from "../components/PasswordInput";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (password.length < 6) {
    return setError("Password must be at least 6 characters.");
  }

  setLoading(true);
  try {
    await API.post("/auth/signup", { username, email, password });

    // Account ban gaya. Login nahi karwana, login page par bhej do
    // state mein success message aur email bhej rahe hain
    navigate("/login", {
      state: {
        message: "Account created successfully. Please sign in.",
        email,
      },
    });
  } catch (err) {
    setError(err.response?.data?.message || "Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join Chatly and start chatting in seconds."
      footer={
        <>
          Already have an account? <Link to="/login">Sign in</Link>
        </>
      }
    >
      {error && <div className="alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="username">Username</label>
          <div className="input-wrap">
            <input
              id="username"
              type="text"
              placeholder="johndoe"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        </div>

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
            placeholder="Create a password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="field-hint">Use at least 6 characters.</p>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading && <span className="spinner" />}
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Signup;
import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/chat";

// /logout par jao to khud logout ho kar login page khul jata hai
const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate("/login", { replace: true });
  }, []);

  return null;
};

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Chat sirf login walon ke liye */}
      <Route path="/" element={user ? <Chat /> : <Navigate to="/login" />} />

      {/* Login/Signup: pehle se login ho to chat par bhej do */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />

      {/* Shortcut: localhost:5176/logout */}
      <Route path="/logout" element={<Logout />} />
    </Routes>
  );
}

export default App;
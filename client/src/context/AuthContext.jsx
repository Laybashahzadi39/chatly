import { createContext, useContext, useState } from "react";

// Context = ek "common box", jis se koi bhi page logged-in user ki info le sakta hai
const AuthContext = createContext();

// Chhota helper: kisi bhi component mein useAuth() likh ke box khol lo
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // App khulte hi localStorage se dekho ke pehle se login hai ya nahi
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("chatUser"));
  });

  // Login/signup ke baad user ko save karo (browser mein bhi, state mein bhi)
  const saveUser = (data) => {
    localStorage.setItem("chatUser", JSON.stringify(data));
    setUser(data);
  };

  // Logout: sab saaf
  const logout = () => {
    localStorage.removeItem("chatUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, saveUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext
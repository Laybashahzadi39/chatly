import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

// Kisi bhi component mein: const { socket, onlineUsers } = useSocket();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]); // online users ki ids

  useEffect(() => {
    // Login nahi hai to koi connection nahi
    if (!user) {
      setSocket(null);
      setOnlineUsers([]);
      return;
    }

    // Server se connect, token saath bhejo (server isay verify karta hai)
    const newSocket = io(import.meta.env.VITE_API_URL, {
      auth: { token: user.token },
    });

    setSocket(newSocket);

    // Server jab bhi online list bheje, state update karo
    newSocket.on("getOnlineUsers", (ids) => setOnlineUsers(ids));

    // Logout ya page band hone par connection khatam
    return () => {
      newSocket.off("getOnlineUsers");
      newSocket.disconnect();
    };
  }, [user?.token]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
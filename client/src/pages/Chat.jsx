import { useCallback, useEffect, useState } from "react";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { useSocket } from "../context/SocketContext";
import { sortByRecent } from "../utils/helpers";

// Ye page "maalik" hai: users, selected user aur unread counts yahin yaad rehte hain
const Chat = () => {
  const { socket } = useSocket();

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({}); // { userId: 3 }

  // 1) Page khulte hi users ki list (aakhri message ke saath)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await API.get("/users");
        setUsers(sortByRecent(data));
      } catch (err) {
        setUsersError("Could not load users. Please refresh.");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  // 2) Kisi user ka aakhri message badlo aur usko list mein upar le aao
  const updateLastMessage = useCallback((otherId, message) => {
    setUsers((prev) =>
      sortByRecent(prev.map((u) => (u._id === otherId ? { ...u, lastMessage: message } : u)))
    );
  }, []);

  // 3) Naya message aaye to: preview update, aur chat band ho to unread badhao
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      updateLastMessage(message.sender, message);

      // Is user ki chat khuli hai to ChatWindow khud sambhal lega
      if (message.sender === selectedUser?._id) return;

      setUnreadCounts((prev) => ({
        ...prev,
        [message.sender]: (prev[message.sender] || 0) + 1,
      }));
    };

    socket.on("receiveMessage", handleNewMessage);
    return () => socket.off("receiveMessage", handleNewMessage);
  }, [socket, selectedUser?._id, updateLastMessage]);

  // 4) User par click: select karo aur uska unread zero
  const handleSelectUser = (u) => {
    setSelectedUser(u);
    setUnreadCounts((prev) => ({ ...prev, [u._id]: 0 }));
  };

  // 5) Browser tab ka title: "(3) Chatly"
  const totalUnread = Object.values(unreadCounts).reduce((sum, n) => sum + n, 0);
  useEffect(() => {
    document.title = totalUnread > 0 ? `(${totalUnread}) Chatly` : "Chatly";
    return () => {
      document.title = "Chatly";
    };
  }, [totalUnread]);

  return (
    // has-chat class mobile par list/chat ka switch karti hai
    <div className={`chat-layout ${selectedUser ? "has-chat" : ""}`}>
      <Sidebar
        users={users}
        loading={loadingUsers}
        error={usersError}
        selectedUser={selectedUser}
        onSelectUser={handleSelectUser}
        unreadCounts={unreadCounts}
      />

      <main className="chat-main">
        {selectedUser ? (
          <ChatWindow
            key={selectedUser._id}
            selectedUser={selectedUser}
            onMessageSent={updateLastMessage}
            onBack={() => setSelectedUser(null)}
          />
        ) : (
          <div className="chat-placeholder">
            <div className="placeholder-icon">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3>Your messages</h3>
            <p>Select a conversation from the left to start chatting.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Chat;
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { getAvatarBg, getInitial, formatListTime } from "../utils/helpers";

// Ab Sidebar sirf dikhata hai. Data Chat.jsx se aata hai (props)
const Sidebar = ({ users, loading, error, selectedUser, onSelectUser, unreadCounts }) => {
  const { user, logout } = useAuth();
  const { onlineUsers } = useSocket();
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  // Naam ke neeche kya likha dikhna hai
  const getPreview = (u, isOnline) => {
    if (!u.lastMessage) return isOnline ? "Online" : "No messages yet";
    const mine = u.lastMessage.sender === user._id;
    return `${mine ? "You: " : ""}${u.lastMessage.text}`;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          Chatly
        </div>
      </div>

      <div className="sidebar-search">
        <div className="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search people..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="sidebar-title">Chats</div>

      <div className="user-list">
        {/* Loading: skeleton rows */}
        {loading &&
          [1, 2, 3, 4].map((n) => (
            <div className="skeleton-item" key={n}>
              <div className="skeleton-circle" />
              <div className="skeleton-lines">
                <div className="skeleton-line" />
                <div className="skeleton-line short" />
              </div>
            </div>
          ))}

        {error && <p className="sidebar-msg error-text">{error}</p>}

        {!loading && !error && filteredUsers.length === 0 && (
          <p className="sidebar-msg">No users found.</p>
        )}

        {filteredUsers.map((u) => {
          const isOnline = onlineUsers.includes(u._id);
          const unread = unreadCounts[u._id] || 0;

          return (
            <button
              key={u._id}
              className={`user-item ${selectedUser?._id === u._id ? "active" : ""}`}
              onClick={() => onSelectUser(u)}
            >
              <div className="avatar-wrap">
                <div className="avatar" style={{ background: getAvatarBg(u.username) }}>
                  {getInitial(u.username)}
                </div>
                {isOnline && <span className="online-dot" />}
              </div>

              <div className="user-info">
                {/* Pehli line: naam aur time */}
                <div className="user-row">
                  <span className="user-name">{u.username}</span>
                  {u.lastMessage && (
                    <span className={`user-time ${unread > 0 ? "unread" : ""}`}>
                      {formatListTime(u.lastMessage.createdAt)}
                    </span>
                  )}
                </div>

                {/* Dusri line: aakhri message aur unread badge */}
                <div className="user-row">
                  <span className={`user-preview ${unread > 0 ? "unread" : ""}`}>
                    {getPreview(u, isOnline)}
                  </span>
                  {unread > 0 && (
                    <span className="unread-badge">{unread > 99 ? "99+" : unread}</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Neeche: mera profile aur logout */}
      <div className="sidebar-footer">
        <div className="sidebar-me">
          <div className="avatar sm" style={{ background: getAvatarBg(user.username) }}>
            {getInitial(user.username)}
          </div>
          <div className="user-info">
            <div className="sidebar-me-name">{user.username}</div>
            <div className="sidebar-me-email">{user.email}</div>
          </div>
        </div>

        <button className="icon-btn" onClick={logout} title="Log out" aria-label="Log out">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
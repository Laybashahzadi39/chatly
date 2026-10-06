import { Fragment, useEffect, useRef, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { getAvatarBg, getInitial, isSameDay, formatDayLabel } from "../utils/helpers";

// Do messages ek "group" mein tab hain jab: bhejne wala same, din same, aur 5 minute se kam ka farak
const isGrouped = (a, b) =>
  a &&
  b &&
  a.sender === b.sender &&
  isSameDay(a.createdAt, b.createdAt) &&
  new Date(b.createdAt) - new Date(a.createdAt) < 5 * 60 * 1000;

const ChatWindow = ({ selectedUser, onMessageSent, onBack }) => {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef(null);
  const isOnline = onlineUsers.includes(selectedUser._id);

  // 1) Purani chat mangwao
  useEffect(() => {
    let cancelled = false;

    const fetchMessages = async () => {
      setLoading(true);
      setError("");
      setMessages([]);
      try {
        const { data } = await API.get(`/messages/${selectedUser._id}`);
        if (!cancelled) setMessages(data);
      } catch (err) {
        if (!cancelled) setError("Could not load messages.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMessages();
    return () => {
      cancelled = true;
    };
  }, [selectedUser._id]);

  // 2) Live: naya message, typing, stop typing
  useEffect(() => {
    if (!socket) return;

    const handleReceive = (message) => {
      if (message.sender === selectedUser._id) {
        setMessages((prev) => [...prev, message]);
        setIsTyping(false);
      }
    };
    const handleTyping = ({ senderId }) => {
      if (senderId === selectedUser._id) setIsTyping(true);
    };
    const handleStopTyping = ({ senderId }) => {
      if (senderId === selectedUser._id) setIsTyping(false);
    };

    socket.on("receiveMessage", handleReceive);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("receiveMessage", handleReceive);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [socket, selectedUser._id]);

  // 3) Neeche scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Message bhejna
  const handleSend = (text) => {
    if (!socket) return;
    socket.emit("sendMessage", { receiverId: selectedUser._id, text }, (res) => {
      if (res?.success) {
        setMessages((prev) => [...prev, res.message]);
        onMessageSent?.(selectedUser._id, res.message); // sidebar ka preview update
      } else {
        setError("Message could not be sent. Please try again.");
      }
    });
  };

  const handleTypingStart = () => socket?.emit("typing", { receiverId: selectedUser._id });
  const handleTypingStop = () => socket?.emit("stopTyping", { receiverId: selectedUser._id });

  const avatarBg = getAvatarBg(selectedUser.username);

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-header">
        <button className="back-btn" onClick={onBack} aria-label="Back to chats">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="avatar-wrap">
          <div className="avatar" style={{ background: avatarBg }}>
            {getInitial(selectedUser.username)}
          </div>
          {isOnline && <span className="online-dot" />}
        </div>

        <div>
          <div className="chat-header-name">{selectedUser.username}</div>
          <div className="chat-header-sub">
            {isTyping ? (
              <span className="status-typing">typing...</span>
            ) : isOnline ? (
              <span className="status-online">Online</span>
            ) : (
              "Offline"
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="messages">
        {loading && <p className="messages-note">Loading messages...</p>}
        {error && <p className="messages-note error-text">{error}</p>}

        {/* Pehla message abhi nahi bheja gaya */}
        {!loading && messages.length === 0 && !error && (
          <div className="empty-chat">
            <div className="avatar lg" style={{ background: avatarBg }}>
              {getInitial(selectedUser.username)}
            </div>
            <h4>{selectedUser.username}</h4>
            <p>No messages yet. Say hi!</p>
          </div>
        )}

        {messages.map((m, i) => {
          const prev = messages[i - 1];
          const next = messages[i + 1];

          const showDay = !prev || !isSameDay(prev.createdAt, m.createdAt);
          const isFirst = showDay || !isGrouped(prev, m);
          const isLast = !next || !isGrouped(m, next);

          return (
            <Fragment key={m._id}>
              {showDay && (
                <div className="day-separator">
                  <span>{formatDayLabel(m.createdAt)}</span>
                </div>
              )}
              <MessageBubble
                message={m}
                isMine={m.sender === user._id}
                isFirst={isFirst}
                isLast={isLast}
              />
            </Fragment>
          );
        })}

        {isTyping && (
          <div className="bubble-row theirs first last">
            <div className="bubble typing-bubble">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <MessageInput
        onSend={handleSend}
        onTyping={handleTypingStart}
        onStopTyping={handleTypingStop}
        disabled={loading || !socket}
      />
    </div>
  );
};

export default ChatWindow;
import { useEffect, useRef, useState } from "react";

// onTyping / onStopTyping: parent ko batate hain ke user type kar raha hai ya ruk gaya
const MessageInput = ({ onSend, onTyping, onStopTyping, disabled }) => {
  const [text, setText] = useState("");
  const typingRef = useRef(false); // abhi "typing" bheja hua hai ya nahi
  const timerRef = useRef(null);

  const stopTyping = () => {
    clearTimeout(timerRef.current);
    if (typingRef.current) {
      typingRef.current = false;
      onStopTyping?.();
    }
  };

  // Component band ho to bhi typing khatam kar do
  useEffect(() => {
    return () => stopTyping();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);

    if (!value) return stopTyping(); // sab mita diya

    // Typing sirf pehli dafa bhejo, har key par nahi
    if (!typingRef.current) {
      typingRef.current = true;
      onTyping?.();
    }

    // 1.5 second kuch type na ho to "stop typing" bhej do
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(stopTyping, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const clean = text.trim();
    if (!clean) return;

    stopTyping();
    onSend(clean);
    setText("");
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={handleChange}
        disabled={disabled}
      />
      <button
        type="submit"
        className="send-btn"
        disabled={disabled || !text.trim()}
        aria-label="Send message"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </form>
  );
};

export default MessageInput;
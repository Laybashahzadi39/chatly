import { formatTime } from "../utils/helpers";

// isFirst / isLast: group ka pehla ya aakhri message (kona gol karne ke liye)
const MessageBubble = ({ message, isMine, isFirst, isLast }) => {
  return (
    <div
      className={`bubble-row ${isMine ? "mine" : "theirs"} ${isFirst ? "first" : ""} ${
        isLast ? "last" : ""
      }`}
    >
      <div className="bubble">
        <p className="bubble-text">{message.text}</p>
        <span className="bubble-time">{formatTime(message.createdAt)}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
// ---------- Avatar ----------
const gradients = [
  ["#6366f1", "#8b5cf6"],
  ["#0ea5e9", "#6366f1"],
  ["#10b981", "#0ea5e9"],
  ["#f59e0b", "#ef4444"],
  ["#ec4899", "#8b5cf6"],
  ["#14b8a6", "#22c55e"],
];

// Poore naam se ek number banata hai (sirf pehle letter se nahi),
// is liye user1, user2, user3 ke rang alag aate hain
const hashName = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return hash;
};

export const getAvatarBg = (name) => {
  const [a, b] = gradients[hashName(name) % gradients.length];
  return `linear-gradient(135deg, ${a}, ${b})`;
};

export const getInitial = (name) => (name?.[0] || "?").toUpperCase();

// ---------- Dates ----------
export const isSameDay = (a, b) =>
  new Date(a).toDateString() === new Date(b).toDateString();

// "10:45 PM"
export const formatTime = (date) =>
  new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// Chat ke andar din ka separator: Today / Yesterday / 5 Oct 2026
export const formatDayLabel = (date) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";
  return new Date(date).toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Sidebar mein time: aaj ho to time, kal ho to Yesterday, warna 5 Oct
export const formatListTime = (date) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) return formatTime(date);
  if (isSameDay(date, yesterday)) return "Yesterday";
  return new Date(date).toLocaleDateString([], { day: "numeric", month: "short" });
};

// ---------- Sorting ----------
// Jis se abhi baat hui wo upar. Jin se kabhi nahi hui wo naam ke hisaab se neeche
export const sortByRecent = (list) =>
  [...list].sort((a, b) => {
    const ta = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
    const tb = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
    if (ta !== tb) return tb - ta;
    return a.username.localeCompare(b.username);
  });
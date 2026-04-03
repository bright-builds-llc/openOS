export type ShellIcon = {
  id: string;
  label: string;
  glyph: string;
  tintStart: string;
  tintEnd: string;
};

export const homeScreenIcons: ShellIcon[] = [
  { id: "calendar", label: "Calendar", glyph: "17", tintStart: "#fff1f2", tintEnd: "#ef4444" },
  { id: "photos", label: "Photos", glyph: "✿", tintStart: "#fbbf24", tintEnd: "#ec4899" },
  { id: "camera", label: "Camera", glyph: "◉", tintStart: "#111827", tintEnd: "#6b7280" },
  { id: "weather", label: "Weather", glyph: "☼", tintStart: "#38bdf8", tintEnd: "#2563eb" },
  { id: "clock", label: "Clock", glyph: "◔", tintStart: "#0f172a", tintEnd: "#475569" },
  { id: "maps", label: "Maps", glyph: "⌖", tintStart: "#34d399", tintEnd: "#0ea5e9" },
  { id: "notes", label: "Notes", glyph: "☰", tintStart: "#fde68a", tintEnd: "#facc15" },
  { id: "health", label: "Health", glyph: "♥", tintStart: "#fb7185", tintEnd: "#f43f5e" },
  { id: "calculator", label: "Calculator", glyph: "＋", tintStart: "#111827", tintEnd: "#fb923c" },
  { id: "music", label: "Music", glyph: "♫", tintStart: "#ec4899", tintEnd: "#8b5cf6" },
  { id: "mail", label: "Mail", glyph: "✉", tintStart: "#60a5fa", tintEnd: "#2563eb" },
  { id: "files", label: "Files", glyph: "▣", tintStart: "#ffffff", tintEnd: "#cbd5e1" },
  { id: "journal", label: "Journal", glyph: "✎", tintStart: "#c4b5fd", tintEnd: "#7c3aed" },
  { id: "messages", label: "Messages", glyph: "◌", tintStart: "#4ade80", tintEnd: "#16a34a" },
  { id: "wallet", label: "Wallet", glyph: "▤", tintStart: "#60a5fa", tintEnd: "#111827" },
  { id: "settings", label: "Settings", glyph: "⚙", tintStart: "#cbd5e1", tintEnd: "#64748b" },
  { id: "browser", label: "Browser", glyph: "◍", tintStart: "#60a5fa", tintEnd: "#0f172a" },
  { id: "voice", label: "Voice", glyph: "◠", tintStart: "#f9a8d4", tintEnd: "#db2777" },
  { id: "studio", label: "Studio", glyph: "◆", tintStart: "#f97316", tintEnd: "#7c2d12" },
  { id: "library", label: "Library", glyph: "◎", tintStart: "#7dd3fc", tintEnd: "#14b8a6" }
];

export const dockIcons: ShellIcon[] = [
  { id: "phone", label: "Phone", glyph: "◐", tintStart: "#4ade80", tintEnd: "#16a34a" },
  { id: "browser-dock", label: "Browser", glyph: "◍", tintStart: "#60a5fa", tintEnd: "#2563eb" },
  { id: "messages-dock", label: "Messages", glyph: "◌", tintStart: "#4ade80", tintEnd: "#16a34a" },
  { id: "music-dock", label: "Music", glyph: "♫", tintStart: "#ec4899", tintEnd: "#8b5cf6" }
];

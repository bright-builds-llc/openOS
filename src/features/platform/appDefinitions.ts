import {
  createAppSettingsParticipation,
  type AppSettingsParticipation,
} from "./appSettings";
import {
  createAppStorageMetadata,
  type AppStorageMetadata,
} from "./appStorage";

export type { AppSettingsParticipation } from "./appSettings";
export type { AppStorageMetadata } from "./appStorage";

export type RuntimeAppPlacement = "grid" | "dock";

export type RuntimeAppAvailability = "implemented" | "coming-soon";

export type RuntimeAppLaunchSurface =
  | "calculator"
  | "browser"
  | "notes"
  | "settings"
  | "coming-soon";

export type RuntimeAppIcon = {
  glyph: string;
  tintStart: string;
  tintEnd: string;
};

type GridAppPlacement = {
  placement: "grid";
  page: number;
};

type DockAppPlacement = {
  placement: "dock";
};

export type RuntimeAppDefinition = {
  id: string;
  label: string;
  icon: RuntimeAppIcon;
  settings: AppSettingsParticipation;
  storage: AppStorageMetadata;
  availability: RuntimeAppAvailability;
  launchSurface: RuntimeAppLaunchSurface;
} & (GridAppPlacement | DockAppPlacement);

export function defineRuntimeApp(
  app: RuntimeAppDefinition,
): RuntimeAppDefinition {
  return app;
}

export const builtInAppDefinitions: RuntimeAppDefinition[] = [
  defineRuntimeApp({
    id: "calendar",
    label: "Calendar",
    icon: { glyph: "17", tintStart: "#fff1f2", tintEnd: "#ef4444" },
    settings: createAppSettingsParticipation(),
    storage: createAppStorageMetadata("calendar"),
    placement: "grid",
    page: 0,
    availability: "coming-soon",
    launchSurface: "coming-soon",
  }),
  defineRuntimeApp({
    id: "photos",
    label: "Photos",
    icon: { glyph: "✿", tintStart: "#fbbf24", tintEnd: "#ec4899" },
    settings: createAppSettingsParticipation(),
    storage: createAppStorageMetadata("photos"),
    placement: "grid",
    page: 0,
    availability: "coming-soon",
    launchSurface: "coming-soon",
  }),
  defineRuntimeApp({
    id: "camera",
    label: "Camera",
    icon: { glyph: "◉", tintStart: "#111827", tintEnd: "#6b7280" },
    settings: createAppSettingsParticipation(),
    storage: createAppStorageMetadata("camera"),
    placement: "grid",
    page: 0,
    availability: "coming-soon",
    launchSurface: "coming-soon",
  }),
  defineRuntimeApp({
    id: "weather",
    label: "Weather",
    icon: { glyph: "☼", tintStart: "#38bdf8", tintEnd: "#2563eb" },
    settings: createAppSettingsParticipation(),
    storage: createAppStorageMetadata("weather"),
    placement: "grid",
    page: 0,
    availability: "coming-soon",
    launchSurface: "coming-soon",
  }),
  defineRuntimeApp({
    id: "clock",
    label: "Clock",
    icon: { glyph: "◔", tintStart: "#0f172a", tintEnd: "#475569" },
    settings: createAppSettingsParticipation(),
    storage: createAppStorageMetadata("clock"),
    placement: "grid",
    page: 0,
    availability: "coming-soon",
    launchSurface: "coming-soon",
  }),
  defineRuntimeApp({
    id: "maps",
    label: "Maps",
    icon: { glyph: "⌖", tintStart: "#34d399", tintEnd: "#0ea5e9" },
    settings: createAppSettingsParticipation(),
    storage: createAppStorageMetadata("maps"),
    placement: "grid",
    page: 0,
    availability: "coming-soon",
    launchSurface: "coming-soon",
  }),
  defineRuntimeApp({
    id: "notes",
    label: "Notes",
    icon: { glyph: "☰", tintStart: "#fde68a", tintEnd: "#facc15" },
    settings: createAppSettingsParticipation("app-list"),
    storage: createAppStorageMetadata("notes"),
    placement: "grid",
    page: 0,
    availability: "implemented",
    launchSurface: "notes",
  }),
  defineRuntimeApp({
    id: "health",
    label: "Health",
    icon: { glyph: "♥", tintStart: "#fb7185", tintEnd: "#f43f5e" },
    settings: createAppSettingsParticipation(),
    storage: createAppStorageMetadata("health"),
    placement: "grid",
    page: 0,
    availability: "coming-soon",
    launchSurface: "coming-soon",
  }),
  defineRuntimeApp({
    id: "calculator",
    label: "Calculator",
    icon: { glyph: "＋", tintStart: "#111827", tintEnd: "#fb923c" },
    settings: createAppSettingsParticipation("app-list"),
    storage: createAppStorageMetadata("calculator"),
    placement: "grid",
    page: 0,
    availability: "implemented",
    launchSurface: "calculator",
  }),
  defineRuntimeApp({
    id: "music-grid",
    label: "Music",
    icon: { glyph: "♫", tintStart: "#ec4899", tintEnd: "#8b5cf6" },
    settings: createAppSettingsParticipation(),
    storage: createAppStorageMetadata("music-grid"),
    placement: "grid",
    page: 0,
    availability: "coming-soon",
    launchSurface: "coming-soon",
  }),
  defineRuntimeApp({
    id: "mail",
    label: "Mail",
    icon: { glyph: "✉", tintStart: "#60a5fa", tintEnd: "#2563eb" },
    settings: createAppSettingsParticipation(),
    storage: createAppStorageMetadata("mail"),
    placement: "grid",
    page: 0,
    availability: "coming-soon",
    launchSurface: "coming-soon",
  }),
  defineRuntimeApp({
    id: "files",
    label: "Files",
    icon: { glyph: "▣", tintStart: "#ffffff", tintEnd: "#cbd5e1" },
    settings: createAppSettingsParticipation(),
    storage: createAppStorageMetadata("files"),
    placement: "grid",
    page: 0,
    availability: "coming-soon",
    launchSurface: "coming-soon",
  }),
  defineRuntimeApp({
    id: "journal",
    label: "Journal",
    icon: { glyph: "✎", tintStart: "#c4b5fd", tintEnd: "#7c3aed" },
    settings: createAppSettingsParticipation(),
    storage: createAppStorageMetadata("journal"),
    placement: "grid",
    page: 1,
    availability: "coming-soon",
    launchSurface: "coming-soon",
  }),
  defineRuntimeApp({
    id: "messages-grid",
    label: "Messages",
    icon: { glyph: "◌", tintStart: "#4ade80", tintEnd: "#16a34a" },
    settings: createAppSettingsParticipation(),
    storage: createAppStorageMetadata("messages-grid"),
    placement: "grid",
    page: 1,
    availability: "coming-soon",
    launchSurface: "coming-soon",
  }),
  defineRuntimeApp({
    id: "wallet",
    label: "Wallet",
    icon: { glyph: "▤", tintStart: "#60a5fa", tintEnd: "#111827" },
    settings: createAppSettingsParticipation(),
    storage: createAppStorageMetadata("wallet"),
    placement: "grid",
    page: 1,
    availability: "coming-soon",
    launchSurface: "coming-soon",
  }),
  defineRuntimeApp({
    id: "settings",
    label: "Settings",
    icon: { glyph: "⚙", tintStart: "#cbd5e1", tintEnd: "#64748b" },
    settings: createAppSettingsParticipation("app-list"),
    storage: createAppStorageMetadata("settings"),
    placement: "grid",
    page: 1,
    availability: "implemented",
    launchSurface: "settings",
  }),
  defineRuntimeApp({
    id: "browser-grid",
    label: "Browser",
    icon: { glyph: "◍", tintStart: "#60a5fa", tintEnd: "#0f172a" },
    settings: createAppSettingsParticipation("app-list"),
    storage: createAppStorageMetadata("browser-grid"),
    placement: "grid",
    page: 1,
    availability: "implemented",
    launchSurface: "browser",
  }),
  defineRuntimeApp({
    id: "voice",
    label: "Voice",
    icon: { glyph: "◠", tintStart: "#f9a8d4", tintEnd: "#db2777" },
    settings: createAppSettingsParticipation(),
    storage: createAppStorageMetadata("voice"),
    placement: "grid",
    page: 1,
    availability: "coming-soon",
    launchSurface: "coming-soon",
  }),
  defineRuntimeApp({
    id: "studio",
    label: "Studio",
    icon: { glyph: "◆", tintStart: "#f97316", tintEnd: "#7c2d12" },
    settings: createAppSettingsParticipation(),
    storage: createAppStorageMetadata("studio"),
    placement: "grid",
    page: 1,
    availability: "coming-soon",
    launchSurface: "coming-soon",
  }),
  defineRuntimeApp({
    id: "library",
    label: "Library",
    icon: { glyph: "◎", tintStart: "#7dd3fc", tintEnd: "#14b8a6" },
    settings: createAppSettingsParticipation(),
    storage: createAppStorageMetadata("library"),
    placement: "grid",
    page: 1,
    availability: "coming-soon",
    launchSurface: "coming-soon",
  }),
  defineRuntimeApp({
    id: "phone",
    label: "Phone",
    icon: { glyph: "◐", tintStart: "#4ade80", tintEnd: "#16a34a" },
    settings: createAppSettingsParticipation(),
    storage: createAppStorageMetadata("phone"),
    placement: "dock",
    availability: "coming-soon",
    launchSurface: "coming-soon",
  }),
  defineRuntimeApp({
    id: "browser",
    label: "Browser",
    icon: { glyph: "◍", tintStart: "#60a5fa", tintEnd: "#2563eb" },
    settings: createAppSettingsParticipation("app-list"),
    storage: createAppStorageMetadata("browser"),
    placement: "dock",
    availability: "implemented",
    launchSurface: "browser",
  }),
  defineRuntimeApp({
    id: "messages",
    label: "Messages",
    icon: { glyph: "◌", tintStart: "#4ade80", tintEnd: "#16a34a" },
    settings: createAppSettingsParticipation(),
    storage: createAppStorageMetadata("messages"),
    placement: "dock",
    availability: "coming-soon",
    launchSurface: "coming-soon",
  }),
  defineRuntimeApp({
    id: "music",
    label: "Music",
    icon: { glyph: "♫", tintStart: "#ec4899", tintEnd: "#8b5cf6" },
    settings: createAppSettingsParticipation(),
    storage: createAppStorageMetadata("music"),
    placement: "dock",
    availability: "coming-soon",
    launchSurface: "coming-soon",
  }),
];

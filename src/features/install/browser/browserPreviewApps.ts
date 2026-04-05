import {
  appRegistry,
  getRuntimeApp,
  type RuntimeApp,
  type RuntimeAppPlacement,
} from "../../runtime/appRegistry";

export type BrowserPreviewApp = Pick<
  RuntimeApp,
  "id" | "label" | "icon" | "placement"
>;

const previewGridIds = [
  "calculator",
  "weather",
  "camera",
  "photos",
  "music-grid",
  "notes",
  "maps",
  "clock",
] as const;

const previewDockIds = [
  "phone",
  "browser",
  "messages",
  "music",
] as const;

function selectPreviewApps(
  appIds: readonly string[],
  placement: RuntimeAppPlacement,
  maybeApps: RuntimeApp[] = appRegistry,
): BrowserPreviewApp[] {
  return appIds.flatMap((appId) => {
    const maybeApp = getRuntimeApp(appId, maybeApps);

    if (maybeApp === null || maybeApp.placement !== placement) {
      return [];
    }

    return [
      {
        id: maybeApp.id,
        label: maybeApp.label,
        icon: maybeApp.icon,
        placement: maybeApp.placement,
      },
    ];
  });
}

export function getBrowserPreviewGridApps(
  maybeApps: RuntimeApp[] = appRegistry,
): BrowserPreviewApp[] {
  return selectPreviewApps(previewGridIds, "grid", maybeApps);
}

export function getBrowserPreviewDockApps(
  maybeApps: RuntimeApp[] = appRegistry,
): BrowserPreviewApp[] {
  return selectPreviewApps(previewDockIds, "dock", maybeApps);
}

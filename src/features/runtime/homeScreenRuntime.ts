import {
  getRuntimeApp,
  type RuntimeApp,
  type RuntimeAppAvailability,
} from "./appRegistry";

export type HomeScreenRuntimeState =
  | { kind: "home" }
  | { kind: "open-app"; appId: string };

export const PRESSED_ICON_DURATION_MS = 120;

export function createInitialHomeScreenRuntimeState(): HomeScreenRuntimeState {
  return { kind: "home" };
}

export function isRuntimeAppLaunchable(
  availability: RuntimeAppAvailability,
): boolean {
  return availability === "implemented" || availability === "coming-soon";
}

export function openRuntimeApp(
  appId: string,
  maybeApps: RuntimeApp[],
  currentState: HomeScreenRuntimeState,
): HomeScreenRuntimeState {
  const maybeApp = getRuntimeApp(appId, maybeApps);

  if (maybeApp === null || !isRuntimeAppLaunchable(maybeApp.availability)) {
    return currentState;
  }

  return {
    kind: "open-app",
    appId,
  };
}

export function getOpenRuntimeApp(
  state: HomeScreenRuntimeState,
  maybeApps: RuntimeApp[],
): RuntimeApp | null {
  if (state.kind !== "open-app") {
    return null;
  }

  return getRuntimeApp(state.appId, maybeApps);
}

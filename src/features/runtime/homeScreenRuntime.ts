import {
  getRuntimeApp,
  type RuntimeApp,
  type RuntimeAppAvailability,
} from "./appRegistry";
import {
  beginClosingNavigation,
  beginOpeningNavigation,
  createInitialHomeNavigationState,
  finishClosingNavigation,
  finishOpeningNavigation,
  getActiveNavigationAppId,
  syncHomeNavigationPreferences,
  type HomeNavigationPreferences,
  type HomeNavigationState,
  type MotionRect,
} from "../motion/homeNavigationMotion";

export type HomeScreenRuntimeState = HomeNavigationState;

export const PRESSED_ICON_DURATION_MS = 120;

const defaultPreferences: HomeNavigationPreferences = {
  prefersReducedMotion: false,
  supportsViewTransitions: false,
};

export function createInitialHomeScreenRuntimeState(
  preferences: HomeNavigationPreferences = defaultPreferences,
): HomeScreenRuntimeState {
  return createInitialHomeNavigationState(preferences);
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
  originRect: MotionRect | null = null,
  preferences: HomeNavigationPreferences = defaultPreferences,
): HomeScreenRuntimeState {
  const maybeApp = getRuntimeApp(appId, maybeApps);

  if (maybeApp === null || !isRuntimeAppLaunchable(maybeApp.availability)) {
    return currentState;
  }

  return beginOpeningNavigation(appId, originRect, preferences);
}

export function getOpenRuntimeApp(
  state: HomeScreenRuntimeState,
  maybeApps: RuntimeApp[],
): RuntimeApp | null {
  const maybeAppId = getActiveNavigationAppId(state);

  if (maybeAppId === null) {
    return null;
  }

  return getRuntimeApp(maybeAppId, maybeApps);
}

export function closeRuntimeApp(
  currentState: HomeScreenRuntimeState,
  preferences: HomeNavigationPreferences = defaultPreferences,
): HomeScreenRuntimeState {
  return beginClosingNavigation(currentState, preferences);
}

export function completeRuntimeTransition(
  currentState: HomeScreenRuntimeState,
  preferences: HomeNavigationPreferences = defaultPreferences,
): HomeScreenRuntimeState {
  if (currentState.kind === "opening") {
    return finishOpeningNavigation(currentState);
  }

  if (currentState.kind === "closing") {
    return finishClosingNavigation(currentState, preferences);
  }

  return currentState;
}

export function syncRuntimeMotionPreferences(
  currentState: HomeScreenRuntimeState,
  preferences: HomeNavigationPreferences = defaultPreferences,
): HomeScreenRuntimeState {
  return syncHomeNavigationPreferences(currentState, preferences);
}

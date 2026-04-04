export type MotionMode = "full" | "reduced";

export type MotionDriver = "view-transition" | "css";

export type MotionRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type HomeNavigationPreferences = {
  prefersReducedMotion: boolean;
  supportsViewTransitions: boolean;
};

export type HomeNavigationState =
  | {
      kind: "home";
      motionMode: MotionMode;
      driver: MotionDriver;
    }
  | {
      kind: "opening";
      appId: string;
      originRect: MotionRect | null;
      motionMode: MotionMode;
      driver: MotionDriver;
    }
  | {
      kind: "open-app";
      appId: string;
      originRect: MotionRect | null;
      motionMode: MotionMode;
      driver: MotionDriver;
    }
  | {
      kind: "closing";
      appId: string;
      originRect: MotionRect | null;
      motionMode: MotionMode;
      driver: MotionDriver;
    };

export function resolveMotionMode(
  prefersReducedMotion: boolean,
): MotionMode {
  if (prefersReducedMotion) {
    return "reduced";
  }

  return "full";
}

export function resolveMotionDriver(
  motionMode: MotionMode,
  supportsViewTransitions: boolean,
): MotionDriver {
  if (motionMode === "full" && supportsViewTransitions) {
    return "view-transition";
  }

  return "css";
}

function createMotionContext(preferences: HomeNavigationPreferences) {
  const motionMode = resolveMotionMode(preferences.prefersReducedMotion);

  return {
    motionMode,
    driver: resolveMotionDriver(
      motionMode,
      preferences.supportsViewTransitions,
    ),
  };
}

export function createInitialHomeNavigationState(
  preferences: HomeNavigationPreferences,
): HomeNavigationState {
  return {
    kind: "home",
    ...createMotionContext(preferences),
  };
}

export function syncHomeNavigationPreferences(
  state: HomeNavigationState,
  preferences: HomeNavigationPreferences,
): HomeNavigationState {
  const motionContext = createMotionContext(preferences);

  if (state.kind === "home") {
    return {
      kind: "home",
      ...motionContext,
    };
  }

  return {
    kind: state.kind,
    appId: state.appId,
    originRect: state.originRect,
    ...motionContext,
  };
}

export function captureMotionRect(
  maybeRect: DOMRectReadOnly | DOMRect | null,
): MotionRect | null {
  if (maybeRect === null) {
    return null;
  }

  return {
    left: maybeRect.left,
    top: maybeRect.top,
    width: maybeRect.width,
    height: maybeRect.height,
  };
}

export function beginOpeningNavigation(
  appId: string,
  originRect: MotionRect | null,
  preferences: HomeNavigationPreferences,
): HomeNavigationState {
  return {
    kind: "opening",
    appId,
    originRect,
    ...createMotionContext(preferences),
  };
}

export function finishOpeningNavigation(
  state: HomeNavigationState,
): HomeNavigationState {
  if (state.kind !== "opening") {
    return state;
  }

  return {
    ...state,
    kind: "open-app",
  };
}

export function beginClosingNavigation(
  state: HomeNavigationState,
  preferences: HomeNavigationPreferences,
): HomeNavigationState {
  if (state.kind !== "open-app") {
    return state;
  }

  return {
    kind: "closing",
    appId: state.appId,
    originRect: state.originRect,
    ...createMotionContext(preferences),
  };
}

export function finishClosingNavigation(
  state: HomeNavigationState,
  preferences: HomeNavigationPreferences,
): HomeNavigationState {
  if (state.kind !== "closing") {
    return state;
  }

  return createInitialHomeNavigationState(preferences);
}

export function getActiveNavigationAppId(
  state: HomeNavigationState,
): string | null {
  if (state.kind === "home") {
    return null;
  }

  return state.appId;
}

export function getNavigationDurationMs(
  state: HomeNavigationState,
): number {
  if (state.kind === "opening") {
    return state.motionMode === "reduced" ? 120 : 240;
  }

  if (state.kind === "closing") {
    return state.motionMode === "reduced" ? 110 : 210;
  }

  return 0;
}

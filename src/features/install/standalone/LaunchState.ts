export type LaunchKind = "first-launch" | "returning";

export type LaunchState = {
  kind: LaunchKind;
  shouldShowLaunchIntro: boolean;
};

export function createInitialLaunchState(
  hasLaunchedBefore: boolean,
): LaunchState {
  if (hasLaunchedBefore) {
    return {
      kind: "returning",
      shouldShowLaunchIntro: false,
    };
  }

  return {
    kind: "first-launch",
    shouldShowLaunchIntro: true,
  };
}

export function completeLaunchIntro(state: LaunchState): LaunchState {
  return {
    kind: state.kind,
    shouldShowLaunchIntro: false,
  };
}

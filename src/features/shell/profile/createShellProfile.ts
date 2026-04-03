export type ShellSafeAreaInsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type ShellViewportMetrics = {
  width: number;
  height: number;
  safeArea: ShellSafeAreaInsets;
};

export type ShellProfileKind = "compact" | "balanced" | "expanded";

export type ShellProfile = {
  kind: ShellProfileKind;
  viewportWidth: number;
  viewportHeight: number;
  shellPaddingX: number;
  statusBarInsetTop: number;
  statusBarHeight: number;
  statusBarPaddingX: number;
  iconSize: number;
  iconLabelSize: number;
  iconGapX: number;
  iconGapY: number;
  gridColumns: number;
  gridTopOffset: number;
  dockInsetBottom: number;
  dockHeight: number;
  dockPadding: number;
  dockIconSize: number;
};

type BaseProfileTokens = Omit<
  ShellProfile,
  "kind" | "viewportWidth" | "viewportHeight"
>;

const baseProfileByKind: Record<ShellProfileKind, BaseProfileTokens> = {
  compact: {
    shellPaddingX: 18,
    statusBarInsetTop: 8,
    statusBarHeight: 18,
    statusBarPaddingX: 2,
    iconSize: 56,
    iconLabelSize: 12,
    iconGapX: 14,
    iconGapY: 18,
    gridColumns: 4,
    gridTopOffset: 28,
    dockInsetBottom: 8,
    dockHeight: 82,
    dockPadding: 12,
    dockIconSize: 54,
  },
  balanced: {
    shellPaddingX: 20,
    statusBarInsetTop: 9,
    statusBarHeight: 20,
    statusBarPaddingX: 4,
    iconSize: 60,
    iconLabelSize: 12,
    iconGapX: 16,
    iconGapY: 22,
    gridColumns: 4,
    gridTopOffset: 32,
    dockInsetBottom: 10,
    dockHeight: 88,
    dockPadding: 14,
    dockIconSize: 58,
  },
  expanded: {
    shellPaddingX: 22,
    statusBarInsetTop: 10,
    statusBarHeight: 21,
    statusBarPaddingX: 6,
    iconSize: 64,
    iconLabelSize: 13,
    iconGapX: 18,
    iconGapY: 24,
    gridColumns: 4,
    gridTopOffset: 36,
    dockInsetBottom: 12,
    dockHeight: 94,
    dockPadding: 16,
    dockIconSize: 62,
  },
};

function clampDimension(value: number): number {
  if (value < 0) {
    return 0;
  }

  return Math.round(value);
}

function getShellProfileKind(width: number): ShellProfileKind {
  if (width < 376) {
    return "compact";
  }

  if (width < 414) {
    return "balanced";
  }

  return "expanded";
}

export function createShellProfile(
  metrics: ShellViewportMetrics,
): ShellProfile {
  const kind = getShellProfileKind(metrics.width);
  const baseProfile = baseProfileByKind[kind];
  const aspectRatio = metrics.height / Math.max(metrics.width, 1);
  const isVeryTall = aspectRatio > 2.2;
  const isVeryNarrow = metrics.width < 352;

  const spacingCompression = isVeryTall || isVeryNarrow;
  const maybeCompressedIconSize = isVeryNarrow
    ? baseProfile.iconSize - 4
    : baseProfile.iconSize;
  const maybeCompressedGapX = spacingCompression
    ? baseProfile.iconGapX - 2
    : baseProfile.iconGapX;
  const maybeCompressedGapY = spacingCompression
    ? baseProfile.iconGapY - 4
    : baseProfile.iconGapY;

  return {
    kind,
    viewportWidth: clampDimension(metrics.width),
    viewportHeight: clampDimension(metrics.height),
    shellPaddingX: clampDimension(baseProfile.shellPaddingX),
    statusBarInsetTop: clampDimension(
      Math.max(metrics.safeArea.top, 6) + baseProfile.statusBarInsetTop,
    ),
    statusBarHeight: clampDimension(baseProfile.statusBarHeight),
    statusBarPaddingX: clampDimension(baseProfile.statusBarPaddingX),
    iconSize: clampDimension(maybeCompressedIconSize),
    iconLabelSize: clampDimension(baseProfile.iconLabelSize),
    iconGapX: clampDimension(maybeCompressedGapX),
    iconGapY: clampDimension(maybeCompressedGapY),
    gridColumns: baseProfile.gridColumns,
    gridTopOffset: clampDimension(baseProfile.gridTopOffset),
    dockInsetBottom: clampDimension(
      metrics.safeArea.bottom + baseProfile.dockInsetBottom,
    ),
    dockHeight: clampDimension(baseProfile.dockHeight),
    dockPadding: clampDimension(baseProfile.dockPadding),
    dockIconSize: clampDimension(baseProfile.dockIconSize),
  };
}

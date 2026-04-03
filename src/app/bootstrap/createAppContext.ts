import {
  detectInstallContext,
  type InstallContext,
  type InstallContextKind,
} from "../../lib/platform/detectInstallContext";

type MatchMediaResult = {
  matches: boolean;
};

type MatchMediaFunction = (query: string) => MatchMediaResult;

type NavigatorWithStandalone = Navigator & {
  standalone?: boolean;
};

export type InstallContextWindowLike = {
  location: {
    search: string;
  };
  matchMedia: MatchMediaFunction;
  navigator: NavigatorWithStandalone;
};

export type AppContext = {
  installContext: InstallContext;
};

function isInstallContextKind(value: string): value is InstallContextKind {
  return value === "browser" || value === "standalone";
}

function getDevInstallContextOverride(
  search: string,
  isDev: boolean,
): InstallContextKind | null {
  if (!isDev) {
    return null;
  }

  const params = new URLSearchParams(search);
  const maybeOverride =
    params.get("openos-install-context") ??
    params.get("iception-install-context");

  if (maybeOverride === null || !isInstallContextKind(maybeOverride)) {
    return null;
  }

  return maybeOverride;
}

export function createAppContext(
  win: InstallContextWindowLike,
  maybeOptions?: {
    isDev?: boolean;
  },
): AppContext {
  const maybeIsDev = maybeOptions?.isDev ?? false;
  const maybeLegacyStandalone =
    typeof win.navigator.standalone === "boolean"
      ? win.navigator.standalone
      : null;
  const maybeOverride = getDevInstallContextOverride(
    win.location.search,
    maybeIsDev,
  );

  return {
    installContext: detectInstallContext({
      displayModeStandalone: win.matchMedia("(display-mode: standalone)")
        .matches,
      maybeLegacyStandalone,
      maybeOverride,
    }),
  };
}

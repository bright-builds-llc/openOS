import {
  appRegistry,
  listRuntimeAppsByPlacement,
  type RuntimeApp,
} from "../../runtime/appRegistry";

export type ShellIcon = RuntimeApp;

export function getHomeScreenIcons(
  maybeApps: RuntimeApp[] = appRegistry,
): RuntimeApp[] {
  return listRuntimeAppsByPlacement("grid", maybeApps);
}

export function getDockIcons(
  maybeApps: RuntimeApp[] = appRegistry,
): RuntimeApp[] {
  return listRuntimeAppsByPlacement("dock", maybeApps);
}

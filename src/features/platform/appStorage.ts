import type { RuntimeAppDefinition } from "./appDefinitions";

export type AppStorageMetadata = {
  namespace: string;
};

type StorageAwareApp = {
  id: string;
  storage: AppStorageMetadata;
};

export function createAppStorageNamespace(appId: string): string {
  return `openos.apps.${appId}`;
}

export function createAppStorageMetadata(
  appId: string,
): AppStorageMetadata {
  return {
    namespace: createAppStorageNamespace(appId),
  };
}

export function createAppStorageKey(
  namespace: string,
  key: string,
): string {
  return `${namespace}.${key}`;
}

export function listStorageManagedApps<
  TApp extends StorageAwareApp,
>(
  maybeApps: TApp[],
): TApp[] {
  return maybeApps.filter((app) => app.storage.namespace.length > 0);
}

export function getAppStorageNamespace(
  appId: string,
  maybeApps: RuntimeAppDefinition[],
): string | null {
  const maybeApp = maybeApps.find((app) => app.id === appId);

  return maybeApp?.storage.namespace ?? null;
}

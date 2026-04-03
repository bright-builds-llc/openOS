const INSTALL_PROMPT_DISMISSED_AT_KEY = "openos.installPromptDismissedAt";
const LEGACY_INSTALL_PROMPT_DISMISSED_AT_KEY =
  "iception.installPromptDismissedAt";

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function readInstallPromptDismissedAt(
  storage: StorageLike,
): number | null {
  const maybeValue =
    storage.getItem(INSTALL_PROMPT_DISMISSED_AT_KEY) ??
    storage.getItem(LEGACY_INSTALL_PROMPT_DISMISSED_AT_KEY);

  if (maybeValue === null) {
    return null;
  }

  const parsedValue = Number(maybeValue);

  if (!Number.isFinite(parsedValue)) {
    storage.removeItem(INSTALL_PROMPT_DISMISSED_AT_KEY);
    storage.removeItem(LEGACY_INSTALL_PROMPT_DISMISSED_AT_KEY);
    return null;
  }

  return parsedValue;
}

export function writeInstallPromptDismissedAt(
  storage: StorageLike,
  dismissedAt: number,
): void {
  storage.setItem(INSTALL_PROMPT_DISMISSED_AT_KEY, String(dismissedAt));
}

export function clearInstallPromptDismissedAt(storage: StorageLike): void {
  storage.removeItem(INSTALL_PROMPT_DISMISSED_AT_KEY);
  storage.removeItem(LEGACY_INSTALL_PROMPT_DISMISSED_AT_KEY);
}

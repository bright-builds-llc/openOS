const STANDALONE_LAUNCH_SEEN_KEY = "openos.standaloneLaunchSeen";
const LEGACY_STANDALONE_LAUNCH_SEEN_KEY = "iception.standaloneLaunchSeen";

type StorageLike = Pick<Storage, "getItem" | "setItem">;

export function hasSeenStandaloneLaunch(storage: StorageLike): boolean {
  return (
    storage.getItem(STANDALONE_LAUNCH_SEEN_KEY) === "true" ||
    storage.getItem(LEGACY_STANDALONE_LAUNCH_SEEN_KEY) === "true"
  );
}

export function markStandaloneLaunchSeen(storage: StorageLike): void {
  storage.setItem(STANDALONE_LAUNCH_SEEN_KEY, "true");
}

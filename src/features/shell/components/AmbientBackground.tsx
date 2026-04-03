import type { ShellProfileKind } from "../profile/createShellProfile";

type AmbientBackgroundProps = {
  profileKind: ShellProfileKind;
  prefersReducedMotion: boolean;
};

export function AmbientBackground({
  profileKind,
  prefersReducedMotion,
}: AmbientBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className="ambient-background"
      data-motion={prefersReducedMotion ? "reduced" : "full"}
      data-profile={profileKind}
    >
      <div className="ambient-background__layer ambient-background__layer--one" />
      <div className="ambient-background__layer ambient-background__layer--two" />
      <div className="ambient-background__layer ambient-background__layer--three" />
    </div>
  );
}

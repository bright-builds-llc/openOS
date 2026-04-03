import type { ShellProfile } from "../profile/createShellProfile";

type DockProps = {
  profile: ShellProfile;
};

export function Dock({ profile }: DockProps) {
  return (
    <div className="shell-dock" data-profile={profile.kind}>
      {Array.from({ length: 4 }, (_, index) => (
        <div className="shell-dock__tile" key={index} />
      ))}
    </div>
  );
}

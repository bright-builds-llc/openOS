import type { ShellProfile } from "../profile/createShellProfile";

type StatusBarProps = {
  profile: ShellProfile;
};

export function StatusBar({ profile }: StatusBarProps) {
  return (
    <div className="shell-status-bar" data-profile={profile.kind}>
      <span className="shell-status-bar__time">9:41</span>
      <div className="shell-status-bar__indicators">
        <span className="shell-status-bar__signal" />
        <span className="shell-status-bar__wifi" />
        <span className="shell-status-bar__battery">
          <span className="shell-status-bar__battery-fill" />
        </span>
      </div>
    </div>
  );
}

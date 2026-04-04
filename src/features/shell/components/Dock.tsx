import type { CSSProperties } from "react";
import type { RuntimeApp } from "../../runtime/appRegistry";
import type { ShellProfile } from "../profile/createShellProfile";

type DockProps = {
  apps: RuntimeApp[];
  profile: ShellProfile;
};

export function Dock({ apps, profile }: DockProps) {
  return (
    <div className="shell-dock" data-profile={profile.kind}>
      {apps.map((icon) => (
        <div
          className="shell-dock__tile"
          key={icon.id}
          style={
            {
              "--dock-icon-start": icon.icon.tintStart,
              "--dock-icon-end": icon.icon.tintEnd,
            } as CSSProperties
          }
        >
          <span className="shell-dock__glyph">{icon.icon.glyph}</span>
        </div>
      ))}
    </div>
  );
}

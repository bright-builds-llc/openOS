import type { CSSProperties } from "react";
import { dockIcons } from "../data/homeScreenIcons";
import type { ShellProfile } from "../profile/createShellProfile";

type DockProps = {
  profile: ShellProfile;
};

export function Dock({ profile }: DockProps) {
  return (
    <div className="shell-dock" data-profile={profile.kind}>
      {dockIcons.map((icon) => (
        <div
          className="shell-dock__tile"
          key={icon.id}
          style={
            {
              "--dock-icon-start": icon.tintStart,
              "--dock-icon-end": icon.tintEnd,
            } as CSSProperties
          }
        >
          <span className="shell-dock__glyph">{icon.glyph}</span>
        </div>
      ))}
    </div>
  );
}

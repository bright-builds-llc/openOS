import type { CSSProperties } from "react";
import { homeScreenIcons } from "../data/homeScreenIcons";
import type { ShellProfile } from "../profile/createShellProfile";

type HomeScreenGridProps = {
  profile: ShellProfile;
};

export function HomeScreenGrid({ profile }: HomeScreenGridProps) {
  return (
    <div className="shell-grid" data-profile={profile.kind}>
      {homeScreenIcons.map((icon) => (
        <div className="shell-grid__item" key={icon.id}>
          <div
            className="shell-grid__icon"
            style={
              {
                "--icon-start": icon.tintStart,
                "--icon-end": icon.tintEnd,
              } as CSSProperties
            }
          >
            <span className="shell-grid__glyph">{icon.glyph}</span>
          </div>
          <div className="shell-grid__label">{icon.label}</div>
        </div>
      ))}
    </div>
  );
}

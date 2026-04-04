import type { CSSProperties } from "react";
import type { RuntimeApp } from "../../runtime/appRegistry";
import type { ShellProfile } from "../profile/createShellProfile";

type HomeScreenGridProps = {
  apps: RuntimeApp[];
  profile: ShellProfile;
};

export function HomeScreenGrid({ apps, profile }: HomeScreenGridProps) {
  return (
    <div className="shell-grid" data-profile={profile.kind}>
      {apps.map((icon) => (
        <div className="shell-grid__item" key={icon.id}>
          <div
            className="shell-grid__icon"
            style={
              {
                "--icon-start": icon.icon.tintStart,
                "--icon-end": icon.icon.tintEnd,
              } as CSSProperties
            }
          >
            <span className="shell-grid__glyph">{icon.icon.glyph}</span>
          </div>
          <div className="shell-grid__label">{icon.label}</div>
        </div>
      ))}
    </div>
  );
}

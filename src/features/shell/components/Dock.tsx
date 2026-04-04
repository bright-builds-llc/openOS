import type { CSSProperties } from "react";
import { AppIconButton } from "./AppIconButton";
import type { MotionRect } from "../../motion/homeNavigationMotion";
import type { RuntimeApp } from "../../runtime/appRegistry";
import type { ShellProfile } from "../profile/createShellProfile";

type DockProps = {
  apps: RuntimeApp[];
  onOpenApp: (appId: string, originRect: MotionRect | null) => void;
  profile: ShellProfile;
};

export function Dock({ apps, onOpenApp, profile }: DockProps) {
  return (
    <div className="shell-dock" data-profile={profile.kind}>
      {apps.map((icon) => (
        <AppIconButton
          app={icon}
          className="shell-dock__tile"
          glyphClassName="shell-dock__glyph-wrapper"
          key={icon.id}
          onOpenApp={onOpenApp}
          style={
            {
              "--dock-icon-start": icon.icon.tintStart,
              "--dock-icon-end": icon.icon.tintEnd,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

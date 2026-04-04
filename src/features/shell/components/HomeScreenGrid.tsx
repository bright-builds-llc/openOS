import type { CSSProperties } from "react";
import { AppIconButton } from "./AppIconButton";
import type { MotionRect } from "../../motion/homeNavigationMotion";
import type { RuntimeApp } from "../../runtime/appRegistry";
import type { ShellProfile } from "../profile/createShellProfile";

type HomeScreenGridProps = {
  apps: RuntimeApp[];
  onOpenApp: (appId: string, originRect: MotionRect | null) => void;
  profile: ShellProfile;
};

export function HomeScreenGrid({
  apps,
  onOpenApp,
  profile,
}: HomeScreenGridProps) {
  return (
    <div className="shell-grid" data-profile={profile.kind}>
      {apps.map((icon) => (
        <AppIconButton
          app={icon}
          className="shell-grid__item shell-grid__item-button"
          glyphClassName="shell-grid__icon"
          key={icon.id}
          onOpenApp={onOpenApp}
          style={
            {
              "--icon-start": icon.icon.tintStart,
              "--icon-end": icon.icon.tintEnd,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

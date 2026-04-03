import type { CSSProperties } from "react";
import { AmbientBackground } from "./components/AmbientBackground";
import { Dock } from "./components/Dock";
import { HomeScreenGrid } from "./components/HomeScreenGrid";
import { StatusBar } from "./components/StatusBar";
import { createShellProfile } from "./profile/createShellProfile";
import { useShellViewport } from "./profile/useShellViewport";
import "./shellFoundation.css";

type ShellSceneStyle = CSSProperties & Record<`--${string}`, string>;

function createShellStyle(profile: ReturnType<typeof createShellProfile>) {
  return {
    "--shell-padding-x": `${profile.shellPaddingX}px`,
    "--shell-status-top": `${profile.statusBarInsetTop}px`,
    "--shell-status-height": `${profile.statusBarHeight}px`,
    "--shell-status-padding-x": `${profile.statusBarPaddingX}px`,
    "--shell-icon-size": `${profile.iconSize}px`,
    "--shell-label-size": `${profile.iconLabelSize}px`,
    "--shell-grid-gap-x": `${profile.iconGapX}px`,
    "--shell-grid-gap-y": `${profile.iconGapY}px`,
    "--shell-grid-top": `${profile.gridTopOffset}px`,
    "--shell-dock-bottom": `${profile.dockInsetBottom}px`,
    "--shell-dock-height": `${profile.dockHeight}px`,
    "--shell-dock-padding": `${profile.dockPadding}px`,
    "--shell-dock-icon-size": `${profile.dockIconSize}px`,
  } as ShellSceneStyle;
}

export function AdaptiveShellFoundation() {
  const { sceneRef, metrics, prefersReducedMotion } = useShellViewport();
  const profile = createShellProfile(metrics);

  return (
    <section
      aria-label="openOS shell foundation"
      className="shell-scene"
      data-motion={prefersReducedMotion ? "reduced" : "full"}
      data-shell-profile={profile.kind}
      ref={sceneRef}
      style={createShellStyle(profile)}
    >
      <div className="shell-scene__frame">
        <AmbientBackground
          prefersReducedMotion={prefersReducedMotion}
          profileKind={profile.kind}
        />
        <StatusBar profile={profile} />
        <HomeScreenGrid profile={profile} />
        <Dock profile={profile} />
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { CalculatorApp } from "../apps/calculator/CalculatorApp";
import { HomePill } from "../motion/HomePill";
import { MotionLayer } from "../motion/MotionLayer";
import { runWithOptionalViewTransition, supportsViewTransitions } from "../motion/supportsViewTransitions";
import { AppSurface } from "../runtime/AppSurface";
import { appRegistry } from "../runtime/appRegistry";
import { ComingSoonApp } from "../runtime/ComingSoonApp";
import {
  closeRuntimeApp,
  completeRuntimeTransition,
  createInitialHomeScreenRuntimeState,
  getOpenRuntimeApp,
  openRuntimeApp,
  syncRuntimeMotionPreferences,
} from "../runtime/homeScreenRuntime";
import { getDockIcons, getHomeScreenIcons } from "./data/homeScreenIcons";
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
  const hasNativeViewTransitions = supportsViewTransitions();
  const [runtimeState, setRuntimeState] = useState(() =>
    createInitialHomeScreenRuntimeState({
      prefersReducedMotion,
      supportsViewTransitions: hasNativeViewTransitions,
    }),
  );
  const gridApps = getHomeScreenIcons(appRegistry);
  const dockApps = getDockIcons(appRegistry);
  const maybeOpenApp = getOpenRuntimeApp(runtimeState, appRegistry);
  const appSurfaceContent =
    maybeOpenApp?.launchSurface === "calculator" ? (
      <CalculatorApp />
    ) : maybeOpenApp !== null ? (
      <ComingSoonApp app={maybeOpenApp} />
    ) : null;

  useEffect(() => {
    setRuntimeState((currentState) =>
      syncRuntimeMotionPreferences(currentState, {
        prefersReducedMotion,
        supportsViewTransitions: hasNativeViewTransitions,
      }),
    );
  }, [hasNativeViewTransitions, prefersReducedMotion]);

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
        <div
          className="shell-scene__home"
          data-runtime-state={runtimeState.kind}
        >
          <>
            <HomeScreenGrid
              apps={gridApps}
              onOpenApp={(appId, originRect) => {
                runWithOptionalViewTransition(
                  () => {
                    setRuntimeState((currentState) =>
                      openRuntimeApp(
                        appId,
                        appRegistry,
                        currentState,
                        originRect,
                        {
                          prefersReducedMotion,
                          supportsViewTransitions: hasNativeViewTransitions,
                        },
                      ),
                    );
                  },
                  document,
                  hasNativeViewTransitions && !prefersReducedMotion,
                );
              }}
              profile={profile}
            />
            <Dock
              apps={dockApps}
              onOpenApp={(appId, originRect) => {
                runWithOptionalViewTransition(
                  () => {
                    setRuntimeState((currentState) =>
                      openRuntimeApp(
                        appId,
                        appRegistry,
                        currentState,
                        originRect,
                        {
                          prefersReducedMotion,
                          supportsViewTransitions: hasNativeViewTransitions,
                        },
                      ),
                    );
                  },
                  document,
                  hasNativeViewTransitions && !prefersReducedMotion,
                );
              }}
              profile={profile}
            />
          </>
        </div>
        {maybeOpenApp !== null ? (
          <MotionLayer
            app={maybeOpenApp}
            onTransitionComplete={() => {
              setRuntimeState((currentState) =>
                completeRuntimeTransition(currentState, {
                  prefersReducedMotion,
                  supportsViewTransitions: hasNativeViewTransitions,
                }),
              );
            }}
            state={runtimeState.kind === "home" ? {
              kind: "opening",
              appId: maybeOpenApp.id,
              originRect: null,
              motionMode: "full",
              driver: "css",
            } : runtimeState}
          >
            <AppSurface
              app={maybeOpenApp}
              homeControl={
                runtimeState.kind === "open-app" ? (
                  <HomePill
                    onHome={() => {
                      runWithOptionalViewTransition(
                        () => {
                          setRuntimeState((currentState) =>
                            closeRuntimeApp(currentState, {
                              prefersReducedMotion,
                              supportsViewTransitions: hasNativeViewTransitions,
                            }),
                          );
                        },
                        document,
                        hasNativeViewTransitions && !prefersReducedMotion,
                      );
                    }}
                  />
                ) : null
              }
            >
              {appSurfaceContent}
            </AppSurface>
          </MotionLayer>
        ) : null}
      </div>
    </section>
  );
}

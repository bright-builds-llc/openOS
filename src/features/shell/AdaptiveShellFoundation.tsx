import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { CalculatorApp } from "../apps/calculator/CalculatorApp";
import { AppCatalogApp } from "../apps/catalog/AppCatalogApp";
import { BrowserApp } from "../apps/browser/BrowserApp";
import { NotesApp } from "../apps/notes/NotesApp";
import { SettingsApp } from "../apps/settings/SettingsApp";
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
  getHomeScreenPageCount,
  getOpenRuntimeApp,
  openRuntimeApp,
  setActiveHomeScreenPage,
  syncRuntimeMotionPreferences,
} from "../runtime/homeScreenRuntime";
import { getDockIcons, getHomeScreenPages } from "./data/homeScreenIcons";
import { AmbientBackground } from "./components/AmbientBackground";
import { Dock } from "./components/Dock";
import { HomeScreenPages } from "./components/HomeScreenPages";
import { StatusBar } from "./components/StatusBar";
import { createShellProfile } from "./profile/createShellProfile";
import { useShellViewport } from "./profile/useShellViewport";
import {
  readOpenOsSettings,
  resolveAmbientPalette,
  resolveMotionPreference,
  subscribeToOpenOsSettings,
} from "../settings/settingsPreferences";
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
  const [settings, setSettings] = useState(() =>
    readOpenOsSettings(window.localStorage),
  );
  const prefersReducedMotionForShell = resolveMotionPreference(
    settings,
    prefersReducedMotion,
  );
  const ambientPalette = resolveAmbientPalette(settings);
  const profile = createShellProfile(metrics);
  const hasNativeViewTransitions = supportsViewTransitions();
  const [runtimeState, setRuntimeState] = useState(() =>
    createInitialHomeScreenRuntimeState({
      prefersReducedMotion: prefersReducedMotionForShell,
      supportsViewTransitions: hasNativeViewTransitions,
    }),
  );
  const homePages = getHomeScreenPages(appRegistry);
  const pageCount = getHomeScreenPageCount(appRegistry);
  const dockApps = getDockIcons(appRegistry);
  const maybeOpenApp = getOpenRuntimeApp(runtimeState, appRegistry);
  const appSurfaceContent =
    maybeOpenApp?.launchSurface === "calculator" ? (
      <CalculatorApp />
    ) : maybeOpenApp?.launchSurface === "catalog" ? (
      <AppCatalogApp />
    ) : maybeOpenApp?.launchSurface === "browser" ? (
      <BrowserApp />
    ) : maybeOpenApp?.launchSurface === "notes" ? (
      <NotesApp />
    ) : maybeOpenApp?.launchSurface === "settings" ? (
      <SettingsApp />
    ) : maybeOpenApp !== null ? (
      <ComingSoonApp app={maybeOpenApp} />
    ) : null;

  useEffect(() => {
    return subscribeToOpenOsSettings(window, () => {
      setSettings(readOpenOsSettings(window.localStorage));
    });
  }, []);

  useEffect(() => {
    setRuntimeState((currentState) =>
      syncRuntimeMotionPreferences(currentState, {
        prefersReducedMotion: prefersReducedMotionForShell,
        supportsViewTransitions: hasNativeViewTransitions,
      }),
    );
  }, [hasNativeViewTransitions, prefersReducedMotionForShell]);

  return (
    <section
      aria-label="openOS shell foundation"
      className="shell-scene"
      data-motion={prefersReducedMotionForShell ? "reduced" : "full"}
      data-shell-profile={profile.kind}
      data-theme-preset={settings.themePreset}
      ref={sceneRef}
      style={createShellStyle(profile)}
    >
      <div className="shell-scene__frame">
        <AmbientBackground
          palette={ambientPalette}
          prefersReducedMotion={prefersReducedMotionForShell}
          profileKind={profile.kind}
        />
        <StatusBar profile={profile} />
        <div
          className="shell-scene__home"
          data-runtime-state={runtimeState.kind}
        >
          <>
            <HomeScreenPages
              activePage={runtimeState.activePage}
              onChangePage={(nextPage) => {
                setRuntimeState((currentState) =>
                  setActiveHomeScreenPage(
                    currentState,
                    nextPage,
                    pageCount,
                  ),
                );
              }}
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
                          prefersReducedMotion: prefersReducedMotionForShell,
                          supportsViewTransitions: hasNativeViewTransitions,
                        },
                      ),
                    );
                  },
                  document,
                  hasNativeViewTransitions && !prefersReducedMotion,
                );
              }}
              pages={homePages}
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
                          prefersReducedMotion: prefersReducedMotionForShell,
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
                  prefersReducedMotion: prefersReducedMotionForShell,
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
                              prefersReducedMotion: prefersReducedMotionForShell,
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

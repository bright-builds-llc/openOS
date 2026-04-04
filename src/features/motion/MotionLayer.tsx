import { useEffect } from "react";
import type { ReactNode } from "react";
import type { RuntimeApp } from "../runtime/appRegistry";
import {
  getNavigationDurationMs,
  type HomeNavigationState,
} from "./homeNavigationMotion";
import "./motionNavigation.css";

type MotionLayerProps = {
  app: RuntimeApp;
  state: Exclude<HomeNavigationState, { kind: "home" }>;
  children: ReactNode;
  onTransitionComplete: () => void;
};

type MotionLayerStyle = React.CSSProperties & Record<`--${string}`, string>;

function createMotionStyle(
  state: Exclude<HomeNavigationState, { kind: "home" }>,
): MotionLayerStyle {
  const viewportWidth = Math.max(window.innerWidth, 1);
  const viewportHeight = Math.max(window.innerHeight, 1);
  const originRect = state.originRect;

  return {
    "--motion-origin-left": `${originRect?.left ?? 0}px`,
    "--motion-origin-top": `${originRect?.top ?? 0}px`,
    "--motion-origin-scale-x": `${(originRect?.width ?? viewportWidth) / viewportWidth}`,
    "--motion-origin-scale-y": `${(originRect?.height ?? viewportHeight) / viewportHeight}`,
    "--motion-duration": `${getNavigationDurationMs(state)}ms`,
  };
}

export function MotionLayer({
  app,
  state,
  children,
  onTransitionComplete,
}: MotionLayerProps) {
  useEffect(() => {
    if (state.kind !== "opening" && state.kind !== "closing") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onTransitionComplete();
    }, getNavigationDurationMs(state));

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [onTransitionComplete, state]);

  return (
    <div
      className="motion-layer"
      data-driver={state.driver}
      data-motion-mode={state.motionMode}
      data-state={state.kind}
    >
      <div className="motion-layer__surface" style={createMotionStyle(state)}>
        <div className="motion-layer__surface-inner">
          <div className="motion-layer__surface-frame">
            <div className="motion-layer__content">{children}</div>
          </div>
          <div className="motion-layer__app-label">{app.label}</div>
        </div>
      </div>
    </div>
  );
}

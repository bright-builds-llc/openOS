import { startTransition, useEffect, useRef, useState } from "react";
import type { RuntimeApp } from "../../runtime/appRegistry";
import { captureMotionRect } from "../../motion/homeNavigationMotion";
import { PRESSED_ICON_DURATION_MS } from "../../runtime/homeScreenRuntime";

type AppIconButtonProps = {
  app: RuntimeApp;
  className: string;
  glyphClassName: string;
  onOpenApp: (
    appId: string,
    originRect: ReturnType<typeof captureMotionRect>,
  ) => void;
  style: React.CSSProperties;
};

export function AppIconButton({
  app,
  className,
  glyphClassName,
  onOpenApp,
  style,
}: AppIconButtonProps) {
  const timeoutRef = useRef<number | null>(null);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    const originRect = captureMotionRect(
      event.currentTarget.getBoundingClientRect(),
    );
    setIsPressed(true);
    timeoutRef.current = window.setTimeout(() => {
      setIsPressed(false);
      startTransition(() => {
        onOpenApp(app.id, originRect);
      });
    }, PRESSED_ICON_DURATION_MS);
  };

  return (
    <button
      className={className}
      data-availability={app.availability}
      data-launch-surface={app.launchSurface}
      data-pressed={isPressed ? "true" : "false"}
      onClick={handleOpen}
      style={style}
      type="button"
    >
      <div className={glyphClassName}>
        <span className="shell-icon-button__glyph">{app.icon.glyph}</span>
      </div>
      <div className="shell-grid__label">{app.label}</div>
    </button>
  );
}

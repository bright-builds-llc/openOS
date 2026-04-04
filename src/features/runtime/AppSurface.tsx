import type { PropsWithChildren, ReactNode } from "react";
import type { RuntimeApp } from "./appRegistry";
import "./runtimeShell.css";

type AppSurfaceProps = PropsWithChildren<{
  app: RuntimeApp;
  homeControl?: ReactNode;
}>;

export function AppSurface({
  app,
  children,
  homeControl,
}: AppSurfaceProps) {
  return (
    <section
      aria-label={`${app.label} app surface`}
      className="app-surface"
      data-availability={app.availability}
      data-launch-surface={app.launchSurface}
      data-testid={`app-surface:${app.id}`}
    >
      <header className="app-surface__header">
        <div className="app-surface__eyebrow">
          {app.availability === "implemented" ? "Implemented app" : "Preview app"}
        </div>
        <h1 className="app-surface__title">{app.label}</h1>
        <div className="app-surface__hint">
          {app.availability === "implemented"
            ? "Live runtime path"
            : "Placeholder runtime path"}
        </div>
      </header>
      <div className="app-surface__body">{children}</div>
      {homeControl ? (
        <div className="app-surface__chrome">{homeControl}</div>
      ) : null}
    </section>
  );
}

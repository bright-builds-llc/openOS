import { useState } from "react";
import { AppTapIntercept } from "./AppTapIntercept";
import { BrowserInstallOverlay } from "./BrowserInstallOverlay";
import { PreviewShell } from "./PreviewShell";
import "./browserInstall.css";

type BrowserInstallFlowProps = {
  installSource: string;
};

export function BrowserInstallFlow({
  installSource,
}: BrowserInstallFlowProps) {
  const [isTakeoverVisible, setIsTakeoverVisible] = useState(true);
  const [maybeInterceptedApp, setMaybeInterceptedApp] = useState<string | null>(
    null,
  );

  return (
    <section className="browser-install-shell">
      <div className="browser-install-shell__preview">
        <PreviewShell
          onAppTap={(appLabel) => {
            setMaybeInterceptedApp(appLabel);
          }}
        />
      </div>
      {isTakeoverVisible ? (
        <BrowserInstallOverlay
          onDismiss={() => {
            setIsTakeoverVisible(false);
          }}
        />
      ) : null}
      {maybeInterceptedApp !== null ? (
        <AppTapIntercept
          appLabel={maybeInterceptedApp}
          onClose={() => {
            setMaybeInterceptedApp(null);
          }}
        />
      ) : null}
      <div className="browser-install-shell__source">Detected from {installSource}</div>
    </section>
  );
}

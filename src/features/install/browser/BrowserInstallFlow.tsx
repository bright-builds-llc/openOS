import { useState } from "react";
import { AppTapIntercept } from "./AppTapIntercept";
import { BrowserInstallOverlay } from "./BrowserInstallOverlay";
import { PreviewShell } from "./PreviewShell";
import {
  createInstallPromptState,
  dismissInstallPrompt,
  showInstallTakeover,
} from "./installPromptState";
import {
  clearInstallPromptDismissedAt,
  readInstallPromptDismissedAt,
  writeInstallPromptDismissedAt,
} from "./installPromptStorage";
import "./browserInstall.css";

type BrowserInstallFlowProps = {
  installSource: string;
};

export function BrowserInstallFlow({
  installSource,
}: BrowserInstallFlowProps) {
  const [promptState, setPromptState] = useState(() =>
    createInstallPromptState({
      nowMs: Date.now(),
      maybeDismissedAt: readInstallPromptDismissedAt(window.localStorage),
    }),
  );
  const [maybeInterceptedApp, setMaybeInterceptedApp] = useState<string | null>(
    null,
  );
  const [installAssistSequence, setInstallAssistSequence] = useState(0);
  const isTakeoverVisible = promptState.mode === "takeover";

  function handleInstallAssist() {
    clearInstallPromptDismissedAt(window.localStorage);
    setMaybeInterceptedApp(null);
    setPromptState((currentState) => showInstallTakeover(currentState.maybeDismissedAt));
    setInstallAssistSequence((currentSequence) => currentSequence + 1);
  }

  return (
    <section className="browser-install-shell">
      <div className="browser-install-shell__preview">
        <PreviewShell
          onAppTap={(appLabel) => {
            if (promptState.mode === "persistent") {
              setMaybeInterceptedApp(appLabel);
              return;
            }

            setMaybeInterceptedApp(null);
          }}
        />
      </div>
      {isTakeoverVisible ? (
        <BrowserInstallOverlay
          assistSequence={installAssistSequence}
          onDismiss={() => {
            const nextState = dismissInstallPrompt(Date.now());

            setPromptState(nextState);
            writeInstallPromptDismissedAt(
              window.localStorage,
              nextState.maybeDismissedAt ?? Date.now(),
            );
          }}
          onInstallAssist={handleInstallAssist}
        />
      ) : null}
      {promptState.mode === "persistent" ? (
        <div className="install-prompt-pill">
          <div>
            <div className="install-prompt-pill__title">Install openOS</div>
            <div className="install-prompt-pill__body">
              Open apps for real from your Home Screen.
            </div>
          </div>
          <button
            className="install-prompt-pill__button"
            onClick={() => {
              clearInstallPromptDismissedAt(window.localStorage);
              setPromptState(showInstallTakeover(promptState.maybeDismissedAt));
            }}
            type="button"
          >
            Show steps
          </button>
        </div>
      ) : null}
      {maybeInterceptedApp !== null ? (
        <AppTapIntercept
          appLabel={maybeInterceptedApp}
          onClose={() => {
            setMaybeInterceptedApp(null);
          }}
          onInstallAssist={handleInstallAssist}
        />
      ) : null}
      <div className="browser-install-shell__source">Detected from {installSource}</div>
    </section>
  );
}

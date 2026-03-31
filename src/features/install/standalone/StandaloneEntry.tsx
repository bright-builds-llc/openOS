import { useEffect, useState } from "react";
import {
  completeLaunchIntro,
  createInitialLaunchState,
} from "./LaunchState";
import {
  hasSeenStandaloneLaunch,
  markStandaloneLaunchSeen,
} from "./LaunchStateStorage";
import "./standaloneEntry.css";

type StandaloneEntryProps = {
  installSource: string;
};

export function StandaloneEntry({
  installSource,
}: StandaloneEntryProps) {
  const [launchState, setLaunchState] = useState(() =>
    createInitialLaunchState(hasSeenStandaloneLaunch(window.localStorage)),
  );

  useEffect(() => {
    if (!launchState.shouldShowLaunchIntro) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      markStandaloneLaunchSeen(window.localStorage);
      setLaunchState((currentState) => completeLaunchIntro(currentState));
    }, 900);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [launchState]);

  if (launchState.shouldShowLaunchIntro) {
    return (
      <section className="standalone-entry">
        <div className="standalone-entry__splash">
          <div className="standalone-entry__icon" />
          <p className="standalone-entry__splash-title">Launching iCeption</p>
        </div>
      </section>
    );
  }

  return (
    <section className="standalone-entry">
      <div className="standalone-entry__ready">
        <div className="standalone-entry__badge">
          {launchState.kind === "first-launch"
            ? "Installed first launch"
            : "Installed return"}
        </div>
        <h1>Welcome to iCeption.</h1>
        <p className="standalone-entry__body">
          You are on the installed app path now. The iPhone-style home screen
          shell starts in Phase 2, but this branch already behaves like the
          real product entry instead of the browser preview.
        </p>
        <div className="standalone-entry__hint">
          Detected from {installSource}
        </div>
      </div>
    </section>
  );
}

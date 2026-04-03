import { useEffect, useState } from "react";
import {
  completeLaunchIntro,
  createInitialLaunchState,
} from "./LaunchState";
import { AdaptiveShellFoundation } from "../../shell/AdaptiveShellFoundation";
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
          <p className="standalone-entry__splash-title">Launching openOS</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="standalone-entry standalone-entry--shell"
      data-install-source={installSource}
    >
      <AdaptiveShellFoundation />
    </section>
  );
}

import { useEffect, useRef, useState } from "react";
import { installSteps } from "./installSteps";

type BrowserInstallOverlayProps = {
  assistSequence: number;
  onDismiss: () => void;
  onInstallAssist: () => void;
};

export function BrowserInstallOverlay({
  assistSequence,
  onDismiss,
  onInstallAssist,
}: BrowserInstallOverlayProps) {
  const stepsRef = useRef<HTMLOListElement | null>(null);
  const [isAssistActive, setIsAssistActive] = useState(false);

  useEffect(() => {
    if (assistSequence === 0) {
      return;
    }

    setIsAssistActive(true);
    stepsRef.current?.focus();
    stepsRef.current?.scrollIntoView({
      block: "center",
      behavior: "smooth",
    });

    const timeoutId = window.setTimeout(() => {
      setIsAssistActive(false);
    }, 1600);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [assistSequence]);

  return (
    <section
      className="install-overlay"
      aria-label="Install openOS"
      data-install-assist-active={isAssistActive ? "true" : "false"}
      data-testid="install-overlay"
    >
      <div className="install-overlay__eyebrow">Safari install required</div>
      <h1 className="install-overlay__title">Install openOS to enter the real experience.</h1>
      <p className="install-overlay__body">
        openOS is designed to feel like an iPhone only when it runs as an
        installed web app. This browser view is a guided preview.
      </p>
      <ol
        className="install-overlay__steps"
        data-testid="install-overlay-steps"
        ref={stepsRef}
        tabIndex={-1}
      >
        {installSteps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <p className="install-overlay__assist">
        Start with Safari&apos;s Share button, then follow the steps below.
      </p>
      <div className="install-overlay__actions">
        <button
          className="install-overlay__primary"
          data-testid="install-overlay-primary"
          onClick={onInstallAssist}
          type="button"
        >
          Install openOS
        </button>
        <button
          className="install-overlay__secondary"
          onClick={onDismiss}
          type="button"
        >
          Preview in browser
        </button>
      </div>
    </section>
  );
}

import { installSteps } from "./installSteps";

type BrowserInstallOverlayProps = {
  onDismiss: () => void;
};

export function BrowserInstallOverlay({
  onDismiss,
}: BrowserInstallOverlayProps) {
  return (
    <section
      className="install-overlay"
      aria-label="Install openOS"
      data-testid="install-overlay"
    >
      <div className="install-overlay__eyebrow">Safari install required</div>
      <h1 className="install-overlay__title">Install openOS to enter the real experience.</h1>
      <p className="install-overlay__body">
        openOS is designed to feel like an iPhone only when it runs as an
        installed web app. This browser view is a guided preview.
      </p>
      <ol className="install-overlay__steps">
        {installSteps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <div className="install-overlay__actions">
        <button className="install-overlay__primary" type="button">
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

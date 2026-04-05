type AppTapInterceptProps = {
  appLabel: string;
  onClose: () => void;
  onInstallAssist: () => void;
};

export function AppTapIntercept({
  appLabel,
  onClose,
  onInstallAssist,
}: AppTapInterceptProps) {
  return (
    <section className="install-intercept" aria-label={`${appLabel} install prompt`}>
      <div className="install-intercept__card">
        <p className="entry-kicker">Preview limit reached</p>
        <h2>Install openOS to open {appLabel}.</h2>
        <p className="entry-body">
          Browser mode is only a guided preview. Add openOS to your Home
          Screen to use the real app experience.
        </p>
        <div className="install-overlay__actions">
          <button
            className="install-overlay__primary"
            data-testid="install-intercept-primary"
            onClick={onInstallAssist}
            type="button"
          >
            Install openOS
          </button>
          <button
            className="install-overlay__secondary"
            onClick={onClose}
            type="button"
          >
            Back to preview
          </button>
        </div>
      </div>
    </section>
  );
}

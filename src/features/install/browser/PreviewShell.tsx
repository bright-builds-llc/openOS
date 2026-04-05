import {
  getBrowserPreviewDockApps,
  getBrowserPreviewGridApps,
} from "./browserPreviewApps";

type PreviewShellProps = {
  onAppTap: (appLabel: string) => void;
};

export function PreviewShell({ onAppTap }: PreviewShellProps) {
  const gridApps = getBrowserPreviewGridApps();
  const dockApps = getBrowserPreviewDockApps();

  return (
    <>
      <div className="browser-install-shell__status">
        <span>9:41</span>
        <span>Preview mode</span>
      </div>
      <div className="browser-install-shell__grid">
        {gridApps.map((app) => (
          <button
            className="browser-install-shell__icon browser-install-shell__icon-button"
            data-testid={`preview-app:${app.id}`}
            key={app.id}
            onClick={() => {
              onAppTap(app.label);
            }}
            type="button"
          >
            <div
              className="browser-install-shell__glyph"
              style={{
                background: `linear-gradient(180deg, ${app.icon.tintStart} 0%, ${app.icon.tintEnd} 100%)`,
              }}
            >
              <span className="browser-install-shell__glyph-text">
                {app.icon.glyph}
              </span>
            </div>
            <div className="browser-install-shell__label">{app.label}</div>
          </button>
        ))}
      </div>
      <div className="browser-install-shell__dock">
        {dockApps.map((app) => (
          <div
            className="browser-install-shell__dock-glyph"
            data-testid={`preview-dock:${app.id}`}
            key={app.id}
            style={{
              background: `linear-gradient(180deg, ${app.icon.tintStart} 0%, ${app.icon.tintEnd} 100%)`,
            }}
          >
            <span className="browser-install-shell__glyph-text">
              {app.icon.glyph}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

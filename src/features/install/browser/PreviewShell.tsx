type PreviewShellProps = {
  onAppTap: (appLabel: string) => void;
};

const previewIcons = [
  "Calculator",
  "Weather",
  "Camera",
  "Photos",
  "Music",
  "Notes",
  "Maps",
  "Clock",
];

export function PreviewShell({ onAppTap }: PreviewShellProps) {
  return (
    <>
      <div className="browser-install-shell__status">
        <span>9:41</span>
        <span>Preview mode</span>
      </div>
      <div className="browser-install-shell__grid">
        {previewIcons.map((label) => (
          <button
            className="browser-install-shell__icon browser-install-shell__icon-button"
            key={label}
            onClick={() => {
              onAppTap(label);
            }}
            type="button"
          >
            <div className="browser-install-shell__glyph" />
            <div className="browser-install-shell__label">{label}</div>
          </button>
        ))}
      </div>
      <div className="browser-install-shell__dock">
        <div className="browser-install-shell__dock-glyph" />
        <div className="browser-install-shell__dock-glyph" />
        <div className="browser-install-shell__dock-glyph" />
        <div className="browser-install-shell__dock-glyph" />
      </div>
    </>
  );
}

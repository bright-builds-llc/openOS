import { useState } from "react";
import { BrowserInstallOverlay } from "./BrowserInstallOverlay";
import "./browserInstall.css";

type BrowserInstallFlowProps = {
  installSource: string;
};

export function BrowserInstallFlow({
  installSource,
}: BrowserInstallFlowProps) {
  const [isTakeoverVisible, setIsTakeoverVisible] = useState(true);

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

  return (
    <section className="browser-install-shell">
      <div
        aria-hidden="true"
        className="browser-install-shell__preview"
      >
        <div className="browser-install-shell__status">
          <span>9:41</span>
          <span>{installSource}</span>
        </div>
        <div className="browser-install-shell__grid">
          {previewIcons.map((label) => (
            <div className="browser-install-shell__icon" key={label}>
              <div className="browser-install-shell__glyph" />
              <div className="browser-install-shell__label">{label}</div>
            </div>
          ))}
        </div>
        <div className="browser-install-shell__dock">
          <div className="browser-install-shell__dock-glyph" />
          <div className="browser-install-shell__dock-glyph" />
          <div className="browser-install-shell__dock-glyph" />
          <div className="browser-install-shell__dock-glyph" />
        </div>
      </div>
      {isTakeoverVisible ? (
        <BrowserInstallOverlay
          onDismiss={() => {
            setIsTakeoverVisible(false);
          }}
        />
      ) : null}
    </section>
  );
}

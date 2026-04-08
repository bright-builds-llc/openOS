import { useEffect, useState } from "react";
import {
  availableThemePresets,
  type OpenOsMotionPreference,
  readOpenOsSettings,
  subscribeToOpenOsSettings,
  type OpenOsThemePreset,
  type OpenOsSettings,
  writeOpenOsSettings,
} from "../../settings/settingsPreferences";
import {
  listCanonicalRuntimeAppsForSettings,
} from "../../runtime/appRegistry";
import "./settings.css";

const motionOptions: {
  value: OpenOsMotionPreference;
  label: string;
  hint: string;
}[] = [
  {
    value: "system",
    label: "System",
    hint: "Match your device preference.",
  },
  {
    value: "full",
    label: "Full",
    hint: "Always use the richer shell motion path.",
  },
  {
    value: "reduced",
    label: "Reduced",
    hint: "Prefer gentler openOS motion.",
  },
];

const themeLabels: Record<OpenOsThemePreset, string> = {
  laguna: "Laguna",
  midnight: "Midnight",
};

function PreferenceGroupLabel({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="settings-app__group-label">
      <p className="settings-app__eyebrow">{eyebrow}</p>
      <h2 className="settings-app__group-title">{title}</h2>
      <p className="settings-app__group-body">{body}</p>
    </div>
  );
}

export function SettingsApp() {
  const [settings, setSettings] = useState(() =>
    readOpenOsSettings(window.localStorage),
  );
  const settingsVisibleApps = listCanonicalRuntimeAppsForSettings();

  useEffect(() => {
    return subscribeToOpenOsSettings(window, () => {
      setSettings(readOpenOsSettings(window.localStorage));
    });
  }, []);

  function writeSettings(
    nextSettings: OpenOsSettings,
  ) {
    writeOpenOsSettings(window.localStorage, nextSettings, window);
  }

  return (
    <section
      aria-label="Settings controls"
      className="settings-app"
      data-testid="settings-app"
    >
      <header className="settings-app__hero">
        <p className="settings-app__eyebrow">openOS</p>
        <h1 className="settings-app__title">Settings</h1>
        <p className="settings-app__body">
          Tune the shell you actually live in. These controls affect the
          current openOS experience immediately and persist locally on this
          device.
        </p>
      </header>

      <section className="settings-app__group">
        <PreferenceGroupLabel
          body="Choose the ambient look that wraps the home screen and app surfaces."
          eyebrow="Appearance"
          title="Theme Preset"
        />
        <div className="settings-app__chips">
          {availableThemePresets.map((themePreset) => {
            const isActive = settings.themePreset === themePreset;

            return (
              <button
                className="settings-app__chip"
                data-active={isActive ? "true" : "false"}
                data-testid={`settings-theme:${themePreset}`}
                key={themePreset}
                onClick={() => {
                  writeSettings({
                    ...settings,
                    themePreset,
                  });
                }}
                type="button"
              >
                <span className="settings-app__chip-title">
                  {themeLabels[themePreset]}
                </span>
                <span className="settings-app__chip-hint">
                  {themePreset === "laguna"
                    ? "Cinematic blue-green glow"
                    : "Darker late-night shell tone"}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="settings-app__group">
        <PreferenceGroupLabel
          body="Control how strongly openOS leans into animated transitions."
          eyebrow="Motion"
          title="Motion Preference"
        />
        <div className="settings-app__stack">
          {motionOptions.map((option) => {
            const isActive =
              settings.motionPreference === option.value;

            return (
              <button
                className="settings-app__row"
                data-active={isActive ? "true" : "false"}
                data-testid={`settings-motion:${option.value}`}
                key={option.value}
                onClick={() => {
                  writeSettings({
                    ...settings,
                    motionPreference: option.value,
                  });
                }}
                type="button"
              >
                <span className="settings-app__row-copy">
                  <span className="settings-app__row-title">
                    {option.label}
                  </span>
                  <span className="settings-app__row-hint">
                    {option.hint}
                  </span>
                </span>
                <span className="settings-app__row-value">
                  {isActive ? "On" : "Off"}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="settings-app__group">
        <PreferenceGroupLabel
          body="The first internal app-management surface is intentionally simple: it shows which apps currently participate in Settings and whether they already have a dedicated storage namespace."
          eyebrow="Apps"
          title="Platform Management"
        />
        <div
          className="settings-app__stack"
          data-testid="settings-managed-apps"
        >
          {settingsVisibleApps.map((app) => (
            <section
              className="settings-app__row settings-app__row--app"
              data-testid={`settings-managed-app:${app.id}`}
              key={app.id}
            >
              <span className="settings-app__row-copy">
                <span className="settings-app__row-title">
                  {app.label}
                </span>
                <span className="settings-app__row-hint">
                  {app.storage.namespace}
                </span>
              </span>
              <span className="settings-app__row-value">
                {app.settings.visibility === "app-list"
                  ? "Visible"
                  : "Hidden"}
              </span>
            </section>
          ))}
        </div>
      </section>
    </section>
  );
}

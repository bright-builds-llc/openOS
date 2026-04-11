import type { FormEvent } from "react";
import { useState } from "react";
import { getCanonicalRuntimeAppForLaunchSurface } from "../../runtime/appRegistry";
import { BrowserFrame } from "./BrowserFrame";
import {
  browserDestinations,
  createDirectBrowserDestination,
  type BrowserDestination,
} from "./browserDestinations";
import "./browser.css";

const MAX_RECENT_DESTINATIONS = 4;

function getBrowserRuntimeApp() {
  const maybeBrowserApp =
    getCanonicalRuntimeAppForLaunchSurface("browser");

  if (maybeBrowserApp === null) {
    throw new Error("Browser runtime metadata is missing.");
  }

  return maybeBrowserApp;
}

function getDestinationAddress(
  destination: BrowserDestination,
): string {
  return destination.displayUrl;
}

function BrowserDestinationButton({
  destination,
  isActive,
  testId,
  onClick,
}: {
  destination: BrowserDestination;
  isActive: boolean;
  testId: string;
  onClick: () => void;
}) {
  return (
    <button
      className="browser-app__destination"
      data-active={isActive ? "true" : "false"}
      data-testid={testId}
      onClick={onClick}
      type="button"
    >
      <span className="browser-app__destination-title">
        {destination.title}
      </span>
      <span className="browser-app__destination-copy">
        {destination.description}
      </span>
    </button>
  );
}

const BROWSER_RUNTIME_APP = getBrowserRuntimeApp();
const initialDestination =
  browserDestinations[0] ?? null;

export function BrowserApp() {
  const [selectedDestinationId, setSelectedDestinationId] =
    useState(initialDestination?.id ?? null);
  const [recentDestinations, setRecentDestinations] =
    useState<BrowserDestination[]>([]);
  const [addressDraft, setAddressDraft] = useState(
    initialDestination === null
      ? ""
      : getDestinationAddress(initialDestination),
  );
  const [maybeAddressError, setMaybeAddressError] =
    useState<string | null>(null);
  const selectedDestination =
    [...recentDestinations, ...browserDestinations].find(
      (destination) =>
        destination.id === selectedDestinationId,
    ) ?? null;

  function selectDestination(
    destination: BrowserDestination,
  ) {
    setSelectedDestinationId(destination.id);
    setAddressDraft(getDestinationAddress(destination));
    setMaybeAddressError(null);
  }

  function handleDirectNavigation(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const navigationResult =
      createDirectBrowserDestination(addressDraft, {
        baseUrl: window.location.origin,
      });

    if (navigationResult.status === "invalid") {
      setMaybeAddressError(navigationResult.message);
      return;
    }

    if (!navigationResult.matchedConfigured) {
      setRecentDestinations((currentDestinations) => {
        return [
          navigationResult.destination,
          ...currentDestinations.filter(
            (destination) =>
              destination.id !==
              navigationResult.destination.id,
          ),
        ].slice(0, MAX_RECENT_DESTINATIONS);
      });
    }

    selectDestination(navigationResult.destination);
  }

  return (
    <section
      aria-label="Browser controls"
      className="browser-app"
      data-testid="browser-app"
    >
      <header className="browser-app__hero">
        <div>
          <div className="browser-app__app-chip">
            <span aria-hidden="true" className="browser-app__app-glyph">
              {BROWSER_RUNTIME_APP.icon.glyph}
            </span>
            <span className="browser-app__app-label">
              Managed app
            </span>
          </div>
          <p className="browser-app__eyebrow">openOS</p>
          <h1 className="browser-app__title">
            {BROWSER_RUNTIME_APP.label}
          </h1>
        </div>
        <p className="browser-app__body">
          openOS now accepts direct URLs, but it still stays honest:
          only same-origin destinations are rendered inline here, and
          everything else gets a clear Safari fallback instead of a fake
          success state.
        </p>
      </header>

      <form
        className="browser-app__address-bar"
        data-testid="browser-address-bar"
        onSubmit={handleDirectNavigation}
      >
        <label
          className="browser-app__address-field"
          htmlFor="browser-address-input"
        >
          <span className="browser-app__address-label">
            Address
          </span>
          <input
            className="browser-app__address-input"
            data-testid="browser-address-input"
            id="browser-address-input"
            onChange={(event) => {
              setAddressDraft(event.target.value);
            }}
            placeholder="example.com or /browser-fixtures/direct-url.html"
            spellCheck="false"
            type="text"
            value={addressDraft}
          />
        </label>
        <button
          className="browser-app__address-go"
          data-testid="browser-address-go"
          type="submit"
        >
          Go
        </button>
        <p className="browser-app__address-hint">
          Direct entry works for local openOS paths and arbitrary http(s)
          URLs. Unknown external pages stay honest and open through
          Safari.
        </p>
        {maybeAddressError === null ? null : (
          <p
            className="browser-app__address-error"
            data-testid="browser-address-error"
          >
            {maybeAddressError}
          </p>
        )}
      </form>

      {recentDestinations.length === 0 ? null : (
        <section
          className="browser-app__recents"
          data-testid="browser-recents"
        >
          <div className="browser-app__section-header">
            <p className="browser-app__eyebrow">Recent</p>
            <span className="browser-app__section-meta">
              Direct destinations
            </span>
          </div>
          <div className="browser-app__destination-grid">
            {recentDestinations.map((destination) => (
              <BrowserDestinationButton
                destination={destination}
                isActive={
                  destination.id === selectedDestinationId
                }
                key={destination.id}
                onClick={() => {
                  selectDestination(destination);
                }}
                testId={`browser-recent:${destination.id}`}
              />
            ))}
          </div>
        </section>
      )}

      <section className="browser-app__suggested">
        <div className="browser-app__section-header">
          <p className="browser-app__eyebrow">Suggested</p>
          <span className="browser-app__section-meta">
            Known safe or known-fallback examples
          </span>
        </div>
        <nav
          aria-label="Browser destinations"
          className="browser-app__destination-grid"
          data-testid="browser-destinations"
        >
          {browserDestinations.map((destination) => {
            const isActive =
              destination.id === selectedDestinationId;

            return (
              <BrowserDestinationButton
                destination={destination}
                isActive={isActive}
                key={destination.id}
                onClick={() => {
                  selectDestination(destination);
                }}
                testId={`browser-destination:${destination.id}`}
              />
            );
          })}
        </nav>
      </section>

      {selectedDestination === null ? null : selectedDestination.renderMode ===
        "embedded" ? (
        <BrowserFrame destination={selectedDestination} />
      ) : (
        <section
          className="browser-app__fallback"
          data-testid="browser-fallback"
        >
          <div className="browser-app__fallback-badge">
            Open externally
          </div>
          <h2 className="browser-app__fallback-title">
            {selectedDestination.title} can’t be embedded here.
          </h2>
          <p
            className="browser-app__fallback-address"
            data-testid="browser-current-address"
          >
            {selectedDestination.displayUrl}
          </p>
          <p className="browser-app__fallback-body">
            openOS only claims inline browsing for destinations it knows
            are safe in this shell. This address stays honest and hands
            off to Safari instead of pretending iframe support exists.
          </p>
          <a
            className="browser-app__fallback-link"
            data-testid="browser-open-external"
            href={selectedDestination.url}
            rel="noreferrer"
            target="_blank"
          >
            Open in Safari
          </a>
        </section>
      )}
    </section>
  );
}

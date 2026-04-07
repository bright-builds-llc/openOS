import { useState } from "react";
import { BrowserFrame } from "./BrowserFrame";
import {
  browserDestinations,
  getBrowserDestination,
} from "./browserDestinations";
import "./browser.css";

const initialDestination =
  browserDestinations[0]?.id ?? null;

export function BrowserApp() {
  const [selectedDestinationId, setSelectedDestinationId] =
    useState(initialDestination);
  const selectedDestination =
    selectedDestinationId === null
      ? null
      : getBrowserDestination(selectedDestinationId);

  return (
    <section
      aria-label="Browser controls"
      className="browser-app"
      data-testid="browser-app"
    >
      <header className="browser-app__hero">
        <div>
          <p className="browser-app__eyebrow">openOS</p>
          <h1 className="browser-app__title">Browser</h1>
        </div>
        <p className="browser-app__body">
          This browser stays honest: it only embeds destinations
          we know are safe to render here, and it hands blocked
          destinations back to Safari when needed.
        </p>
      </header>

      <nav
        aria-label="Browser destinations"
        className="browser-app__destinations"
        data-testid="browser-destinations"
      >
        {browserDestinations.map((destination) => {
          const isActive =
            destination.id === selectedDestinationId;

          return (
            <button
              className="browser-app__destination"
              data-active={isActive ? "true" : "false"}
              data-testid={`browser-destination:${destination.id}`}
              key={destination.id}
              onClick={() => {
                setSelectedDestinationId(destination.id);
              }}
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
        })}
      </nav>

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
          <p className="browser-app__fallback-body">
            Some destinations block iframe embedding through site
            policy. openOS keeps the Browser honest and sends you
            to Safari instead of pretending the page loaded.
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

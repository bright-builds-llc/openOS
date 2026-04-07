import type { BrowserDestination } from "./browserDestinations";
import "./browserFrame.css";

type BrowserFrameProps = {
  destination: BrowserDestination;
};

export function BrowserFrame({ destination }: BrowserFrameProps) {
  return (
    <section
      className="browser-frame"
      data-testid="browser-frame"
      data-destination-id={destination.id}
    >
      <header className="browser-frame__header">
        <div className="browser-frame__title">{destination.title}</div>
        <div className="browser-frame__subtitle">
          Embedded destination
        </div>
      </header>
      <iframe
        className="browser-frame__iframe"
        data-testid="browser-frame-iframe"
        loading="eager"
        referrerPolicy="no-referrer"
        sandbox="allow-forms allow-popups allow-same-origin allow-scripts"
        src={destination.url}
        title={destination.title}
      />
    </section>
  );
}

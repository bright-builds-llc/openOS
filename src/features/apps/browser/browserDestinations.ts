export type BrowserDestinationRenderMode =
  | "embedded"
  | "external-fallback";

export type BrowserDestination = {
  id: string;
  title: string;
  description: string;
  url: string;
  renderMode: BrowserDestinationRenderMode;
};

export const browserDestinations: BrowserDestination[] = [
  {
    id: "openos-guide",
    title: "openOS Guide",
    description: "Deterministic local page that is safe to embed.",
    url: "/browser-fixtures/embed-safe.html",
    renderMode: "embedded",
  },
  {
    id: "mdn-web-docs",
    title: "MDN Web Docs",
    description:
      "Known external destination used to demonstrate graceful fallback.",
    url: "https://developer.mozilla.org/",
    renderMode: "external-fallback",
  },
];

export function getBrowserDestination(
  destinationId: string,
  maybeDestinations: BrowserDestination[] = browserDestinations,
): BrowserDestination | null {
  return (
    maybeDestinations.find(
      (destination) => destination.id === destinationId,
    ) ?? null
  );
}

export function listEmbeddedBrowserDestinations(
  maybeDestinations: BrowserDestination[] = browserDestinations,
): BrowserDestination[] {
  return maybeDestinations.filter(
    (destination) => destination.renderMode === "embedded",
  );
}

export function listExternalFallbackBrowserDestinations(
  maybeDestinations: BrowserDestination[] = browserDestinations,
): BrowserDestination[] {
  return maybeDestinations.filter(
    (destination) => destination.renderMode === "external-fallback",
  );
}

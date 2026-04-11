import { describe, expect, it } from "vitest";
import {
  browserDestinations,
  createDirectBrowserDestination,
  getBrowserDestination,
  getBrowserDestinationByUrl,
  listEmbeddedBrowserDestinations,
  listExternalFallbackBrowserDestinations,
} from "./browserDestinations";

const baseUrl = "https://openos.local/";

describe("browserDestinations", () => {
  it("returns the configured destination by id", () => {
    // Arrange
    const destinationId = "openos-guide";

    // Act
    const result = getBrowserDestination(destinationId);

    // Assert
    expect(result).toMatchObject({
      id: "openos-guide",
      renderMode: "embedded",
      source: "curated",
    });
  });

  it("lists embedded destinations separately from fallback destinations", () => {
    // Arrange
    const maybeDestinations = browserDestinations;

    // Act
    const embedded = listEmbeddedBrowserDestinations(
      maybeDestinations,
    );
    const externalFallback =
      listExternalFallbackBrowserDestinations(
        maybeDestinations,
      );

    // Assert
    expect(embedded.map((destination) => destination.id)).toEqual([
      "openos-guide",
    ]);
    expect(
      externalFallback.map((destination) => destination.id),
    ).toEqual(["mdn-web-docs"]);
  });

  it("matches an entered URL to an existing configured destination", () => {
    // Arrange
    const rawUrl = "developer.mozilla.org";

    // Act
    const result = createDirectBrowserDestination(rawUrl, {
      baseUrl,
    });

    // Assert
    expect(result).toEqual({
      status: "ready",
      destination: expect.objectContaining({
        id: "mdn-web-docs",
      }),
      matchedConfigured: true,
    });
  });

  it("creates an embedded direct destination for same-origin paths", () => {
    // Arrange
    const rawUrl = "/browser-fixtures/direct-url.html";

    // Act
    const result = createDirectBrowserDestination(rawUrl, {
      baseUrl,
    });

    // Assert
    expect(result).toEqual({
      status: "ready",
      matchedConfigured: false,
      destination: expect.objectContaining({
        renderMode: "embedded",
        displayUrl: "/browser-fixtures/direct-url.html",
        source: "direct",
      }),
    });
  });

  it("creates an external fallback destination for arbitrary remote urls", () => {
    // Arrange
    const rawUrl = "example.com/path";

    // Act
    const result = createDirectBrowserDestination(rawUrl, {
      baseUrl,
    });

    // Assert
    expect(result).toEqual({
      status: "ready",
      matchedConfigured: false,
      destination: expect.objectContaining({
        renderMode: "external-fallback",
        displayUrl: "https://example.com/path",
        source: "direct",
      }),
    });
  });

  it("rejects unsupported protocols", () => {
    // Arrange
    const rawUrl = "mailto:hello@example.com";

    // Act
    const result = createDirectBrowserDestination(rawUrl, {
      baseUrl,
    });

    // Assert
    expect(result).toEqual({
      status: "invalid",
      message:
        "Only http(s) URLs and local openOS paths work here for now.",
    });
  });

  it("looks up a configured destination by normalized url", () => {
    // Arrange
    const rawUrl = "/browser-fixtures/embed-safe.html";

    // Act
    const result = getBrowserDestinationByUrl(
      rawUrl,
      baseUrl,
    );

    // Assert
    expect(result?.id).toBe("openos-guide");
  });

  it("returns null for an unknown destination id", () => {
    // Arrange
    const destinationId = "missing";

    // Act
    const result = getBrowserDestination(destinationId);

    // Assert
    expect(result).toBeNull();
  });
});

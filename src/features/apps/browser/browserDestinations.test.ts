import { describe, expect, it } from "vitest";
import {
  browserDestinations,
  getBrowserDestination,
  listEmbeddedBrowserDestinations,
  listExternalFallbackBrowserDestinations,
} from "./browserDestinations";

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

  it("returns null for an unknown destination id", () => {
    // Arrange
    const destinationId = "missing";

    // Act
    const result = getBrowserDestination(destinationId);

    // Assert
    expect(result).toBeNull();
  });
});

import { describe, expect, it } from "vitest";
import {
  createSubmittedAppStorageNamespace,
  getSubmittedAppManifestById,
  listCatalogReadySubmittedApps,
  listSubmittedAppManifests,
  listSubmittedAppValidationResults,
  validateSubmittedAppManifest,
  type SubmittedAppManifest,
} from "./submittedAppManifests";

describe("submittedAppManifests", () => {
  it("loads the checked-in sample submission manifest", () => {
    // Arrange

    // Act
    const manifests = listSubmittedAppManifests();
    const result = manifests.map((manifest) => manifest.id);

    // Assert
    expect(result).toEqual([
      "studio-lab",
      "signal-box",
    ]);
  });

  it("treats the sample manifest as catalog-ready and valid", () => {
    // Arrange

    // Act
    const results = listSubmittedAppValidationResults();

    // Assert
    expect(results).toEqual([
      {
        manifest: expect.objectContaining({
          id: "studio-lab",
          catalog: expect.objectContaining({
            status: "catalog-ready",
          }),
        }),
        issues: [],
      },
      {
        manifest: expect.objectContaining({
          id: "signal-box",
          catalog: expect.objectContaining({
            status: "catalog-ready",
          }),
        }),
        issues: [],
      },
    ]);
  });

  it("lists only catalog-ready validated submissions for future catalog work", () => {
    // Arrange

    // Act
    const result = listCatalogReadySubmittedApps().map(
      (manifest) => manifest.id,
    );

    // Assert
    expect(result).toEqual([
      "studio-lab",
      "signal-box",
    ]);
  });

  it("flags catalog-ready submissions that are missing review metadata", () => {
    // Arrange
    const invalidManifest: SubmittedAppManifest = {
      id: "signal-box",
      label: "Signal Box",
      summary: "A lightweight communications surface.",
      description:
        "Signal Box is a sample communications app submission.",
      developer: {
        name: "Bright Builds Labs",
      },
      source: {
        repositoryUrl:
          "https://github.com/bright-builds-llc/signal-box",
      },
      icon: {
        glyph: "◉",
        tintStart: "#38bdf8",
        tintEnd: "#2563eb",
      },
      runtime: {
        launchId: "signal-box",
        settings: {
          visibility: "hidden",
        },
        storage: {
          namespace:
            createSubmittedAppStorageNamespace("signal-box"),
        },
      },
      catalog: {
        status: "catalog-ready",
        category: "Communication",
        tags: ["chat"],
      },
      review: {
        submittedAt: "2026-04-11",
      },
    };

    // Act
    const result = validateSubmittedAppManifest(
      invalidManifest,
    );

    // Assert
    expect(result).toEqual([
      {
        field: "review.reviewedAt",
        message:
          "Catalog-ready submissions need a recorded review date.",
      },
    ]);
  });

  it("looks up a submitted manifest by id", () => {
    // Arrange

    // Act
    const result = getSubmittedAppManifestById("studio-lab");

    // Assert
    expect(result?.label).toBe("Studio Lab");
  });
});

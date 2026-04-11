import type { RuntimeAppIcon } from "./appDefinitions";
import type { AppSettingsParticipation } from "./appSettings";
import type { AppStorageMetadata } from "./appStorage";
import signalBoxManifest from "./submitted-apps/signal-box.json";
import studioLabManifest from "./submitted-apps/studio-lab.json";

const SUBMITTED_APP_ID_PATTERN =
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HEX_COLOR_PATTERN =
  /^#[0-9a-fA-F]{6}$/;
const ISO_DATE_PATTERN =
  /^\d{4}-\d{2}-\d{2}$/;

export type SubmittedAppCatalogStatus =
  | "draft"
  | "catalog-ready";

export type SubmittedAppManifest = {
  id: string;
  label: string;
  summary: string;
  description: string;
  developer: {
    name: string;
  };
  source: {
    repositoryUrl: string;
  };
  icon: RuntimeAppIcon;
  runtime: {
    launchId: string;
    settings: AppSettingsParticipation;
    storage: AppStorageMetadata;
  };
  catalog: {
    status: SubmittedAppCatalogStatus;
    category: string;
    tags: string[];
  };
  review: {
    submittedAt: string;
    reviewedAt?: string;
    reviewNotes?: string;
  };
};

export type SubmittedAppValidationIssue = {
  field: string;
  message: string;
};

export type SubmittedAppValidationResult = {
  manifest: SubmittedAppManifest;
  issues: SubmittedAppValidationIssue[];
};

export function createSubmittedAppStorageNamespace(
  submittedAppId: string,
): string {
  return `openos.apps.submitted.${submittedAppId}`;
}

function isHttpsUrl(
  maybeValue: string,
): boolean {
  try {
    const url = new URL(maybeValue);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

function isIsoDate(
  maybeValue: string,
): boolean {
  return ISO_DATE_PATTERN.test(maybeValue);
}

function validateTagList(
  tags: string[],
): SubmittedAppValidationIssue[] {
  const issues: SubmittedAppValidationIssue[] = [];
  const normalizedTags = tags.map((tag) =>
    tag.trim().toLowerCase(),
  );

  if (tags.length === 0) {
    issues.push({
      field: "catalog.tags",
      message: "Include at least one catalog tag.",
    });
  }

  if (normalizedTags.some((tag) => tag === "")) {
    issues.push({
      field: "catalog.tags",
      message: "Catalog tags must be non-empty strings.",
    });
  }

  if (new Set(normalizedTags).size !== normalizedTags.length) {
    issues.push({
      field: "catalog.tags",
      message: "Catalog tags must be unique.",
    });
  }

  return issues;
}

export function validateSubmittedAppManifest(
  manifest: SubmittedAppManifest,
): SubmittedAppValidationIssue[] {
  const issues: SubmittedAppValidationIssue[] = [];

  if (!SUBMITTED_APP_ID_PATTERN.test(manifest.id)) {
    issues.push({
      field: "id",
      message:
        "Use lowercase kebab-case for submitted app ids.",
    });
  }

  if (manifest.label.trim() === "") {
    issues.push({
      field: "label",
      message: "Provide a user-facing app label.",
    });
  }

  if (manifest.summary.trim() === "") {
    issues.push({
      field: "summary",
      message: "Provide a short summary for catalog browsing.",
    });
  }

  if (manifest.description.trim() === "") {
    issues.push({
      field: "description",
      message:
        "Provide a fuller description for review and future catalog detail surfaces.",
    });
  }

  if (manifest.developer.name.trim() === "") {
    issues.push({
      field: "developer.name",
      message: "Provide the contributor or team name.",
    });
  }

  if (!isHttpsUrl(manifest.source.repositoryUrl)) {
    issues.push({
      field: "source.repositoryUrl",
      message: "Repository URLs must be valid https URLs.",
    });
  }

  if (!HEX_COLOR_PATTERN.test(manifest.icon.tintStart)) {
    issues.push({
      field: "icon.tintStart",
      message: "Icon tintStart must be a 6-digit hex color.",
    });
  }

  if (!HEX_COLOR_PATTERN.test(manifest.icon.tintEnd)) {
    issues.push({
      field: "icon.tintEnd",
      message: "Icon tintEnd must be a 6-digit hex color.",
    });
  }

  if (
    Array.from(manifest.icon.glyph.trim()).length === 0 ||
    Array.from(manifest.icon.glyph.trim()).length > 3
  ) {
    issues.push({
      field: "icon.glyph",
      message:
        "Icon glyph should be a short symbol that fits the current app icon treatment.",
    });
  }

  if (manifest.runtime.launchId !== manifest.id) {
    issues.push({
      field: "runtime.launchId",
      message:
        "Use the submitted app id as the future launch id for now.",
    });
  }

  if (
    manifest.runtime.storage.namespace !==
    createSubmittedAppStorageNamespace(manifest.id)
  ) {
    issues.push({
      field: "runtime.storage.namespace",
      message:
        "Submitted app storage namespaces must use openos.apps.submitted.<id>.",
    });
  }

  if (
    manifest.runtime.settings.visibility !== "hidden"
  ) {
    issues.push({
      field: "runtime.settings.visibility",
      message:
        "Submitted apps stay hidden from Settings until install/catalog phases broaden that contract.",
    });
  }

  if (manifest.catalog.category.trim() === "") {
    issues.push({
      field: "catalog.category",
      message: "Provide a catalog category.",
    });
  }

  issues.push(...validateTagList(manifest.catalog.tags));

  if (!isIsoDate(manifest.review.submittedAt)) {
    issues.push({
      field: "review.submittedAt",
      message: "submittedAt must be an ISO date (YYYY-MM-DD).",
    });
  }

  if (
    manifest.review.reviewedAt !== undefined &&
    !isIsoDate(manifest.review.reviewedAt)
  ) {
    issues.push({
      field: "review.reviewedAt",
      message: "reviewedAt must be an ISO date (YYYY-MM-DD).",
    });
  }

  if (
    manifest.catalog.status === "catalog-ready" &&
    manifest.review.reviewedAt === undefined
  ) {
    issues.push({
      field: "review.reviewedAt",
      message:
        "Catalog-ready submissions need a recorded review date.",
    });
  }

  return issues;
}

const studioLabManifestRecord =
  studioLabManifest as SubmittedAppManifest;
const signalBoxManifestRecord =
  signalBoxManifest as SubmittedAppManifest;

export const submittedAppManifestRecords: SubmittedAppManifest[] = [
  studioLabManifestRecord,
  signalBoxManifestRecord,
];

export function listSubmittedAppManifests(): SubmittedAppManifest[] {
  return submittedAppManifestRecords;
}

export function getSubmittedAppManifestById(
  manifestId: string,
  maybeManifests: SubmittedAppManifest[] = listSubmittedAppManifests(),
): SubmittedAppManifest | null {
  return (
    maybeManifests.find(
      (manifest) => manifest.id === manifestId,
    ) ?? null
  );
}

export function listSubmittedAppValidationResults(
  maybeManifests: SubmittedAppManifest[] = listSubmittedAppManifests(),
): SubmittedAppValidationResult[] {
  return maybeManifests.map((manifest) => ({
    manifest,
    issues: validateSubmittedAppManifest(manifest),
  }));
}

export function listCatalogReadySubmittedApps(
  maybeManifests: SubmittedAppManifest[] = listSubmittedAppManifests(),
): SubmittedAppManifest[] {
  return listSubmittedAppValidationResults(
    maybeManifests,
  )
    .filter(
      (result) =>
        result.issues.length === 0 &&
        result.manifest.catalog.status === "catalog-ready",
    )
    .map((result) => result.manifest);
}

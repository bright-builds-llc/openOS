const BROWSER_SUPPORTED_PROTOCOLS = new Set([
  "http:",
  "https:",
]);

export type BrowserDestinationRenderMode =
  | "embedded"
  | "external-fallback";

export type BrowserDestinationSource =
  | "curated"
  | "direct";

export type BrowserDestination = {
  id: string;
  title: string;
  description: string;
  url: string;
  displayUrl: string;
  renderMode: BrowserDestinationRenderMode;
  source: BrowserDestinationSource;
};

export type BrowserDirectNavigationResult =
  | {
      status: "ready";
      destination: BrowserDestination;
      matchedConfigured: boolean;
    }
  | {
      status: "invalid";
      message: string;
    };

function createDestinationId(
  rawValue: string,
): string {
  const sanitizedValue = rawValue
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `direct-${sanitizedValue || "destination"}`;
}

function hasBrowserScheme(
  maybeValue: string,
): boolean {
  return /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(maybeValue);
}

function getBrowserBaseUrl(
  baseUrl: string,
): URL {
  return new URL(baseUrl);
}

function formatUrlLabel(
  maybeValue: string,
): string {
  return maybeValue
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((segment) => {
      const [firstCharacter, ...rest] = segment;

      if (firstCharacter === undefined) {
        return "";
      }

      return `${firstCharacter.toUpperCase()}${rest.join("").toLowerCase()}`;
    })
    .join(" ");
}

function getBrowserDisplayUrl(
  url: URL,
  baseUrl: string,
): string {
  const browserBaseUrl = getBrowserBaseUrl(baseUrl);

  if (url.origin === browserBaseUrl.origin) {
    const localPath = `${url.pathname}${url.search}${url.hash}`;

    return localPath === "" ? "/" : localPath;
  }

  return url.toString();
}

function getDirectDestinationTitle(
  url: URL,
  baseUrl: string,
): string {
  const browserBaseUrl = getBrowserBaseUrl(baseUrl);

  if (url.origin !== browserBaseUrl.origin) {
    return url.hostname.replace(/^www\./, "");
  }

  const pathSegments = url.pathname
    .split("/")
    .filter(Boolean);
  const maybeLeafSegment = pathSegments.at(-1);

  if (maybeLeafSegment === undefined) {
    return "openOS Home";
  }

  const cleanedLeafSegment = maybeLeafSegment.replace(
    /\.[^.]+$/,
    "",
  );

  return formatUrlLabel(cleanedLeafSegment);
}

function normalizeDestinationUrl(
  rawUrl: string,
  baseUrl: string,
): string {
  return new URL(rawUrl, baseUrl).toString();
}

function resolveBrowserAddress(
  rawInput: string,
  baseUrl: string,
):
  | {
      status: "ready";
      url: URL;
    }
  | {
      status: "invalid";
      message: string;
    } {
  const trimmedInput = rawInput.trim();

  if (trimmedInput === "") {
    return {
      status: "invalid",
      message: "Enter a URL or local openOS path.",
    };
  }

  let maybeCandidate = trimmedInput;

  if (trimmedInput.startsWith("//")) {
    maybeCandidate = `https:${trimmedInput}`;
  } else if (
    !trimmedInput.startsWith("/") &&
    !trimmedInput.startsWith(".") &&
    !hasBrowserScheme(trimmedInput)
  ) {
    maybeCandidate = `https://${trimmedInput}`;
  }

  let maybeUrl: URL;

  try {
    maybeUrl = new URL(maybeCandidate, baseUrl);
  } catch {
    return {
      status: "invalid",
      message:
        "Enter a valid URL like example.com or /browser-fixtures/direct-url.html.",
    };
  }

  if (
    !BROWSER_SUPPORTED_PROTOCOLS.has(maybeUrl.protocol)
  ) {
    return {
      status: "invalid",
      message:
        "Only http(s) URLs and local openOS paths work here for now.",
    };
  }

  return {
    status: "ready",
    url: maybeUrl,
  };
}

export const browserDestinations: BrowserDestination[] = [
  {
    id: "openos-guide",
    title: "openOS Guide",
    description: "Deterministic local page that is safe to embed.",
    url: "/browser-fixtures/embed-safe.html",
    displayUrl: "/browser-fixtures/embed-safe.html",
    renderMode: "embedded",
    source: "curated",
  },
  {
    id: "mdn-web-docs",
    title: "MDN Web Docs",
    description:
      "Known external destination used to demonstrate graceful fallback.",
    url: "https://developer.mozilla.org/",
    displayUrl: "https://developer.mozilla.org/",
    renderMode: "external-fallback",
    source: "curated",
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

export function getBrowserDestinationByUrl(
  rawUrl: string,
  baseUrl: string,
  maybeDestinations: BrowserDestination[] = browserDestinations,
): BrowserDestination | null {
  const normalizedUrl = normalizeDestinationUrl(
    rawUrl,
    baseUrl,
  );

  return (
    maybeDestinations.find((destination) => {
      return (
        normalizeDestinationUrl(
          destination.url,
          baseUrl,
        ) === normalizedUrl
      );
    }) ?? null
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
    (destination) =>
      destination.renderMode === "external-fallback",
  );
}

export function createDirectBrowserDestination(
  rawInput: string,
  options: {
    baseUrl: string;
    maybeDestinations?: BrowserDestination[];
  },
): BrowserDirectNavigationResult {
  const resolvedAddress = resolveBrowserAddress(
    rawInput,
    options.baseUrl,
  );

  if (resolvedAddress.status === "invalid") {
    return resolvedAddress;
  }

  const matchedDestination = getBrowserDestinationByUrl(
    resolvedAddress.url.toString(),
    options.baseUrl,
    options.maybeDestinations,
  );

  if (matchedDestination !== null) {
    return {
      status: "ready",
      destination: matchedDestination,
      matchedConfigured: true,
    };
  }

  const browserBaseUrl = getBrowserBaseUrl(
    options.baseUrl,
  );
  const renderMode =
    resolvedAddress.url.origin === browserBaseUrl.origin
      ? "embedded"
      : "external-fallback";

  return {
    status: "ready",
    matchedConfigured: false,
    destination: {
      id: createDestinationId(resolvedAddress.url.toString()),
      title: getDirectDestinationTitle(
        resolvedAddress.url,
        options.baseUrl,
      ),
      description:
        renderMode === "embedded"
          ? "Direct local page opened from the Browser address bar."
          : "Direct URL entered from the address bar. openOS keeps external fallback honest when embedding is not guaranteed.",
      url: resolvedAddress.url.toString(),
      displayUrl: getBrowserDisplayUrl(
        resolvedAddress.url,
        options.baseUrl,
      ),
      renderMode,
      source: "direct",
    },
  };
}

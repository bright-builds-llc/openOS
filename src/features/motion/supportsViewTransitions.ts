type DocumentWithViewTransitions = Document & {
  startViewTransition?: (updateCallback: () => void) => unknown;
};

export function supportsViewTransitions(
  doc: Document = document,
): boolean {
  return typeof (doc as DocumentWithViewTransitions).startViewTransition ===
    "function";
}

export function runWithOptionalViewTransition(
  update: () => void,
  doc: Document = document,
  shouldUseViewTransition = supportsViewTransitions(doc),
): void {
  if (!shouldUseViewTransition) {
    update();
    return;
  }

  (doc as DocumentWithViewTransitions).startViewTransition?.(update);
}

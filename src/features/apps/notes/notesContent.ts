export const NOTE_CONTENT_DOCUMENT_VERSION = 1;

type UnknownRecord = Record<string, unknown>;

export type NoteContentBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "heading"; text: string }
  | {
      kind: "checklistItem";
      text: string;
      checked: boolean;
    };

export type NoteContentBlockKind = NoteContentBlock["kind"];

export type NoteContentDocument = {
  version: typeof NOTE_CONTENT_DOCUMENT_VERSION;
  blocks: NoteContentBlock[];
};

export type NoteContentSelectionResult = {
  content: NoteContentDocument;
  selectedBlockIndex: number | null;
};

export function createEmptyNoteContent(): NoteContentDocument {
  return {
    version: NOTE_CONTENT_DOCUMENT_VERSION,
    blocks: [],
  };
}

export function createNoteContentFromPlainText(
  body: string,
): NoteContentDocument {
  if (body === "") {
    return createEmptyNoteContent();
  }

  return {
    version: NOTE_CONTENT_DOCUMENT_VERSION,
    blocks: [{ kind: "paragraph", text: body }],
  };
}

export function createDefaultEditableNoteContent(): NoteContentDocument {
  return {
    version: NOTE_CONTENT_DOCUMENT_VERSION,
    blocks: [{ kind: "paragraph", text: "" }],
  };
}

export function appendNoteContentBlock(
  content: NoteContentDocument,
  kind: NoteContentBlockKind,
): NoteContentSelectionResult {
  const block = createEmptyNoteContentBlock(kind);

  return {
    content: {
      ...content,
      blocks: [...content.blocks, block],
    },
    selectedBlockIndex: content.blocks.length,
  };
}

export function updateNoteContentBlockText(
  content: NoteContentDocument,
  blockIndex: number,
  text: string,
): NoteContentDocument {
  if (!isValidBlockIndex(content, blockIndex)) {
    return content;
  }

  return {
    ...content,
    blocks: content.blocks.map((block, index) =>
      index === blockIndex ? { ...block, text } : block,
    ),
  };
}

export function toggleChecklistItemBlock(
  content: NoteContentDocument,
  blockIndex: number,
): NoteContentDocument {
  if (!isValidBlockIndex(content, blockIndex)) {
    return content;
  }

  const block = content.blocks[blockIndex];

  if (block.kind !== "checklistItem") {
    return content;
  }

  return {
    ...content,
    blocks: content.blocks.map((currentBlock, index) =>
      index === blockIndex
        ? { ...block, checked: !block.checked }
        : currentBlock,
    ),
  };
}

export function removeNoteContentBlock(
  content: NoteContentDocument,
  blockIndex: number,
): NoteContentSelectionResult {
  if (!isValidBlockIndex(content, blockIndex)) {
    return {
      content,
      selectedBlockIndex: null,
    };
  }

  const blocks = content.blocks.filter(
    (_block, index) => index !== blockIndex,
  );

  return {
    content: {
      ...content,
      blocks,
    },
    selectedBlockIndex:
      blocks.length === 0
        ? null
        : Math.min(blockIndex, blocks.length - 1),
  };
}

export function getNoteContentText(
  content: NoteContentDocument,
): string {
  return content.blocks.map((block) => block.text).join("\n");
}

export function parseNoteContentDocument(
  maybeValue: unknown,
): NoteContentDocument | null {
  if (!isRecord(maybeValue)) {
    return null;
  }

  if (
    !hasOnlyKeys(maybeValue, ["version", "blocks"]) ||
    maybeValue.version !== NOTE_CONTENT_DOCUMENT_VERSION ||
    !Array.isArray(maybeValue.blocks)
  ) {
    return null;
  }

  const blocks: NoteContentBlock[] = [];

  for (const maybeBlock of maybeValue.blocks) {
    const parsedBlock = parseNoteContentBlock(maybeBlock);

    if (parsedBlock === null) {
      return null;
    }

    blocks.push(parsedBlock);
  }

  return {
    version: NOTE_CONTENT_DOCUMENT_VERSION,
    blocks,
  };
}

function parseNoteContentBlock(
  maybeValue: unknown,
): NoteContentBlock | null {
  if (!isRecord(maybeValue)) {
    return null;
  }

  if (maybeValue.kind === "paragraph") {
    return parseTextBlock(maybeValue, "paragraph");
  }

  if (maybeValue.kind === "heading") {
    return parseTextBlock(maybeValue, "heading");
  }

  if (maybeValue.kind === "checklistItem") {
    if (
      !hasOnlyKeys(maybeValue, ["kind", "text", "checked"]) ||
      typeof maybeValue.text !== "string" ||
      typeof maybeValue.checked !== "boolean"
    ) {
      return null;
    }

    return {
      kind: "checklistItem",
      text: maybeValue.text,
      checked: maybeValue.checked,
    };
  }

  return null;
}

function parseTextBlock(
  maybeValue: UnknownRecord,
  kind: "paragraph" | "heading",
): NoteContentBlock | null {
  if (
    !hasOnlyKeys(maybeValue, ["kind", "text"]) ||
    typeof maybeValue.text !== "string"
  ) {
    return null;
  }

  return {
    kind,
    text: maybeValue.text,
  };
}

function createEmptyNoteContentBlock(
  kind: NoteContentBlockKind,
): NoteContentBlock {
  if (kind === "checklistItem") {
    return {
      kind,
      text: "",
      checked: false,
    };
  }

  return {
    kind,
    text: "",
  };
}

function isValidBlockIndex(
  content: NoteContentDocument,
  blockIndex: number,
): boolean {
  return (
    Number.isInteger(blockIndex) &&
    blockIndex >= 0 &&
    blockIndex < content.blocks.length
  );
}

function isRecord(maybeValue: unknown): maybeValue is UnknownRecord {
  return (
    typeof maybeValue === "object" &&
    maybeValue !== null &&
    !Array.isArray(maybeValue)
  );
}

function hasOnlyKeys(
  value: UnknownRecord,
  allowedKeys: string[],
): boolean {
  const allowedKeySet = new Set(allowedKeys);

  return Object.keys(value).every((key) =>
    allowedKeySet.has(key),
  );
}

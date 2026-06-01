import { describe, expect, it } from "vitest";
import {
  NOTE_CONTENT_DOCUMENT_VERSION,
  appendNoteContentBlock,
  createDefaultEditableNoteContent,
  createNoteContentFromPlainText,
  getNoteContentText,
  parseNoteContentDocument,
  removeNoteContentBlock,
  toggleChecklistItemBlock,
  updateNoteContentBlockText,
  type NoteContentDocument,
} from "./notesContent";

describe("notesContent", () => {
  it("converts plain text into one paragraph block", () => {
    // Arrange
    const body = "Line one\nLine two";

    // Act
    const result = createNoteContentFromPlainText(body);

    // Assert
    expect(result).toEqual({
      version: NOTE_CONTENT_DOCUMENT_VERSION,
      blocks: [
        { kind: "paragraph", text: "Line one\nLine two" },
      ],
    });
  });

  it("creates an empty document for an empty body", () => {
    // Arrange
    const body = "";

    // Act
    const result = createNoteContentFromPlainText(body);

    // Assert
    expect(result).toEqual({
      version: NOTE_CONTENT_DOCUMENT_VERSION,
      blocks: [],
    });
  });

  it("extracts text from mixed supported block kinds", () => {
    // Arrange
    const content: NoteContentDocument = {
      version: NOTE_CONTENT_DOCUMENT_VERSION,
      blocks: [
        { kind: "heading", text: "Trip plan" },
        { kind: "paragraph", text: "Book train tickets" },
        {
          kind: "checklistItem",
          text: "Pack charger",
          checked: false,
        },
      ],
    };

    // Act
    const result = getNoteContentText(content);

    // Assert
    expect(result).toBe(
      "Trip plan\nBook train tickets\nPack charger",
    );
  });

  it("rejects unsupported document versions", () => {
    // Arrange
    const maybeContent = {
      version: 2,
      blocks: [],
    };

    // Act
    const result = parseNoteContentDocument(maybeContent);

    // Assert
    expect(result).toBeNull();
  });

  it("rejects invalid block kinds", () => {
    // Arrange
    const maybeContent = {
      version: NOTE_CONTENT_DOCUMENT_VERSION,
      blocks: [{ kind: "quote", text: "Unsupported" }],
    };

    // Act
    const result = parseNoteContentDocument(maybeContent);

    // Assert
    expect(result).toBeNull();
  });

  it("rejects checklist items without checked state", () => {
    // Arrange
    const maybeContent = {
      version: NOTE_CONTENT_DOCUMENT_VERSION,
      blocks: [{ kind: "checklistItem", text: "Buy rice" }],
    };

    // Act
    const result = parseNoteContentDocument(maybeContent);

    // Assert
    expect(result).toBeNull();
  });

  it("creates default editable content with one empty paragraph", () => {
    // Act
    const result = createDefaultEditableNoteContent();

    // Assert
    expect(result).toEqual({
      version: NOTE_CONTENT_DOCUMENT_VERSION,
      blocks: [{ kind: "paragraph", text: "" }],
    });
  });

  it("appends a heading block and selects it", () => {
    // Arrange
    const content = createDefaultEditableNoteContent();

    // Act
    const result = appendNoteContentBlock(content, "heading");

    // Assert
    expect(result).toEqual({
      content: {
        version: NOTE_CONTENT_DOCUMENT_VERSION,
        blocks: [
          { kind: "paragraph", text: "" },
          { kind: "heading", text: "" },
        ],
      },
      selectedBlockIndex: 1,
    });
    expect(content.blocks).toEqual([{ kind: "paragraph", text: "" }]);
  });

  it("appends an unchecked checklist item block and selects it", () => {
    // Arrange
    const content = createDefaultEditableNoteContent();

    // Act
    const result = appendNoteContentBlock(content, "checklistItem");

    // Assert
    expect(result).toEqual({
      content: {
        version: NOTE_CONTENT_DOCUMENT_VERSION,
        blocks: [
          { kind: "paragraph", text: "" },
          { kind: "checklistItem", text: "", checked: false },
        ],
      },
      selectedBlockIndex: 1,
    });
    expect(content.blocks).toEqual([{ kind: "paragraph", text: "" }]);
  });

  it("updates block text without changing other blocks", () => {
    // Arrange
    const content: NoteContentDocument = {
      version: NOTE_CONTENT_DOCUMENT_VERSION,
      blocks: [
        { kind: "paragraph", text: "Intro" },
        { kind: "heading", text: "Plan" },
        {
          kind: "checklistItem",
          text: "Pack charger",
          checked: false,
        },
      ],
    };

    // Act
    const result = updateNoteContentBlockText(
      content,
      2,
      "Pack adapter",
    );

    // Assert
    expect(result).toEqual({
      version: NOTE_CONTENT_DOCUMENT_VERSION,
      blocks: [
        { kind: "paragraph", text: "Intro" },
        { kind: "heading", text: "Plan" },
        {
          kind: "checklistItem",
          text: "Pack adapter",
          checked: false,
        },
      ],
    });
    expect(content.blocks[2]).toEqual({
      kind: "checklistItem",
      text: "Pack charger",
      checked: false,
    });
  });

  it("returns original content when updating an invalid block index", () => {
    // Arrange
    const content = createDefaultEditableNoteContent();

    // Act
    const result = updateNoteContentBlockText(content, 3, "Ignored");

    // Assert
    expect(result).toBe(content);
  });

  it("toggles only checklist item checked state", () => {
    // Arrange
    const content: NoteContentDocument = {
      version: NOTE_CONTENT_DOCUMENT_VERSION,
      blocks: [
        { kind: "paragraph", text: "Intro" },
        {
          kind: "checklistItem",
          text: "Pack charger",
          checked: false,
        },
      ],
    };

    // Act
    const result = toggleChecklistItemBlock(content, 1);

    // Assert
    expect(result).toEqual({
      version: NOTE_CONTENT_DOCUMENT_VERSION,
      blocks: [
        { kind: "paragraph", text: "Intro" },
        {
          kind: "checklistItem",
          text: "Pack charger",
          checked: true,
        },
      ],
    });
    expect(content.blocks[1]).toEqual({
      kind: "checklistItem",
      text: "Pack charger",
      checked: false,
    });
  });

  it("returns original content when toggling a non-checklist block", () => {
    // Arrange
    const content = createDefaultEditableNoteContent();

    // Act
    const result = toggleChecklistItemBlock(content, 0);

    // Assert
    expect(result).toBe(content);
  });

  it("returns original content when toggling an invalid block index", () => {
    // Arrange
    const content = createDefaultEditableNoteContent();

    // Act
    const result = toggleChecklistItemBlock(content, -1);

    // Assert
    expect(result).toBe(content);
  });

  it("removes a block and selects the nearest remaining block", () => {
    // Arrange
    const content: NoteContentDocument = {
      version: NOTE_CONTENT_DOCUMENT_VERSION,
      blocks: [
        { kind: "paragraph", text: "Intro" },
        { kind: "heading", text: "Plan" },
        {
          kind: "checklistItem",
          text: "Pack charger",
          checked: false,
        },
      ],
    };

    // Act
    const result = removeNoteContentBlock(content, 2);

    // Assert
    expect(result).toEqual({
      content: {
        version: NOTE_CONTENT_DOCUMENT_VERSION,
        blocks: [
          { kind: "paragraph", text: "Intro" },
          { kind: "heading", text: "Plan" },
        ],
      },
      selectedBlockIndex: 1,
    });
    expect(content.blocks).toHaveLength(3);
  });

  it("removes the only block and clears selection", () => {
    // Arrange
    const content = createDefaultEditableNoteContent();

    // Act
    const result = removeNoteContentBlock(content, 0);

    // Assert
    expect(result).toEqual({
      content: {
        version: NOTE_CONTENT_DOCUMENT_VERSION,
        blocks: [],
      },
      selectedBlockIndex: null,
    });
  });

  it("returns original content and null selection when removing an invalid block index", () => {
    // Arrange
    const content = createDefaultEditableNoteContent();

    // Act
    const result = removeNoteContentBlock(content, 4);

    // Assert
    expect(result).toEqual({
      content,
      selectedBlockIndex: null,
    });
  });
});

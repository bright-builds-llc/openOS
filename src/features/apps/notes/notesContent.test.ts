import { describe, expect, it } from "vitest";
import {
  NOTE_CONTENT_DOCUMENT_VERSION,
  createNoteContentFromPlainText,
  getNoteContentText,
  parseNoteContentDocument,
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
});

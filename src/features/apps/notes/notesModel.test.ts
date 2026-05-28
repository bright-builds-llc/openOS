import { describe, expect, it } from "vitest";
import {
  NOTE_CONTENT_DOCUMENT_VERSION,
  createEmptyNoteContent,
  createNoteContentFromPlainText,
} from "./notesContent";
import {
  DEFAULT_NOTES_FOLDER_ID,
  createDefaultNotesFolder,
  filterNotes,
  getNoteBodyText,
  getNotePreview,
  getNoteTitle,
  sortNoteFolders,
  type Note,
} from "./notesModel";

const sampleNotes: Note[] = [
  {
    id: "note-1",
    title: "Pasta plan",
    content: createNoteContentFromPlainText(
      "Tomatoes and basil for dinner",
    ),
    folderId: DEFAULT_NOTES_FOLDER_ID,
    createdAt: "2026-04-11T10:00:00.000Z",
    updatedAt: "2026-04-11T10:00:00.000Z",
  },
  {
    id: "note-2",
    title: "Standup",
    content: createNoteContentFromPlainText(
      "Share launch progress with the team",
    ),
    folderId: "folder-work",
    createdAt: "2026-04-11T11:00:00.000Z",
    updatedAt: "2026-04-11T11:00:00.000Z",
  },
];

describe("notesModel", () => {
  it("filters notes by title and structured content text", () => {
    // Arrange
    const query = "basil dinner";

    // Act
    const result = filterNotes(sampleNotes, {
      query,
      maybeFolderId: null,
    });

    // Assert
    expect(result.map((note) => note.id)).toEqual([
      "note-1",
    ]);
  });

  it("searches heading and checklist item text", () => {
    // Arrange
    const note: Note = {
      id: "note-3",
      title: "Launch",
      content: {
        version: NOTE_CONTENT_DOCUMENT_VERSION,
        blocks: [
          { kind: "heading", text: "Release plan" },
          {
            kind: "checklistItem",
            text: "Coordinate QA",
            checked: false,
          },
        ],
      },
      folderId: DEFAULT_NOTES_FOLDER_ID,
      createdAt: "2026-04-11T12:00:00.000Z",
      updatedAt: "2026-04-11T12:00:00.000Z",
    };

    // Act
    const result = filterNotes([note], {
      query: "release qa",
      maybeFolderId: null,
    });

    // Assert
    expect(result.map((filteredNote) => filteredNote.id)).toEqual([
      "note-3",
    ]);
  });

  it("requires every query term to match title or content", () => {
    // Arrange
    const query = "pasta roadmap";

    // Act
    const result = filterNotes(sampleNotes, {
      query,
      maybeFolderId: null,
    });

    // Assert
    expect(result).toEqual([]);
  });

  it("applies folder filtering before returning notes", () => {
    // Arrange
    const maybeFolderId = "folder-work";

    // Act
    const result = filterNotes(sampleNotes, {
      query: "",
      maybeFolderId,
    });

    // Assert
    expect(result.map((note) => note.id)).toEqual([
      "note-2",
    ]);
  });

  it("keeps the default folder first and sorts others by name", () => {
    // Arrange
    const folders = [
      {
        id: "folder-z",
        name: "Zebra",
        createdAt: "2026-04-11T11:00:00.000Z",
        updatedAt: "2026-04-11T11:00:00.000Z",
      },
      {
        id: "folder-a",
        name: "Alpha",
        createdAt: "2026-04-11T12:00:00.000Z",
        updatedAt: "2026-04-11T12:00:00.000Z",
      },
      createDefaultNotesFolder(),
    ];

    // Act
    const result = sortNoteFolders(folders);

    // Assert
    expect(result.map((folder) => folder.id)).toEqual([
      DEFAULT_NOTES_FOLDER_ID,
      "folder-a",
      "folder-z",
    ]);
  });

  it("formats note titles and previews for list rendering", () => {
    // Arrange
    const untitledNote: Note = {
      id: "note-3",
      title: "   ",
      content: createNoteContentFromPlainText(
        "  \nDeep work block\n  ",
      ),
      folderId: DEFAULT_NOTES_FOLDER_ID,
      createdAt: "2026-04-11T11:30:00.000Z",
      updatedAt: "2026-04-11T11:30:00.000Z",
    };

    // Act
    const title = getNoteTitle(untitledNote);
    const preview = getNotePreview(untitledNote);

    // Assert
    expect(title).toBe("Untitled");
    expect(preview).toBe("Deep work block");
  });

  it("uses heading and checklist text for previews", () => {
    // Arrange
    const note: Note = {
      id: "note-4",
      title: "Launch",
      content: {
        version: NOTE_CONTENT_DOCUMENT_VERSION,
        blocks: [
          { kind: "heading", text: "Launch Plan" },
          {
            kind: "checklistItem",
            text: "Confirm copy",
            checked: true,
          },
        ],
      },
      folderId: DEFAULT_NOTES_FOLDER_ID,
      createdAt: "2026-04-11T12:30:00.000Z",
      updatedAt: "2026-04-11T12:30:00.000Z",
    };

    // Act
    const result = getNotePreview(note);

    // Assert
    expect(result).toBe("Launch Plan Confirm copy");
  });

  it("returns the empty fallback for blank structured content", () => {
    // Arrange
    const note: Note = {
      id: "note-5",
      title: "Empty",
      content: createEmptyNoteContent(),
      folderId: DEFAULT_NOTES_FOLDER_ID,
      createdAt: "2026-04-11T13:00:00.000Z",
      updatedAt: "2026-04-11T13:00:00.000Z",
    };

    // Act
    const result = getNotePreview(note);

    // Assert
    expect(result).toBe("Empty note");
  });

  it("returns structured content text for the body adapter", () => {
    // Arrange
    const note: Note = {
      id: "note-6",
      title: "Adapter",
      content: {
        version: NOTE_CONTENT_DOCUMENT_VERSION,
        blocks: [
          { kind: "heading", text: "Packing" },
          { kind: "paragraph", text: "Bring passport" },
        ],
      },
      folderId: DEFAULT_NOTES_FOLDER_ID,
      createdAt: "2026-04-11T13:30:00.000Z",
      updatedAt: "2026-04-11T13:30:00.000Z",
    };

    // Act
    const result = getNoteBodyText(note);

    // Assert
    expect(result).toBe("Packing\nBring passport");
  });
});

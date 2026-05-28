import {
  getNoteContentText,
  type NoteContentDocument,
} from "./notesContent";

export const DEFAULT_NOTES_FOLDER_ID = "notes-folder-default";
export const DEFAULT_NOTES_FOLDER_NAME = "Notes";

const DEFAULT_NOTES_FOLDER_CREATED_AT =
  "1970-01-01T00:00:00.000Z";
const NOTE_PREVIEW_LENGTH = 72;

export type NoteFolder = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type Note = {
  id: string;
  title: string;
  content: NoteContentDocument;
  folderId: string;
  createdAt: string;
  updatedAt: string;
};

export type NoteInput = {
  title: string;
  body: string;
  folderId: string;
};

export function createDefaultNotesFolder(): NoteFolder {
  return {
    id: DEFAULT_NOTES_FOLDER_ID,
    name: DEFAULT_NOTES_FOLDER_NAME,
    createdAt: DEFAULT_NOTES_FOLDER_CREATED_AT,
    updatedAt: DEFAULT_NOTES_FOLDER_CREATED_AT,
  };
}

export function sortNoteFolders(
  maybeFolders: NoteFolder[],
): NoteFolder[] {
  return [...maybeFolders].sort((left, right) => {
    const leftIsDefault =
      left.id === DEFAULT_NOTES_FOLDER_ID;
    const rightIsDefault =
      right.id === DEFAULT_NOTES_FOLDER_ID;

    if (leftIsDefault !== rightIsDefault) {
      return leftIsDefault ? -1 : 1;
    }

    return left.name.localeCompare(right.name, undefined, {
      sensitivity: "base",
    });
  });
}

export function sortNotesByUpdatedAt(
  maybeNotes: Note[],
): Note[] {
  return [...maybeNotes].sort((left, right) =>
    right.updatedAt.localeCompare(left.updatedAt),
  );
}

export function getNoteTitle(note: Note): string {
  return note.title.trim() === "" ? "Untitled" : note.title;
}

export function getNoteBodyText(note: Note): string {
  return getNoteContentText(note.content);
}

export function getNotePreview(note: Note): string {
  const collapsedContent = getNoteContentText(note.content)
    .replace(/\s+/g, " ")
    .trim();

  if (collapsedContent === "") {
    return "Empty note";
  }

  return collapsedContent.slice(0, NOTE_PREVIEW_LENGTH);
}

export function filterNotes(
  maybeNotes: Note[],
  options: {
    query: string;
    maybeFolderId: string | null;
  },
): Note[] {
  const queryTerms = options.query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  return maybeNotes.filter((note) => {
    if (
      options.maybeFolderId !== null &&
      note.folderId !== options.maybeFolderId
    ) {
      return false;
    }

    if (queryTerms.length === 0) {
      return true;
    }

    const contentText = getNoteContentText(note.content);
    const haystack = `${note.title}\n${contentText}`.toLowerCase();

    return queryTerms.every((term) =>
      haystack.includes(term),
    );
  });
}

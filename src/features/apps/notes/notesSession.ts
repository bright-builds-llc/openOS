import {
  readAppSessionSnapshot,
  writeAppSessionSnapshot,
  type AppSessionReadResult,
  type AppSessionStorageLike,
  type AppSessionWriteResult,
} from "../../platform/appSessionStorage";
import {
  filterNotes,
  type Note,
  type NoteFolder,
} from "./notesModel";

export const NOTES_SESSION_VERSION = 1;
export const NOTES_ALL_FOLDER_ID = "all";

type UnknownRecord = Record<string, unknown>;

export type NotesSession = {
  selectedFolderId: string;
  selectedNoteId: string | null;
  searchQuery: string;
  selectedBlockIndex: number | null;
};

type NotesSessionResolutionState = {
  folders: NoteFolder[];
  notes: Note[];
};

export function createDefaultNotesSession(): NotesSession {
  return {
    selectedFolderId: NOTES_ALL_FOLDER_ID,
    selectedNoteId: null,
    searchQuery: "",
    selectedBlockIndex: null,
  };
}

export function parseNotesSession(
  maybeSession: unknown,
): NotesSession | null {
  if (
    !isRecord(maybeSession) ||
    !hasOnlyKeys(maybeSession, [
      "selectedFolderId",
      "selectedNoteId",
      "searchQuery",
      "selectedBlockIndex",
    ]) ||
    typeof maybeSession.selectedFolderId !== "string" ||
    !isStringOrNull(maybeSession.selectedNoteId) ||
    typeof maybeSession.searchQuery !== "string" ||
    !isNonNegativeIntegerOrNull(
      maybeSession.selectedBlockIndex,
    )
  ) {
    return null;
  }

  return {
    selectedFolderId: maybeSession.selectedFolderId,
    selectedNoteId: maybeSession.selectedNoteId,
    searchQuery: maybeSession.searchQuery,
    selectedBlockIndex: maybeSession.selectedBlockIndex,
  };
}

export function readNotesSession(
  storage: AppSessionStorageLike,
  namespace: string,
): AppSessionReadResult<NotesSession> {
  return readAppSessionSnapshot(storage, namespace, {
    version: NOTES_SESSION_VERSION,
    defaultSession: createDefaultNotesSession(),
    parseSession: parseNotesSession,
  });
}

export function writeNotesSession(
  storage: AppSessionStorageLike,
  namespace: string,
  session: NotesSession,
): AppSessionWriteResult {
  return writeAppSessionSnapshot(storage, namespace, {
    version: NOTES_SESSION_VERSION,
    session: {
      selectedFolderId: session.selectedFolderId,
      selectedNoteId: session.selectedNoteId,
      searchQuery: session.searchQuery,
      selectedBlockIndex: session.selectedBlockIndex,
    },
  });
}

export function resolveNotesSession(
  session: NotesSession,
  state: NotesSessionResolutionState,
): NotesSession {
  const selectedFolderId = resolveFolderId(
    session.selectedFolderId,
    state.folders,
  );
  const visibleNotes = filterNotes(state.notes, {
    query: session.searchQuery,
    maybeFolderId:
      selectedFolderId === NOTES_ALL_FOLDER_ID
        ? null
        : selectedFolderId,
  });
  const selectedNote = resolveSelectedNote(
    session.selectedNoteId,
    visibleNotes,
  );

  return {
    selectedFolderId,
    selectedNoteId: selectedNote?.id ?? null,
    searchQuery: session.searchQuery,
    selectedBlockIndex: resolveSelectedBlockIndex(
      selectedNote,
      session.selectedBlockIndex,
    ),
  };
}

function resolveFolderId(
  selectedFolderId: string,
  folders: NoteFolder[],
): string {
  if (selectedFolderId === NOTES_ALL_FOLDER_ID) {
    return selectedFolderId;
  }

  return folders.some((folder) => folder.id === selectedFolderId)
    ? selectedFolderId
    : NOTES_ALL_FOLDER_ID;
}

function resolveSelectedNote(
  selectedNoteId: string | null,
  visibleNotes: Note[],
): Note | null {
  const maybeSelectedNote =
    selectedNoteId === null
      ? null
      : visibleNotes.find((note) => note.id === selectedNoteId) ??
        null;

  return maybeSelectedNote ?? visibleNotes[0] ?? null;
}

function resolveSelectedBlockIndex(
  selectedNote: Note | null,
  selectedBlockIndex: number | null,
): number | null {
  if (
    selectedNote === null ||
    selectedBlockIndex === null ||
    selectedNote.content.blocks.length === 0
  ) {
    return null;
  }

  return Math.min(
    selectedBlockIndex,
    selectedNote.content.blocks.length - 1,
  );
}

function isRecord(
  maybeValue: unknown,
): maybeValue is UnknownRecord {
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

  return (
    Object.keys(value).length === allowedKeys.length &&
    Object.keys(value).every((key) => allowedKeySet.has(key))
  );
}

function isStringOrNull(
  maybeValue: unknown,
): maybeValue is string | null {
  return maybeValue === null || typeof maybeValue === "string";
}

function isNonNegativeIntegerOrNull(
  maybeValue: unknown,
): maybeValue is number | null {
  return (
    maybeValue === null ||
    (typeof maybeValue === "number" &&
      Number.isInteger(maybeValue) &&
      maybeValue >= 0)
  );
}

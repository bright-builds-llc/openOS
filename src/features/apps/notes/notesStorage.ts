import { createAppStorageKey } from "../../platform/appStorage";
import {
  createNoteContentFromPlainText,
  parseNoteContentDocument,
  type NoteContentDocument,
} from "./notesContent";
import type {
  Note,
  NoteFolder,
  NoteInput,
} from "./notesModel";
import {
  DEFAULT_NOTES_FOLDER_ID,
  DEFAULT_NOTES_FOLDER_NAME,
  createDefaultNotesFolder,
  sortNoteFolders,
  sortNotesByUpdatedAt,
} from "./notesModel";

type StorageLike = Pick<
  Storage,
  "getItem" | "removeItem" | "setItem"
>;

const NOTES_STORAGE_KEY = "notes";
const NOTES_STORAGE_VERSION = 3;

type NotesSnapshot = {
  version: typeof NOTES_STORAGE_VERSION;
  folders: NoteFolder[];
  notes: Note[];
};

export type StructuredNoteInput = {
  title: string;
  content: NoteContentDocument;
  folderId: string;
};

function getNotesStorageKey(
  namespace: string,
): string {
  return createAppStorageKey(namespace, NOTES_STORAGE_KEY);
}

function isRecord(
  maybeValue: unknown,
): maybeValue is Record<string, unknown> {
  return (
    typeof maybeValue === "object" &&
    maybeValue !== null &&
    !Array.isArray(maybeValue)
  );
}

function parseFolder(
  maybeValue: unknown,
): NoteFolder | null {
  if (
    !isRecord(maybeValue) ||
    typeof maybeValue.id !== "string" ||
    typeof maybeValue.name !== "string" ||
    typeof maybeValue.createdAt !== "string" ||
    typeof maybeValue.updatedAt !== "string"
  ) {
    return null;
  }

  return {
    id: maybeValue.id,
    name: maybeValue.name,
    createdAt: maybeValue.createdAt,
    updatedAt: maybeValue.updatedAt,
  };
}

function parseStoredNoteV3(
  maybeValue: unknown,
): Note | null {
  if (
    !isRecord(maybeValue) ||
    typeof maybeValue.id !== "string" ||
    typeof maybeValue.title !== "string" ||
    typeof maybeValue.createdAt !== "string" ||
    typeof maybeValue.updatedAt !== "string"
  ) {
    return null;
  }

  const maybeContent = parseNoteContentDocument(
    maybeValue.content,
  );

  if (maybeContent === null) {
    return null;
  }

  return {
    id: maybeValue.id,
    title: maybeValue.title,
    content: maybeContent,
    folderId:
      typeof maybeValue.folderId === "string"
        ? maybeValue.folderId
        : DEFAULT_NOTES_FOLDER_ID,
    createdAt: maybeValue.createdAt,
    updatedAt: maybeValue.updatedAt,
  };
}

function parseStoredNoteV2(
  maybeValue: unknown,
): Note | null {
  if (
    !isRecord(maybeValue) ||
    typeof maybeValue.id !== "string" ||
    typeof maybeValue.title !== "string" ||
    typeof maybeValue.body !== "string" ||
    typeof maybeValue.createdAt !== "string" ||
    typeof maybeValue.updatedAt !== "string"
  ) {
    return null;
  }

  return {
    id: maybeValue.id,
    title: maybeValue.title,
    content: createNoteContentFromPlainText(maybeValue.body),
    folderId:
      typeof maybeValue.folderId === "string"
        ? maybeValue.folderId
        : DEFAULT_NOTES_FOLDER_ID,
    createdAt: maybeValue.createdAt,
    updatedAt: maybeValue.updatedAt,
  };
}

function createEmptySnapshot(): NotesSnapshot {
  return normalizeSnapshot({
    version: NOTES_STORAGE_VERSION,
    folders: [],
    notes: [],
  });
}

function normalizeSnapshot(
  maybeSnapshot: NotesSnapshot,
): NotesSnapshot {
  const folderIds = new Set<string>();
  const normalizedFolders = maybeSnapshot.folders.flatMap(
    (folder) => {
      if (folderIds.has(folder.id)) {
        return [];
      }

      folderIds.add(folder.id);
      return [folder];
    },
  );

  if (!folderIds.has(DEFAULT_NOTES_FOLDER_ID)) {
    normalizedFolders.push(createDefaultNotesFolder());
    folderIds.add(DEFAULT_NOTES_FOLDER_ID);
  }

  const noteIds = new Set<string>();
  const normalizedNotes = maybeSnapshot.notes.flatMap(
    (note) => {
      if (noteIds.has(note.id)) {
        return [];
      }

      noteIds.add(note.id);
      return [
        {
          ...note,
          folderId: folderIds.has(note.folderId)
            ? note.folderId
            : DEFAULT_NOTES_FOLDER_ID,
        },
      ];
    },
  );

  return {
    version: NOTES_STORAGE_VERSION,
    folders: sortNoteFolders(normalizedFolders),
    notes: sortNotesByUpdatedAt(normalizedNotes),
  };
}

function parseLegacySnapshot(
  maybeValue: unknown[],
): NotesSnapshot {
  return normalizeSnapshot({
    version: NOTES_STORAGE_VERSION,
    folders: [createDefaultNotesFolder()],
    notes: maybeValue.flatMap((item) => {
      const maybeNote = parseStoredNoteV2(item);

      if (maybeNote === null) {
        return [];
      }

      return [
        {
          ...maybeNote,
          folderId: DEFAULT_NOTES_FOLDER_ID,
        },
      ];
    }),
  });
}

function parseVersionedSnapshot(
  maybeParsed: Record<string, unknown>,
  parseStoredNote: (maybeValue: unknown) => Note | null,
): NotesSnapshot {
  if (
    !Array.isArray(maybeParsed.folders) ||
    !Array.isArray(maybeParsed.notes)
  ) {
    return createEmptySnapshot();
  }

  return normalizeSnapshot({
    version: NOTES_STORAGE_VERSION,
    folders: maybeParsed.folders.flatMap((item) => {
      const maybeFolder = parseFolder(item);
      return maybeFolder === null ? [] : [maybeFolder];
    }),
    notes: maybeParsed.notes.flatMap((item) => {
      const maybeNote = parseStoredNote(item);
      return maybeNote === null ? [] : [maybeNote];
    }),
  });
}

function parseSnapshot(
  maybeValue: string | null,
): NotesSnapshot {
  if (maybeValue === null) {
    return createEmptySnapshot();
  }

  try {
    const maybeParsed = JSON.parse(maybeValue);

    if (Array.isArray(maybeParsed)) {
      return parseLegacySnapshot(maybeParsed);
    }

    if (
      !isRecord(maybeParsed)
    ) {
      return createEmptySnapshot();
    }

    if (maybeParsed.version === NOTES_STORAGE_VERSION) {
      return parseVersionedSnapshot(
        maybeParsed,
        parseStoredNoteV3,
      );
    }

    if (maybeParsed.version === 2) {
      return parseVersionedSnapshot(
        maybeParsed,
        parseStoredNoteV2,
      );
    }

    return createEmptySnapshot();
  } catch {
    return createEmptySnapshot();
  }
}

function readSnapshot(
  storage: StorageLike,
  namespace: string,
): NotesSnapshot {
  return parseSnapshot(
    storage.getItem(getNotesStorageKey(namespace)),
  );
}

function writeSnapshot(
  storage: StorageLike,
  namespace: string,
  maybeSnapshot: NotesSnapshot,
): void {
  const snapshot = normalizeSnapshot(maybeSnapshot);
  const storageKey = getNotesStorageKey(namespace);
  const hasOnlyDefaultFolder =
    snapshot.folders.length === 1 &&
    snapshot.folders[0]?.id === DEFAULT_NOTES_FOLDER_ID &&
    snapshot.folders[0]?.name === DEFAULT_NOTES_FOLDER_NAME;

  if (
    snapshot.notes.length === 0 &&
    hasOnlyDefaultFolder
  ) {
    storage.removeItem(storageKey);
    return;
  }

  storage.setItem(storageKey, JSON.stringify(snapshot));
}

function resolveFolderId(
  maybeFolders: NoteFolder[],
  folderId: string,
): string {
  return maybeFolders.some((folder) => folder.id === folderId)
    ? folderId
    : DEFAULT_NOTES_FOLDER_ID;
}

export function listStoredFolders(
  storage: StorageLike,
  namespace: string,
): NoteFolder[] {
  return readSnapshot(storage, namespace).folders;
}

export function listStoredNotes(
  storage: StorageLike,
  namespace: string,
): Note[] {
  return readSnapshot(storage, namespace).notes;
}

export function getStoredNote(
  storage: StorageLike,
  namespace: string,
  noteId: string,
): Note | null {
  return (
    listStoredNotes(storage, namespace).find(
      (note) => note.id === noteId,
    ) ?? null
  );
}

export function createStoredNote(
  storage: StorageLike,
  namespace: string,
  input: NoteInput,
  maybeOptions?: {
    createId?: () => string;
    now?: () => string;
  },
): Note {
  const snapshot = readSnapshot(storage, namespace);
  const createId =
    maybeOptions?.createId ??
    (() => crypto.randomUUID());
  const now =
    maybeOptions?.now ??
    (() => new Date().toISOString());
  const timestamp = now();
  const nextNote: Note = {
    id: createId(),
    title: input.title,
    content: createNoteContentFromPlainText(input.body),
    folderId: resolveFolderId(
      snapshot.folders,
      input.folderId,
    ),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  writeSnapshot(storage, namespace, {
    ...snapshot,
    notes: [nextNote, ...snapshot.notes],
  });

  return nextNote;
}

export function createStoredNoteFromContent(
  storage: StorageLike,
  namespace: string,
  input: StructuredNoteInput,
  maybeOptions?: {
    createId?: () => string;
    now?: () => string;
  },
): Note {
  const snapshot = readSnapshot(storage, namespace);
  const createId =
    maybeOptions?.createId ??
    (() => crypto.randomUUID());
  const now =
    maybeOptions?.now ??
    (() => new Date().toISOString());
  const timestamp = now();
  const nextNote: Note = {
    id: createId(),
    title: input.title,
    content: input.content,
    folderId: resolveFolderId(
      snapshot.folders,
      input.folderId,
    ),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  writeSnapshot(storage, namespace, {
    ...snapshot,
    notes: [nextNote, ...snapshot.notes],
  });

  return nextNote;
}

export function createStoredFolder(
  storage: StorageLike,
  namespace: string,
  folderName: string,
  maybeOptions?: {
    createId?: () => string;
    now?: () => string;
  },
): NoteFolder | null {
  const trimmedName = folderName.trim();

  if (trimmedName === "") {
    return null;
  }

  const snapshot = readSnapshot(storage, namespace);
  const normalizedName = trimmedName.toLowerCase();

  if (
    snapshot.folders.some(
      (folder) =>
        folder.name.trim().toLowerCase() === normalizedName,
    )
  ) {
    return null;
  }

  const createId =
    maybeOptions?.createId ??
    (() => crypto.randomUUID());
  const now =
    maybeOptions?.now ??
    (() => new Date().toISOString());
  const timestamp = now();
  const nextFolder: NoteFolder = {
    id: createId(),
    name: trimmedName,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  writeSnapshot(storage, namespace, {
    ...snapshot,
    folders: [...snapshot.folders, nextFolder],
  });

  return nextFolder;
}

export function updateStoredNote(
  storage: StorageLike,
  namespace: string,
  noteId: string,
  updates: Partial<NoteInput>,
  maybeOptions?: {
    now?: () => string;
  },
): Note | null {
  const snapshot = readSnapshot(storage, namespace);
  const now =
    maybeOptions?.now ??
    (() => new Date().toISOString());
  let maybeUpdatedNote: Note | null = null;
  const nextNotes = snapshot.notes.map(
    (note) => {
      if (note.id !== noteId) {
        return note;
      }

      maybeUpdatedNote = {
        ...note,
        title: updates.title ?? note.title,
        content:
          updates.body === undefined
            ? note.content
            : createNoteContentFromPlainText(updates.body),
        folderId:
          updates.folderId === undefined
            ? note.folderId
            : resolveFolderId(
                snapshot.folders,
                updates.folderId,
              ),
        updatedAt: now(),
      };

      return maybeUpdatedNote;
    },
  );

  if (maybeUpdatedNote === null) {
    return null;
  }

  writeSnapshot(storage, namespace, {
    ...snapshot,
    notes: nextNotes,
  });

  return maybeUpdatedNote;
}

export function updateStoredNoteContent(
  storage: StorageLike,
  namespace: string,
  noteId: string,
  content: NoteContentDocument,
  maybeOptions?: {
    now?: () => string;
  },
): Note | null {
  const snapshot = readSnapshot(storage, namespace);
  const now =
    maybeOptions?.now ??
    (() => new Date().toISOString());
  let maybeUpdatedNote: Note | null = null;
  const nextNotes = snapshot.notes.map(
    (note) => {
      if (note.id !== noteId) {
        return note;
      }

      maybeUpdatedNote = {
        ...note,
        content,
        updatedAt: now(),
      };

      return maybeUpdatedNote;
    },
  );

  if (maybeUpdatedNote === null) {
    return null;
  }

  writeSnapshot(storage, namespace, {
    ...snapshot,
    notes: nextNotes,
  });

  return maybeUpdatedNote;
}

export function deleteStoredNote(
  storage: StorageLike,
  namespace: string,
  noteId: string,
): boolean {
  const snapshot = readSnapshot(storage, namespace);
  const nextNotes = snapshot.notes.filter(
    (note) => note.id !== noteId,
  );

  if (nextNotes.length === snapshot.notes.length) {
    return false;
  }

  writeSnapshot(storage, namespace, {
    ...snapshot,
    notes: nextNotes,
  });

  return true;
}

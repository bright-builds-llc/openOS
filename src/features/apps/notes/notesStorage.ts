import { createAppStorageKey } from "../../platform/appStorage";
import type { Note, NoteInput } from "./notesModel";
import { sortNotesByUpdatedAt } from "./notesModel";

type StorageLike = Pick<
  Storage,
  "getItem" | "removeItem" | "setItem"
>;

const NOTES_STORAGE_KEY = "notes";

function getNotesStorageKey(
  namespace: string,
): string {
  return createAppStorageKey(namespace, NOTES_STORAGE_KEY);
}

function parseNotes(
  maybeValue: string | null,
): Note[] {
  if (maybeValue === null) {
    return [];
  }

  try {
    const maybeParsed = JSON.parse(maybeValue);

    if (!Array.isArray(maybeParsed)) {
      return [];
    }

    return maybeParsed.flatMap((item) => {
      if (
        typeof item !== "object" ||
        item === null ||
        typeof item.id !== "string" ||
        typeof item.title !== "string" ||
        typeof item.body !== "string" ||
        typeof item.createdAt !== "string" ||
        typeof item.updatedAt !== "string"
      ) {
        return [];
      }

      return [
        {
          id: item.id,
          title: item.title,
          body: item.body,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        },
      ];
    });
  } catch {
    return [];
  }
}

function writeNotes(
  storage: StorageLike,
  namespace: string,
  maybeNotes: Note[],
): void {
  const storageKey = getNotesStorageKey(namespace);

  if (maybeNotes.length === 0) {
    storage.removeItem(storageKey);
    return;
  }

  storage.setItem(storageKey, JSON.stringify(maybeNotes));
}

export function listStoredNotes(
  storage: StorageLike,
  namespace: string,
): Note[] {
  return sortNotesByUpdatedAt(
    parseNotes(
      storage.getItem(getNotesStorageKey(namespace)),
    ),
  );
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
  const createId =
    maybeOptions?.createId ?? crypto.randomUUID;
  const now =
    maybeOptions?.now ??
    (() => new Date().toISOString());
  const timestamp = now();
  const nextNote: Note = {
    id: createId(),
    title: input.title,
    body: input.body,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  const nextNotes = [
    nextNote,
    ...listStoredNotes(storage, namespace),
  ];

  writeNotes(storage, namespace, nextNotes);

  return nextNote;
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
  const now =
    maybeOptions?.now ??
    (() => new Date().toISOString());
  let maybeUpdatedNote: Note | null = null;
  const nextNotes = listStoredNotes(storage, namespace).map(
    (note) => {
      if (note.id !== noteId) {
        return note;
      }

      maybeUpdatedNote = {
        ...note,
        title: updates.title ?? note.title,
        body: updates.body ?? note.body,
        updatedAt: now(),
      };

      return maybeUpdatedNote;
    },
  );

  if (maybeUpdatedNote === null) {
    return null;
  }

  writeNotes(storage, namespace, nextNotes);

  return maybeUpdatedNote;
}

export function deleteStoredNote(
  storage: StorageLike,
  namespace: string,
  noteId: string,
): boolean {
  const currentNotes = listStoredNotes(storage, namespace);
  const nextNotes = currentNotes.filter(
    (note) => note.id !== noteId,
  );

  if (nextNotes.length === currentNotes.length) {
    return false;
  }

  writeNotes(storage, namespace, nextNotes);

  return true;
}

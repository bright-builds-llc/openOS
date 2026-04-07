import { describe, expect, it } from "vitest";
import { createAppStorageNamespace } from "../../platform/appStorage";
import {
  createStoredNote,
  deleteStoredNote,
  getStoredNote,
  listStoredNotes,
  updateStoredNote,
} from "./notesStorage";

function createStorage(): Storage {
  const items = new Map<string, string>();

  return {
    clear: () => {
      items.clear();
    },
    getItem: (key: string) => items.get(key) ?? null,
    key: (index: number) =>
      Array.from(items.keys())[index] ?? null,
    get length() {
      return items.size;
    },
    removeItem: (key: string) => {
      items.delete(key);
    },
    setItem: (key: string, value: string) => {
      items.set(key, value);
    },
  } as Storage;
}

describe("notesStorage", () => {
  const namespace = createAppStorageNamespace("notes");

  it("creates and reopens persisted notes", () => {
    // Arrange
    const storage = createStorage();

    // Act
    const createdNote = createStoredNote(
      storage,
      namespace,
      {
        title: "Inbox",
        body: "First note",
      },
      {
        createId: () => "note-1",
        now: () => "2026-04-06T12:00:00Z",
      },
    );
    const reopenedNote = getStoredNote(
      storage,
      namespace,
      createdNote.id,
    );

    // Assert
    expect(createdNote.id).toBe("note-1");
    expect(reopenedNote).toEqual(createdNote);
  });

  it("updates an existing note and sorts by updated timestamp", () => {
    // Arrange
    const storage = createStorage();
    createStoredNote(
      storage,
      namespace,
      {
        title: "Older",
        body: "First",
      },
      {
        createId: () => "note-1",
        now: () => "2026-04-06T10:00:00Z",
      },
    );
    createStoredNote(
      storage,
      namespace,
      {
        title: "Newer",
        body: "Second",
      },
      {
        createId: () => "note-2",
        now: () => "2026-04-06T11:00:00Z",
      },
    );

    // Act
    const updatedNote = updateStoredNote(
      storage,
      namespace,
      "note-1",
      {
        body: "Updated",
      },
      {
        now: () => "2026-04-06T12:00:00Z",
      },
    );
    const notes = listStoredNotes(storage, namespace);

    // Assert
    expect(updatedNote?.body).toBe("Updated");
    expect(notes.map((note) => note.id)).toEqual([
      "note-1",
      "note-2",
    ]);
  });

  it("deletes a stored note", () => {
    // Arrange
    const storage = createStorage();
    createStoredNote(
      storage,
      namespace,
      {
        title: "Delete me",
        body: "Bye",
      },
      {
        createId: () => "note-1",
        now: () => "2026-04-06T10:00:00Z",
      },
    );

    // Act
    const removed = deleteStoredNote(
      storage,
      namespace,
      "note-1",
    );
    const notes = listStoredNotes(storage, namespace);

    // Assert
    expect(removed).toBe(true);
    expect(notes).toEqual([]);
  });

  it("ignores invalid stored payloads", () => {
    // Arrange
    const storage = createStorage();
    storage.setItem(
      `${namespace}.notes`,
      '{"bad":true}',
    );

    // Act
    const notes = listStoredNotes(storage, namespace);

    // Assert
    expect(notes).toEqual([]);
  });
});

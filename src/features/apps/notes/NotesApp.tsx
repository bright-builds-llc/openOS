import { useState } from "react";
import { createAppStorageNamespace } from "../../platform/appStorage";
import {
  createStoredNote,
  deleteStoredNote,
  listStoredNotes,
  updateStoredNote,
} from "./notesStorage";
import "./notes.css";

const NOTES_APP_ID = "notes";
const NOTES_NAMESPACE = createAppStorageNamespace(NOTES_APP_ID);

type NotesStorageLike = Pick<
  Storage,
  "getItem" | "removeItem" | "setItem"
>;

function loadNotes(storage: NotesStorageLike) {
  return listStoredNotes(storage, NOTES_NAMESPACE);
}

function createEmptyNote(storage: NotesStorageLike) {
  return createStoredNote(storage, NOTES_NAMESPACE, {
    title: "Untitled",
    body: "",
  });
}

export function NotesApp() {
  const storage = window.localStorage;
  const [notes, setNotes] = useState(() => loadNotes(storage));
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(
    () => notes[0]?.id ?? null,
  );

  const selectedNote =
    notes.find((note) => note.id === selectedNoteId) ?? null;

  function refreshNotes(nextSelectedId: string | null = selectedNoteId) {
    const nextNotes = loadNotes(storage);
    const nextSelectedNote =
      nextSelectedId === null
        ? nextNotes[0] ?? null
        : nextNotes.find((note) => note.id === nextSelectedId) ??
          nextNotes[0] ??
          null;

    setNotes(nextNotes);
    setSelectedNoteId(nextSelectedNote?.id ?? null);
  }

  function handleCreateNote() {
    const nextNote = createEmptyNote(storage);
    refreshNotes(nextNote.id);
  }

  function handleDeleteNote() {
    if (selectedNote === null) {
      return;
    }

    deleteStoredNote(storage, NOTES_NAMESPACE, selectedNote.id);
    refreshNotes(null);
  }

  function handleUpdateNote(
    field: "title" | "body",
    value: string,
  ) {
    if (selectedNote === null) {
      return;
    }

    updateStoredNote(storage, NOTES_NAMESPACE, selectedNote.id, {
      [field]: value,
    });
    refreshNotes(selectedNote.id);
  }

  return (
    <section
      aria-label="Notes controls"
      className="notes-app"
      data-testid="notes-app"
    >
      <header className="notes-app__hero">
        <div>
          <p className="notes-app__eyebrow">openOS</p>
          <h1 className="notes-app__title">Notes</h1>
        </div>
        <button
          className="notes-app__create"
          data-testid="notes-create"
          onClick={handleCreateNote}
          type="button"
        >
          New Note
        </button>
      </header>

      <section
        className="notes-app__warning"
        data-testid="notes-local-warning"
      >
        Notes live only in this browser for now. Sync and account recovery
        are not available yet.
      </section>

      <div className="notes-app__layout">
        <section className="notes-app__list" data-testid="notes-list">
          {notes.length === 0 ? (
            <div className="notes-app__empty">
              Create your first local note to start this device-only notebook.
            </div>
          ) : (
            notes.map((note) => {
              const isActive = note.id === selectedNoteId;

              return (
                <button
                  className="notes-app__list-item"
                  data-active={isActive ? "true" : "false"}
                  data-testid={`notes-item:${note.id}`}
                  key={note.id}
                  onClick={() => {
                    setSelectedNoteId(note.id);
                  }}
                  type="button"
                >
                  <span className="notes-app__list-title">
                    {note.title.trim() === "" ? "Untitled" : note.title}
                  </span>
                  <span className="notes-app__list-preview">
                    {note.body.trim() === ""
                      ? "Empty note"
                      : note.body.slice(0, 72)}
                  </span>
                </button>
              );
            })
          )}
        </section>

        <section
          className="notes-app__editor"
          data-testid="notes-editor"
        >
          {selectedNote === null ? (
            <div className="notes-app__empty notes-app__empty--editor">
              No note selected yet.
            </div>
          ) : (
            <>
              <div className="notes-app__editor-actions">
                <button
                  className="notes-app__delete"
                  data-testid="notes-delete"
                  onClick={handleDeleteNote}
                  type="button"
                >
                  Delete
                </button>
              </div>
              <input
                className="notes-app__title-input"
                data-testid="notes-title-input"
                onChange={(event) => {
                  handleUpdateNote("title", event.target.value);
                }}
                type="text"
                value={selectedNote.title}
              />
              <textarea
                className="notes-app__body-input"
                data-testid="notes-body-input"
                onChange={(event) => {
                  handleUpdateNote("body", event.target.value);
                }}
                value={selectedNote.body}
              />
            </>
          )}
        </section>
      </div>
    </section>
  );
}

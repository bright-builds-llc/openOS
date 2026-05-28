import {
  startTransition,
  useDeferredValue,
  useEffect,
  useState,
} from "react";
import {
  getCanonicalRuntimeAppForLaunchSurface,
  getCanonicalRuntimeAppStorageNamespace,
} from "../../runtime/appRegistry";
import {
  createStoredFolder,
  createStoredNote,
  deleteStoredNote,
  listStoredFolders,
  listStoredNotes,
  updateStoredNote,
} from "./notesStorage";
import {
  DEFAULT_NOTES_FOLDER_ID,
  filterNotes,
  getNoteBodyText,
  getNotePreview,
  getNoteTitle,
  type Note,
  type NoteFolder,
} from "./notesModel";
import "./notes.css";

function getNotesRuntimeApp() {
  const maybeNotesApp =
    getCanonicalRuntimeAppForLaunchSurface("notes");

  if (maybeNotesApp === null) {
    throw new Error("Notes runtime metadata is missing.");
  }

  return maybeNotesApp;
}

const NOTES_RUNTIME_APP = getNotesRuntimeApp();
function getNotesStorageNamespace() {
  const maybeNotesStorageNamespace =
    getCanonicalRuntimeAppStorageNamespace("notes");

  if (maybeNotesStorageNamespace === null) {
    throw new Error("Notes storage namespace metadata is missing.");
  }

  return maybeNotesStorageNamespace;
}

const NOTES_NAMESPACE = getNotesStorageNamespace();

type NotesStorageLike = Pick<
  Storage,
  "getItem" | "removeItem" | "setItem"
>;

type NotesState = {
  folders: NoteFolder[];
  notes: Note[];
};

const ALL_NOTES_FOLDER_ID = "all";
const EDITOR_TIMESTAMP_FORMAT = new Intl.DateTimeFormat(
  undefined,
  {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  },
);

function loadNotesState(
  storage: NotesStorageLike,
): NotesState {
  return {
    folders: listStoredFolders(storage, NOTES_NAMESPACE),
    notes: listStoredNotes(storage, NOTES_NAMESPACE),
  };
}

function resolveSelectedFolderId(
  maybeFolders: NoteFolder[],
  folderId: string,
): string {
  if (folderId === ALL_NOTES_FOLDER_ID) {
    return ALL_NOTES_FOLDER_ID;
  }

  return maybeFolders.some(
    (folder) => folder.id === folderId,
  )
    ? folderId
    : ALL_NOTES_FOLDER_ID;
}

function resolveDestinationFolderId(
  maybeFolders: NoteFolder[],
  selectedFolderId: string,
): string {
  if (selectedFolderId !== ALL_NOTES_FOLDER_ID) {
    return selectedFolderId;
  }

  return maybeFolders[0]?.id ?? DEFAULT_NOTES_FOLDER_ID;
}

function formatEditorTimestamp(
  timestamp: string,
): string {
  return EDITOR_TIMESTAMP_FORMAT.format(
    new Date(timestamp),
  );
}

function createTestIdToken(value: string): string {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "folder"
  );
}

function createEmptyNote(
  storage: NotesStorageLike,
  folderId: string,
) {
  return createStoredNote(storage, NOTES_NAMESPACE, {
    title: "Untitled",
    body: "",
    folderId,
  });
}

function FolderFilterButton({
  label,
  noteCount,
  isActive,
  testId,
  onClick,
}: {
  label: string;
  noteCount: number;
  isActive: boolean;
  testId: string;
  onClick: () => void;
}) {
  return (
    <button
      className="notes-app__folder-chip"
      data-active={isActive ? "true" : "false"}
      data-testid={testId}
      onClick={onClick}
      type="button"
    >
      <span className="notes-app__folder-chip-title">
        {label}
      </span>
      <span className="notes-app__folder-chip-count">
        {noteCount}
      </span>
    </button>
  );
}

function NoteListItem({
  note,
  folderName,
  isActive,
  showFolderName,
  onClick,
}: {
  note: Note;
  folderName: string;
  isActive: boolean;
  showFolderName: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="notes-app__list-item"
      data-active={isActive ? "true" : "false"}
      data-testid={`notes-item:${note.id}`}
      onClick={onClick}
      type="button"
    >
      <div className="notes-app__list-heading">
        <span className="notes-app__list-title">
          {getNoteTitle(note)}
        </span>
        {showFolderName ? (
          <span className="notes-app__list-folder">
            {folderName}
          </span>
        ) : null}
      </div>
      <span className="notes-app__list-preview">
        {getNotePreview(note)}
      </span>
    </button>
  );
}

export function NotesApp() {
  const storage = window.localStorage;
  const [notesState, setNotesState] = useState(() =>
    loadNotesState(storage),
  );
  const [selectedFolderId, setSelectedFolderId] =
    useState<string>(ALL_NOTES_FOLDER_ID);
  const [selectedNoteId, setSelectedNoteId] =
    useState<string | null>(
      () => notesState.notes[0]?.id ?? null,
    );
  const [searchQuery, setSearchQuery] = useState("");
  const [folderDraft, setFolderDraft] = useState("");
  const deferredSearchQuery =
    useDeferredValue(searchQuery);
  const { folders, notes } = notesState;
  const trimmedFolderDraft = folderDraft.trim();
  const folderCounts = notes.reduce(
    (countMap, note) =>
      countMap.set(
        note.folderId,
        (countMap.get(note.folderId) ?? 0) + 1,
      ),
    new Map<string, number>(),
  );
  const folderNameById = new Map(
    folders.map((folder) => [folder.id, folder.name]),
  );
  const visibleNotes = filterNotes(notes, {
    query: deferredSearchQuery,
    maybeFolderId:
      selectedFolderId === ALL_NOTES_FOLDER_ID
        ? null
        : selectedFolderId,
  });
  const selectedNote =
    visibleNotes.find((note) => note.id === selectedNoteId) ??
    null;
  const selectedFolderName =
    selectedFolderId === ALL_NOTES_FOLDER_ID
      ? "All Notes"
      : folderNameById.get(selectedFolderId) ?? "All Notes";
  const hasDuplicateFolderName =
    trimmedFolderDraft !== "" &&
    folders.some(
      (folder) =>
        folder.name.trim().toLowerCase() ===
        trimmedFolderDraft.toLowerCase(),
    );

  useEffect(() => {
    if (visibleNotes.length === 0) {
      if (selectedNoteId !== null) {
        setSelectedNoteId(null);
      }
      return;
    }

    if (
      visibleNotes.some(
        (note) => note.id === selectedNoteId,
      )
    ) {
      return;
    }

    setSelectedNoteId(visibleNotes[0]?.id ?? null);
  }, [selectedNoteId, visibleNotes]);

  function refreshNotesState(options?: {
    selectedFolderId?: string;
    selectedNoteId?: string | null;
  }) {
    const nextNotesState = loadNotesState(storage);
    const nextFolderId = resolveSelectedFolderId(
      nextNotesState.folders,
      options?.selectedFolderId ?? selectedFolderId,
    );

    setNotesState(nextNotesState);
    setSelectedFolderId(nextFolderId);

    if (options && "selectedNoteId" in options) {
      setSelectedNoteId(options.selectedNoteId ?? null);
    }
  }

  function handleCreateNote() {
    const destinationFolderId =
      resolveDestinationFolderId(
        folders,
        selectedFolderId,
      );
    const nextNote = createEmptyNote(
      storage,
      destinationFolderId,
    );

    startTransition(() => {
      refreshNotesState({
        selectedFolderId,
        selectedNoteId: nextNote.id,
      });
    });
  }

  function handleCreateFolder() {
    const nextFolder = createStoredFolder(
      storage,
      NOTES_NAMESPACE,
      trimmedFolderDraft,
    );

    if (nextFolder === null) {
      return;
    }

    setFolderDraft("");
    startTransition(() => {
      refreshNotesState({
        selectedFolderId: nextFolder.id,
        selectedNoteId: null,
      });
    });
  }

  function handleDeleteNote() {
    if (selectedNote === null) {
      return;
    }

    deleteStoredNote(storage, NOTES_NAMESPACE, selectedNote.id);
    startTransition(() => {
      refreshNotesState({
        selectedNoteId: null,
      });
    });
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

    startTransition(() => {
      refreshNotesState({
        selectedNoteId: selectedNote.id,
      });
    });
  }

  function handleChangeNoteFolder(
    nextFolderId: string,
  ) {
    if (selectedNote === null) {
      return;
    }

    updateStoredNote(storage, NOTES_NAMESPACE, selectedNote.id, {
      folderId: nextFolderId,
    });

    startTransition(() => {
      refreshNotesState({
        selectedFolderId:
          selectedFolderId === ALL_NOTES_FOLDER_ID
            ? selectedFolderId
            : nextFolderId,
        selectedNoteId: selectedNote.id,
      });
    });
  }

  function renderListEmptyState() {
    if (deferredSearchQuery.trim() !== "") {
      return (
        <div className="notes-app__empty">
          Nothing matches this search yet. Try a different
          phrase or switch folders.
        </div>
      );
    }

    if (selectedFolderId !== ALL_NOTES_FOLDER_ID) {
      return (
        <div className="notes-app__empty">
          This folder is empty. Create a note here to start
          organizing it.
        </div>
      );
    }

    return (
      <div className="notes-app__empty">
        Create your first local note to start this
        device-only notebook.
      </div>
    );
  }

  function renderEditorEmptyState() {
    if (visibleNotes.length === 0) {
      return (
        <div className="notes-app__empty notes-app__empty--editor">
          {deferredSearchQuery.trim() !== ""
            ? "Search results appear here when a note matches."
            : selectedFolderId === ALL_NOTES_FOLDER_ID
              ? "No note selected yet."
              : `No note selected in ${selectedFolderName}.`}
        </div>
      );
    }

    return (
      <div className="notes-app__empty notes-app__empty--editor">
        No note selected yet.
      </div>
    );
  }

  return (
    <section
      aria-label="Notes controls"
      className="notes-app"
      data-testid="notes-app"
    >
      <header className="notes-app__hero">
        <div className="notes-app__hero-copy">
          <p className="notes-app__eyebrow">openOS</p>
          <h1 className="notes-app__title">
            {NOTES_RUNTIME_APP.label}
          </h1>
          <p className="notes-app__hero-body">
            Search across your local notes, keep them in
            folders, and stay honest about the fact that they
            still live only on this device.
          </p>
        </div>
        <div className="notes-app__hero-actions">
          <button
            className="notes-app__create"
            data-testid="notes-create"
            onClick={handleCreateNote}
            type="button"
          >
            New Note
          </button>
        </div>
      </header>

      <section
        className="notes-app__warning"
        data-testid="notes-local-warning"
      >
        Notes live only in this browser for now. Sync and account recovery
        are not available yet.
      </section>

      <section className="notes-app__toolbar">
        <label className="notes-app__search" htmlFor="notes-search">
          <span className="notes-app__field-label">Search</span>
          <input
            className="notes-app__search-input"
            data-testid="notes-search-input"
            id="notes-search"
            onChange={(event) => {
              setSearchQuery(event.target.value);
            }}
            placeholder="Search notes by title or body"
            type="search"
            value={searchQuery}
          />
          <span className="notes-app__field-hint">
            Results update as you type across titles and body
            text.
          </span>
        </label>

        <div className="notes-app__folder-composer">
          <label
            className="notes-app__folder-composer-field"
            htmlFor="notes-folder-input"
          >
            <span className="notes-app__field-label">
              New Folder
            </span>
            <input
              className="notes-app__folder-input"
              data-testid="notes-folder-input"
              id="notes-folder-input"
              onChange={(event) => {
                setFolderDraft(event.target.value);
              }}
              placeholder="Create a folder"
              type="text"
              value={folderDraft}
            />
          </label>
          <button
            className="notes-app__folder-save"
            data-testid="notes-folder-save"
            disabled={
              trimmedFolderDraft === "" ||
              hasDuplicateFolderName
            }
            onClick={handleCreateFolder}
            type="button"
          >
            Add Folder
          </button>
          <span className="notes-app__field-hint">
            {hasDuplicateFolderName
              ? "Folder names stay unique on this device."
              : "Keep folders lightweight and local-first for now."}
          </span>
        </div>
      </section>

      <nav
        aria-label="Notes folders"
        className="notes-app__folder-strip"
        data-testid="notes-folder-filters"
      >
        <FolderFilterButton
          isActive={selectedFolderId === ALL_NOTES_FOLDER_ID}
          label="All Notes"
          noteCount={notes.length}
          onClick={() => {
            startTransition(() => {
              setSelectedFolderId(ALL_NOTES_FOLDER_ID);
            });
          }}
          testId="notes-folder-filter:all"
        />
        {folders.map((folder) => (
          <FolderFilterButton
            isActive={selectedFolderId === folder.id}
            key={folder.id}
            label={folder.name}
            noteCount={folderCounts.get(folder.id) ?? 0}
            onClick={() => {
              startTransition(() => {
                setSelectedFolderId(folder.id);
              });
            }}
            testId={`notes-folder-filter:${createTestIdToken(folder.name)}`}
          />
        ))}
      </nav>

      <div className="notes-app__layout">
        <section className="notes-app__list" data-testid="notes-list">
          <div className="notes-app__panel-header">
            <div>
              <p className="notes-app__panel-eyebrow">
                Browsing
              </p>
              <h2 className="notes-app__panel-title">
                {selectedFolderName}
              </h2>
            </div>
            <span className="notes-app__panel-meta">
              {deferredSearchQuery.trim() === ""
                ? `${visibleNotes.length} note${
                    visibleNotes.length === 1 ? "" : "s"
                  }`
                : `${visibleNotes.length} result${
                    visibleNotes.length === 1 ? "" : "s"
                  }`}
            </span>
          </div>
          {visibleNotes.length === 0
            ? renderListEmptyState()
            : visibleNotes.map((note) => (
                <NoteListItem
                  folderName={
                    folderNameById.get(note.folderId) ??
                    "Notes"
                  }
                  isActive={note.id === selectedNoteId}
                  key={note.id}
                  note={note}
                  onClick={() => {
                    setSelectedNoteId(note.id);
                  }}
                  showFolderName={
                    selectedFolderId === ALL_NOTES_FOLDER_ID
                  }
                />
              ))}
        </section>

        <section
          className="notes-app__editor"
          data-testid="notes-editor"
        >
          {selectedNote === null ? (
            renderEditorEmptyState()
          ) : (
            <>
              <div className="notes-app__editor-topline">
                <div className="notes-app__editor-meta">
                  <label
                    className="notes-app__editor-field"
                    htmlFor="notes-folder-select"
                  >
                    <span className="notes-app__field-label">
                      Folder
                    </span>
                    <div className="notes-app__folder-select-wrap">
                      <select
                        className="notes-app__folder-select"
                        data-testid="notes-folder-select"
                        id="notes-folder-select"
                        onChange={(event) => {
                          handleChangeNoteFolder(
                            event.target.value,
                          );
                        }}
                        value={selectedNote.folderId}
                      >
                        {folders.map((folder) => (
                          <option
                            key={folder.id}
                            value={folder.id}
                          >
                            {folder.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </label>
                  <span className="notes-app__editor-stamp">
                    Updated{" "}
                    {formatEditorTimestamp(
                      selectedNote.updatedAt,
                    )}
                  </span>
                </div>
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
                value={getNoteBodyText(selectedNote)}
              />
            </>
          )}
        </section>
      </div>
    </section>
  );
}

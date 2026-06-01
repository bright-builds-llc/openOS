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
  createStoredNoteFromContent,
  deleteStoredNote,
  listStoredFolders,
  listStoredNotes,
  updateStoredNote,
  updateStoredNoteContent,
} from "./notesStorage";
import {
  DEFAULT_NOTES_FOLDER_ID,
  filterNotes,
  getNotePreview,
  getNoteTitle,
  type Note,
  type NoteFolder,
} from "./notesModel";
import { NotesEditor } from "./NotesEditor";
import { createDefaultEditableNoteContent } from "./notesContent";
import {
  NOTES_ALL_FOLDER_ID,
  readNotesSession,
  resolveNotesSession,
  writeNotesSession,
} from "./notesSession";
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

type NotesSessionStatus = "available" | "warning";

type InitialNotesAppState = {
  notesState: NotesState;
  selectedFolderId: string;
  selectedNoteId: string | null;
  searchQuery: string;
  selectedBlockIndex: number | null;
  sessionStatus: NotesSessionStatus;
};

const NOTES_SESSION_WARNING_COPY =
  "Notes are saved, but editor resume could not be saved. You can keep editing; Notes may reopen from the default view.";

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

function createInitialNotesAppState(
  storage: NotesStorageLike,
): InitialNotesAppState {
  const notesState = loadNotesState(storage);
  const sessionReadResult = readNotesSession(
    storage,
    NOTES_NAMESPACE,
  );
  const resolvedSession = resolveNotesSession(
    sessionReadResult.session,
    notesState,
  );

  return {
    notesState,
    selectedFolderId: resolvedSession.selectedFolderId,
    selectedNoteId: resolvedSession.selectedNoteId,
    searchQuery: resolvedSession.searchQuery,
    selectedBlockIndex: resolvedSession.selectedBlockIndex,
    sessionStatus:
      sessionReadResult.status === "reset" ||
      sessionReadResult.status === "unavailable"
        ? "warning"
        : "available",
  };
}

function resolveSelectedFolderId(
  maybeFolders: NoteFolder[],
  folderId: string,
): string {
  if (folderId === NOTES_ALL_FOLDER_ID) {
    return NOTES_ALL_FOLDER_ID;
  }

  return maybeFolders.some(
    (folder) => folder.id === folderId,
  )
    ? folderId
    : NOTES_ALL_FOLDER_ID;
}

function resolveDestinationFolderId(
  maybeFolders: NoteFolder[],
  selectedFolderId: string,
): string {
  if (selectedFolderId !== NOTES_ALL_FOLDER_ID) {
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
  return createStoredNoteFromContent(storage, NOTES_NAMESPACE, {
    title: "Untitled",
    content: createDefaultEditableNoteContent(),
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
  const [initialNotesAppState] = useState(() =>
    createInitialNotesAppState(storage),
  );
  const [notesState, setNotesState] = useState(
    initialNotesAppState.notesState,
  );
  const [selectedFolderId, setSelectedFolderId] =
    useState<string>(
      initialNotesAppState.selectedFolderId,
    );
  const [selectedNoteId, setSelectedNoteId] =
    useState<string | null>(
      initialNotesAppState.selectedNoteId,
    );
  const [searchQuery, setSearchQuery] = useState(
    initialNotesAppState.searchQuery,
  );
  const [selectedBlockIndex, setSelectedBlockIndex] =
    useState<number | null>(
      initialNotesAppState.selectedBlockIndex,
    );
  const [sessionStatus, setSessionStatus] =
    useState<NotesSessionStatus>(
      initialNotesAppState.sessionStatus,
    );
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
      selectedFolderId === NOTES_ALL_FOLDER_ID
        ? null
        : selectedFolderId,
  });
  const selectedNote =
    visibleNotes.find((note) => note.id === selectedNoteId) ??
    null;
  const selectedFolderName =
    selectedFolderId === NOTES_ALL_FOLDER_ID
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
      if (selectedBlockIndex !== null) {
        setSelectedBlockIndex(null);
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
    setSelectedBlockIndex(null);
  }, [selectedBlockIndex, selectedNoteId, visibleNotes]);

  useEffect(() => {
    const writeResult = writeNotesSession(
      storage,
      NOTES_NAMESPACE,
      {
        selectedFolderId,
        selectedNoteId,
        searchQuery,
        selectedBlockIndex,
      },
    );

    if (writeResult.status === "unavailable") {
      setSessionStatus("warning");
    }
  }, [
    storage,
    searchQuery,
    selectedBlockIndex,
    selectedFolderId,
    selectedNoteId,
  ]);

  useEffect(() => {
    if (selectedNote === null) {
      if (selectedBlockIndex !== null) {
        setSelectedBlockIndex(null);
      }
      return;
    }

    if (
      selectedBlockIndex === null ||
      selectedBlockIndex < selectedNote.content.blocks.length
    ) {
      return;
    }

    setSelectedBlockIndex(
      selectedNote.content.blocks.length === 0
        ? null
        : selectedNote.content.blocks.length - 1,
    );
  }, [selectedBlockIndex, selectedNote]);

  function refreshNotesState(options?: {
    selectedFolderId?: string;
    selectedNoteId?: string | null;
    selectedBlockIndex?: number | null;
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

    if (options && "selectedBlockIndex" in options) {
      setSelectedBlockIndex(
        options.selectedBlockIndex ?? null,
      );
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
        selectedBlockIndex: 0,
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
        selectedBlockIndex: null,
      });
    });
  }

  function handleDeleteNote() {
    if (selectedNote === null) {
      return;
    }

    if (
      !window.confirm(
        "Delete this note from this browser? This cannot be undone.",
      )
    ) {
      return;
    }

    deleteStoredNote(storage, NOTES_NAMESPACE, selectedNote.id);
    startTransition(() => {
      refreshNotesState({
        selectedNoteId: null,
        selectedBlockIndex: null,
      });
    });
  }

  function handleUpdateNoteTitle(value: string) {
    if (selectedNote === null) {
      return;
    }

    updateStoredNote(storage, NOTES_NAMESPACE, selectedNote.id, {
      title: value,
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
          selectedFolderId === NOTES_ALL_FOLDER_ID
            ? selectedFolderId
            : nextFolderId,
        selectedNoteId: selectedNote.id,
      });
    });
  }

  function handleUpdateNoteContent(
    nextContent: Note["content"],
    nextSelectedBlockIndex: number | null,
  ) {
    if (selectedNote === null) {
      return;
    }

    updateStoredNoteContent(
      storage,
      NOTES_NAMESPACE,
      selectedNote.id,
      nextContent,
    );
    setSelectedBlockIndex(nextSelectedBlockIndex);

    startTransition(() => {
      refreshNotesState({
        selectedNoteId: selectedNote.id,
        selectedBlockIndex: nextSelectedBlockIndex,
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

    if (selectedFolderId !== NOTES_ALL_FOLDER_ID) {
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
            : selectedFolderId === NOTES_ALL_FOLDER_ID
              ? "No note selected yet."
              : `No note selected in ${selectedFolderName}.`}
          {deferredSearchQuery.trim() === "" &&
          selectedFolderId === NOTES_ALL_FOLDER_ID
            ? " Create a note or choose one from the list to start editing structured blocks."
            : ""}
        </div>
      );
    }

    return (
      <div className="notes-app__empty notes-app__empty--editor">
        No note selected yet. Create a note or choose one from
        the list to start editing structured blocks.
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

      {sessionStatus === "warning" ? (
        <section
          className="notes-app__session-warning"
          data-testid="notes-session-warning"
        >
          {NOTES_SESSION_WARNING_COPY}
        </section>
      ) : null}

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
            Results update as you type across titles and
            structured note text.
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
          isActive={selectedFolderId === NOTES_ALL_FOLDER_ID}
          label="All Notes"
          noteCount={notes.length}
          onClick={() => {
            startTransition(() => {
              setSelectedFolderId(NOTES_ALL_FOLDER_ID);
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
                    selectedFolderId === NOTES_ALL_FOLDER_ID
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
                  handleUpdateNoteTitle(event.target.value);
                }}
                type="text"
                value={selectedNote.title}
              />
              <NotesEditor
                content={selectedNote.content}
                onContentChange={handleUpdateNoteContent}
                onSelectedBlockIndexChange={
                  setSelectedBlockIndex
                }
                selectedBlockIndex={selectedBlockIndex}
              />
            </>
          )}
        </section>
      </div>
    </section>
  );
}

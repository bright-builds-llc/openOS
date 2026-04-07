export type Note = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

export type NoteInput = {
  title: string;
  body: string;
};

export function sortNotesByUpdatedAt(
  maybeNotes: Note[],
): Note[] {
  return [...maybeNotes].sort((left, right) =>
    right.updatedAt.localeCompare(left.updatedAt),
  );
}

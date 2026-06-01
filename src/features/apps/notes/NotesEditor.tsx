import { useEffect, useRef } from "react";
import {
  appendNoteContentBlock,
  removeNoteContentBlock,
  toggleChecklistItemBlock,
  updateNoteContentBlockText,
  type NoteContentDocument,
  type NoteContentBlockKind,
} from "./notesContent";

type NotesEditorProps = {
  content: NoteContentDocument;
  selectedBlockIndex: number | null;
  onContentChange: (
    nextContent: NoteContentDocument,
    nextSelectedBlockIndex: number | null,
  ) => void;
  onSelectedBlockIndexChange: (
    nextSelectedBlockIndex: number | null,
  ) => void;
};

type EditableBlockElement =
  | HTMLInputElement
  | HTMLTextAreaElement;

export function NotesEditor({
  content,
  selectedBlockIndex,
  onContentChange,
  onSelectedBlockIndexChange,
}: NotesEditorProps) {
  const blockInputRefs = useRef<EditableBlockElement[]>([]);

  useEffect(() => {
    if (selectedBlockIndex === null) {
      return;
    }

    blockInputRefs.current[selectedBlockIndex]?.focus();
  }, [content.blocks.length, selectedBlockIndex]);

  function handleAppendBlock(kind: NoteContentBlockKind) {
    const result = appendNoteContentBlock(content, kind);
    onContentChange(result.content, result.selectedBlockIndex);
  }

  function handleUpdateBlockText(
    blockIndex: number,
    text: string,
  ) {
    onContentChange(
      updateNoteContentBlockText(content, blockIndex, text),
      blockIndex,
    );
  }

  function handleToggleChecklistItem(blockIndex: number) {
    onContentChange(
      toggleChecklistItemBlock(content, blockIndex),
      blockIndex,
    );
  }

  function handleRemoveBlock(blockIndex: number) {
    const result = removeNoteContentBlock(content, blockIndex);
    onContentChange(result.content, result.selectedBlockIndex);
  }

  function captureBlockInputRef(
    blockIndex: number,
    maybeElement: EditableBlockElement | null,
  ) {
    if (maybeElement === null) {
      return;
    }

    blockInputRefs.current[blockIndex] = maybeElement;
  }

  return (
    <div className="notes-app__structured-editor">
      <div
        aria-label="Add note block"
        className="notes-app__editor-toolbar"
      >
        <button
          className="notes-app__editor-add"
          data-testid="notes-add-text"
          onClick={() => {
            handleAppendBlock("paragraph");
          }}
          type="button"
        >
          Add Text
        </button>
        <button
          className="notes-app__editor-add"
          data-testid="notes-add-heading"
          onClick={() => {
            handleAppendBlock("heading");
          }}
          type="button"
        >
          Add Heading
        </button>
        <button
          className="notes-app__editor-add"
          data-testid="notes-add-checklist-item"
          onClick={() => {
            handleAppendBlock("checklistItem");
          }}
          type="button"
        >
          Add Checklist Item
        </button>
      </div>

      {content.blocks.length === 0 ? (
        <div className="notes-app__editor-empty">
          Add a text, heading, or checklist block to keep writing.
        </div>
      ) : (
        <div className="notes-app__blocks">
          {content.blocks.map((block, index) => {
            const isSelected = selectedBlockIndex === index;

            return (
              <div
                className="notes-app__block"
                data-selected={isSelected ? "true" : "false"}
                key={index}
              >
                {block.kind === "paragraph" ? (
                  <textarea
                    className="notes-app__block-input notes-app__block-input--paragraph"
                    data-testid={`notes-block-input:${index}`}
                    onChange={(event) => {
                      handleUpdateBlockText(
                        index,
                        event.target.value,
                      );
                    }}
                    onFocus={() => {
                      onSelectedBlockIndexChange(index);
                    }}
                    ref={(maybeElement) => {
                      captureBlockInputRef(index, maybeElement);
                    }}
                    value={block.text}
                  />
                ) : null}

                {block.kind === "heading" ? (
                  <input
                    className="notes-app__block-input notes-app__block-input--heading"
                    data-testid={`notes-block-input:${index}`}
                    onChange={(event) => {
                      handleUpdateBlockText(
                        index,
                        event.target.value,
                      );
                    }}
                    onFocus={() => {
                      onSelectedBlockIndexChange(index);
                    }}
                    ref={(maybeElement) => {
                      captureBlockInputRef(index, maybeElement);
                    }}
                    type="text"
                    value={block.text}
                  />
                ) : null}

                {block.kind === "checklistItem" ? (
                  <label
                    className="notes-app__checklist-row"
                    data-checked={block.checked ? "true" : "false"}
                  >
                    <input
                      className="notes-app__block-check"
                      checked={block.checked}
                      data-testid={`notes-block-check:${index}`}
                      onChange={() => {
                        handleToggleChecklistItem(index);
                      }}
                      onFocus={() => {
                        onSelectedBlockIndexChange(index);
                      }}
                      type="checkbox"
                    />
                    <input
                      className="notes-app__block-input notes-app__block-input--checklist"
                      data-testid={`notes-block-input:${index}`}
                      onChange={(event) => {
                        handleUpdateBlockText(
                          index,
                          event.target.value,
                        );
                      }}
                      onFocus={() => {
                        onSelectedBlockIndexChange(index);
                      }}
                      ref={(maybeElement) => {
                        captureBlockInputRef(index, maybeElement);
                      }}
                      type="text"
                      value={block.text}
                    />
                  </label>
                ) : null}

                <button
                  className="notes-app__block-remove"
                  data-testid={`notes-block-remove:${index}`}
                  onClick={() => {
                    handleRemoveBlock(index);
                  }}
                  type="button"
                >
                  Remove Block
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

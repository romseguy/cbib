import { css } from "@emotion/react";
import { Select } from "@radix-ui/themes";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { AddNoteButton, BookTitle, Flex, Note, useToast } from "~/components";
import { getState, setState } from "~/store";
import { ENoteOrder, localize, type NoteT } from "~/utils";

export const Livre = (props) => {
  const { lib, book, auth, isMobile, locale } = useSelector(getState);
  const user = auth?.user;
  const hasEditing = useMemo(() => {
    if (!book || !book.notes) return false;
    return book.notes?.filter((n) => n.isEditing).length > 0;
  }, [book]);
  const [order, setOrder] = useState<ENoteOrder>();
  const SelectOrder =
    book.notes && book.notes.length > 0 ? (
      <Select.Root
        defaultValue={ENoteOrder.ID}
        onValueChange={(value) => setOrder(value as unknown as ENoteOrder)}
      >
        <Select.Trigger variant="classic" />
        <Select.Content>
          <Select.Item value={ENoteOrder.ID}>
            {localize(
              "Citations plus récentes en premier",
              "Most recent quotes first",
            )}
          </Select.Item>
          <Select.Item value={ENoteOrder.PAGE}>
            {localize("Dans l'ordre des pages", "By page order")}
          </Select.Item>
        </Select.Content>
      </Select.Root>
    ) : null;
  const notesGrid = useMemo(() => {
    if (!book || !book.notes) return [[]];
    const rows: NoteT[] = [...book.notes].sort((a, b) => {
      if (order === ENoteOrder.ID) return a.id < b.id ? -1 : 1;
      if (order === ENoteOrder.PAGE && a.page && b.page) {
        return a.page < b.page ? -1 : 1;
      }
      return a.id < b.id ? -1 : 1;
    });
    let c = -1;
    let i = 0;
    let els: NoteT[][] = [];
    for (const row of rows) {
      const n = { ...row, index: i };
      if (i % 3 === 0) {
        els.push([n]);
        ++c;
      } else {
        els[c]?.push(n);
      }
      ++i;
    }
    return els;
  }, [book, order, locale]);

  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const showToast = useToast();
  const setBook = (b) => dispatch(setState({ book: b }));

  return (
    <div id="book-page">
      {/* book header */}
      {!hasEditing && (
        <div id="book-header">
          <BookTitle lib={lib} book={book} />
        </div>
      )}

      <main>
        {/* order & add note button */}
        {!hasEditing && (
          <>
            {isMobile && (
              <Flex
                direction="column"
                css={css`
                  button {
                    margin: 12px 0;
                  }
                  button:last-of-type {
                    margin-top: 0;
                  }
                `}
              >
                <AddNoteButton book={book} setBook={setBook} />
                {SelectOrder}
              </Flex>
            )}

            {!isMobile && (
              <Flex direction="column">
                <AddNoteButton book={book} setBook={setBook} my="3" />
                {SelectOrder}
              </Flex>
            )}
          </>
        )}

        {/* editable notes */}
        {notesGrid.map((row, index) => {
          return (
            <div key={"row-" + index}>
              {row
                .filter((note) => note.isEditing)
                .map((note) => {
                  return (
                    <Note
                      key={"note-" + note.id}
                      notes={book.notes || []}
                      note={note}
                      isEditing
                    />
                  );
                })}
            </div>
          );
        })}

        {/* readonly notes */}
        {!hasEditing &&
          notesGrid.map((row, index) => {
            return (
              <div key={"note-" + index}>
                {row
                  .filter((note) => !note.isEditing)
                  .map((note, index) => {
                    return (
                      <Note
                        key={"note-" + index + note.id}
                        notes={book.notes || []}
                        note={{ ...note, index }}
                      />
                    );
                  })}
              </div>
            );
          })}

        {/* add note button */}
        {!hasEditing && Array.isArray(book.notes) && book.notes.length > 1 && (
          <div style={{ textAlign: "center" }}>
            <AddNoteButton book={book} setBook={setBook} />
          </div>
        )}
      </main>
    </div>
  );
};

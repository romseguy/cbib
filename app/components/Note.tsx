import { css } from "@emotion/react";
import { Badge, Button } from "@radix-ui/themes";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editNote, postNotes } from "~/api";
import {
  BackButton,
  Flex,
  LocaleSwitch,
  NoteFooter,
  NoteHeaderLeft,
  NoteHeaderRight,
  RTEditor,
  UserIcon,
  useToast,
} from "~/components";
import { getState, setState } from "~/store";
import {
  localize,
  toCss,
  toUsername,
  user_badge_click,
  type NoteT,
  type User,
} from "~/utils";

interface NoteP {
  notes: NoteT[];
  note: NoteT;
  user?: User | null;
  isEditing?: boolean;
}

export const Note = (props: NoteP) => {
  const { notes, note, isEditing = false } = props;
  const { auth, book, isMobile, locale } = useSelector(getState);
  const user = auth?.user;

  const [isAddComment, setIsAddComment] = useState(false);
  const [isShowComments, setIsShowComments] = useState(false);
  const desc =
    (locale === "en" ? note.desc_en : note.desc) ||
    `<i>${
      locale === "en"
        ? note.desc
          ? "Quote is in french only, click the French flag icon above to read it"
          : "Empty quote"
        : "Aucun texte"
    }</i>`;
  // locale === "en"
  //   ? note.desc_en
  //     ? note.desc_en
  //     : note.desc
  //     ? "<p>You can translate the text below :</p><p>&nbsp;</p>" + note.desc
  //     : "No english translation"
  //   : note.desc;
  const editor = (locale: string) => {
    return (
      <RTEditor
        defaultValue={desc}
        onChange={({ html }) => {
          note[`desc${locale === "en" ? "_en" : ""}`] = html;
        }}
      />
    );
  };

  const dispatch = useDispatch<any>();
  const setBook = (b) => dispatch(setState({ book: b }));
  //const [executeScroll, elementToScrollRef] = useScroll<HTMLDivElement>();
  const showToast = useToast();

  async function onSubmit(note) {
    try {
      let id;

      if (!note.id) {
        const { data, error } = await dispatch(
          postNotes.initiate({
            note: {
              book_id: book.id,
              [`desc${locale === "en" ? "_en" : ""}`]:
                note[locale === "en" ? "desc_en" : "desc"],
            },
          }),
        );
        if (data.error) throw new Error(data.error);
        id = data.id;
      } else {
        const { data, error } = await dispatch(
          editNote.initiate({
            note: {
              id: note.id,
              book_id: book.id,
              [`desc${locale === "en" ? "_en" : ""}`]:
                note[locale === "en" ? "desc_en" : "desc"],
            },
          }),
        );
        if (data.error) throw new Error(data.error);
      }

      setBook({
        ...book,
        notes: book.notes?.map((n) => {
          if (n.id === note.id)
            return {
              ...note,
              id: id || note.id,
              isNew: false,
              isEditing: false,
              note_email: user.email,
            };
          return n;
        }),
      });
    } catch (error) {
      showToast(error, true);
    }
  }

  return (
    <>
      <section>
        {/* note header */}
        <header>
          {isEditing && (
            <Flex gap="3">
              {note.isNew
                ? localize("Nouvelle citation", "New quote")
                : localize("Modifiez cette citation", "Edit this quote")}
              {/* <LocaleSwitch
                setLocale={(locale) => dispatch(setState({ locale }))}
              /> */}
            </Flex>
          )}

          {!isEditing && (
            <>
              {/* note header */}
              {isMobile && (
                <Flex
                  direction="column"
                  css={css`
                    button {
                      margin-bottom: 12px;
                    }
                  `}
                >
                  <NoteHeaderLeft notes={notes} note={note} />
                  <NoteHeaderRight note={note} />
                </Flex>
              )}

              {!isMobile && (
                <Flex justify="between">
                  <NoteHeaderLeft notes={notes} note={note} />

                  <Flex>{/* CENTER */}</Flex>

                  <NoteHeaderRight note={note} />
                </Flex>
              )}
            </>
          )}
        </header>

        {/* note desc */}
        <main
          key={"note-" + note.id}
          css={css`
            padding: ${isMobile ? "0px" : "6px"};
            ${isEditing ? "min-height: 250px;" : ""}
            ${!isEditing ? "overflow-y: scroll" : ""}
          `}
        >
          {isEditing && editor(locale)}
          {!isEditing && (
            <>
              <Badge variant="surface" onClick={() => alert(user_badge_click)}>
                <UserIcon />
                {toUsername(note.note_email) ||
                  localize("Anonyme", "Anonymous")}
              </Badge>
              <div
                dangerouslySetInnerHTML={{
                  __html: desc,
                }}
              />
            </>
          )}
        </main>

        {/* comments */}
        {!note.isNew && (
          <NoteFooter
            note={note}
            isAddComment={isAddComment}
            setIsAddComment={setIsAddComment}
            isShowComments={isShowComments}
            setIsShowComments={setIsShowComments}
          />
        )}
      </section>

      {isEditing && (
        <div
          css={toCss({
            display: "flex",
            justifyContent: "space-between",
            background: "rgba(255,255,255,0.1)",
            marginBottom: "12px",
            padding: "6px",
          })}
        >
          <BackButton
            onClick={() => {
              setBook({
                ...book,
                notes: book.notes
                  ?.filter((n) => {
                    if (!note.isNew) return true;
                    return n.id !== note.id;
                  })
                  .map((n) => ({
                    ...n,
                    isEditing: false,
                  })),
              });
            }}
          >
            Annuler
          </BackButton>

          <Button onClick={() => onSubmit(note)}>Valider</Button>
        </div>
      )}
    </>
  );
};

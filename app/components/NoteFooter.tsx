import {
  ArrowRightIcon,
  ArrowUpIcon,
  ChatBubbleIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postComments } from "~/api";
import { BackButton, Comment, Flex, iconProps, useToast } from "~/components";
import { getState, setState } from "~/store";
import { localize, toCss } from "~/utils";

export const NoteFooter = (props) => {
  const {
    note,
    isAddComment,
    setIsAddComment,
    isShowComments,
    setIsShowComments,
  } = props;
  const { book } = useSelector(getState);
  const [comment, setComment] = useState<{ html: string }>();

  const dispatch = useDispatch<any>();
  const setBook = (b) => dispatch(setState({ book: b }));
  const showToast = useToast();

  async function onSubmitCommentClick(comment) {
    try {
      const { data, error } = await dispatch(
        postComments.initiate({
          comment: {
            ...comment,
            note_id: note.id,
          },
        }),
      );

      if (data.error) throw new Error(data.error);

      // if (data.error) {
      //   if (process.env.NODE_ENV === "development") {
      //     let r = rand();
      //     while (
      //       !!note.comments?.find(
      //         ({ id }) => id === r.toString(),
      //       )
      //     ) {
      //       r = rand();
      //     }
      //     data = {
      //       ...comment,
      //       id: r.toString(),
      //       comment_email: user.email,
      //       created_at: new Date().toISOString(),
      //     };
      //   } else {
      //     showToast(data.message);
      //     return;
      //   }
      // }

      setBook({
        ...book,
        notes: book.notes?.map((n) => {
          if (n.id === note.id) {
            return {
              ...n,
              comments: (n.comments || []).concat([data]),
            };
          }
          return n;
        }),
      });
    } catch (error) {
      showToast(error, true);
    }
  }

  return (
    <footer>
      {!note.isEditing && (
        <Flex
          onClick={async () => {
            setIsShowComments(!isShowComments);
            if (!isShowComments) {
              // setTimeout(() => {
              //   executeScroll();
              // }, 100);
            }
          }}
        >
          {!isAddComment && (
            <>
              <Button
                variant="soft"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isAddComment) {
                    setIsAddComment(true);
                    //setIsShowComments(false);
                    // setTimeout(() => {
                    //   executeScroll();
                    // }, 200);
                  }
                }}
              >
                <PlusCircledIcon
                  className="add-icon"
                  {...iconProps({
                    title: localize("Ajouter un commentaire", "Add a comment"),
                  })}
                />
                {localize("Ajouter un commentaire", "Add a comment")}
              </Button>
            </>
          )}

          {Array.isArray(note.comments) && note.comments.length > 0 && (
            <Button>
              <ChatBubbleIcon className="chat-icon" />
              {note.comments.length}
              {isShowComments ? (
                <ArrowUpIcon
                  className="icon"
                  {...iconProps({
                    title: localize(
                      "Ouvrir la zone des commentaires",
                      "Open comments area",
                    ),
                  })}
                />
              ) : (
                <ArrowRightIcon
                  className="icon"
                  {...iconProps({
                    title: localize(
                      "Fermer la zone des commentaires",
                      "Close comments area",
                    ),
                  })}
                />
              )}
            </Button>
          )}
        </Flex>
      )}

      {isAddComment && (
        <div>
          <textarea
            autoFocus
            css={toCss({ width: "98%", height: "150px" })}
            placeholder="Écrivez ici votre commentaire"
            onChange={(e) => setComment({ html: e.target.value })}
          />
          <div
            css={toCss({
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "12px",
              padding: "6px",
            })}
          >
            <BackButton
              label="Annuler"
              onClick={() => {
                setIsAddComment(false);
              }}
            >
              Annuler
            </BackButton>

            <Button
              onClick={() => {
                setIsAddComment(false);
                setIsShowComments(true);
                onSubmitCommentClick(comment);
              }}
            >
              Valider
            </Button>
          </div>
        </div>
      )}

      {!note.isNew && isShowComments && (
        <div css={toCss({ background: "rgba(255, 255, 255, 0.2)" })}>
          {note.comments?.map((c, i) => {
            return (
              <Comment
                key={c.id}
                css={toCss({
                  borderBottom:
                    i !== (note.comments?.length || 0) - 1
                      ? "1px solid white"
                      : "",
                })}
                comment={c}
              />
            );
          })}
        </div>
      )}
      {/* <div ref={elementToScrollRef} /> */}
    </footer>
  );
};

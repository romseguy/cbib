import { css } from "@emotion/react";
import {
  Badge,
  Box,
  Button,
  Heading,
  Switch,
  TextArea,
} from "@radix-ui/themes";
import { MailTo, MailToBody, MailToTrigger } from "@slalombuild/react-mailto";
import { decode } from "html-entities";
import { lazy, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteComment, postComments } from "~/api";
import {
  BackButton,
  bookTitle,
  Comment,
  DonateButton,
  EmailIcon,
  Flex,
  Input,
  useToast,
} from "~/components";
import { getState, setState } from "~/store";
import { localize, type Book, type BookT, type Lib, type NoteT } from "~/utils";

const Login = lazy(() => import("~/components/Login"));
type Match = { bookIds?: string[]; notes?: { id: string; desc: string }[] };
type Matches = Record<string, Match>;
const sanitize = (str) => decode(str.replace(/(<([^>]+)>)/gi, ""));

const SearchModal = () => {
  const { libs, keyword, locale } = useSelector(getState);
  const matches = useMemo(() => {
    //let matches: Match[] = [];
    let map: Matches = {};

    if (keyword) {
      for (const lib of libs) {
        if ((lib[localize("name")] || lib.name).includes(keyword))
          map = { ...map, [lib.id]: {} };

        for (const book of lib.books || []) {
          if ((book[localize("title")] || book.title || "").includes(keyword))
            map = {
              ...map,
              [lib.id]: {
                ...map[lib.id],
                bookIds: (map[lib.id]?.bookIds || []).concat([book.id]),
              },
            };

          for (const note of book.notes || []) {
            const desc = sanitize(note[localize("desc")] || note.desc);
            if (desc.includes(keyword)) {
              map = {
                ...map,
                [lib.id]: {
                  ...map[lib.id],
                  notes: (map[lib.id]?.notes || []).concat([
                    { id: note.id, desc },
                  ]),
                },
              };

              if (!(map[lib.id]?.bookIds || []).includes(note.book_id))
                map = {
                  ...map,
                  [lib.id]: {
                    ...map[lib.id],
                    bookIds: (map[lib.id]?.bookIds || []).concat([
                      note.book_id,
                    ]),
                  },
                };
            }
          }
        }
      }
    }

    return map;
  }, [keyword]);
  if (!keyword) return null;
  console.log("🚀 ~ matches ~ matches:", matches);
  return (
    <div id="modal">
      <Box
        css={css`
          text-align: center;
        `}
      >
        <Heading>
          {localize(
            `Résultats de la recherche pour le mot-clé : `,
            `Search results for the keyword : `,
          )}
          <i>{keyword}</i>
        </Heading>

        <Flex direction="column">
          {Object.keys(matches).map((key) => {
            const match = matches[key] as Match;
            const matchedLib = libs.find(({ id }) => id === key) || ({} as Lib);
            let out = (
              <>{matchedLib[localize("name")] || matchedLib.name || ""}</>
            );

            if (match.bookIds) {
              out = (
                <>
                  <Flex>
                    In the library : <i>{out}</i>
                  </Flex>

                  <Flex direction="column">
                    {match.bookIds.map((bookId) => {
                      const matchedBook =
                        matchedLib?.books?.find(({ id }) => id === bookId) ||
                        ({} as BookT);
                      const book_title =
                        matchedBook[localize("title")] || matchedBook.title;

                      return (
                        <Flex direction="column">
                          <Flex>
                            {book_title ? (
                              <>
                                {localize("Dans le livre : ", "In the book : ")}
                                <i>{book_title}</i>
                              </>
                            ) : (
                              <i>{`In the ${bookTitle(
                                matchedBook,
                              ).toLowerCase()}`}</i>
                            )}
                          </Flex>

                          {match.notes?.map((note) => {
                            const matchedNote = matchedBook.notes?.find(
                              ({ id }) => id === note.id,
                            );
                            if (matchedNote) {
                              const keywordIndex = note.desc.indexOf(keyword);
                              const start = keywordIndex - 20;
                              const end = keywordIndex + 20;
                              let __html = note.desc
                                .substring(
                                  start < 0 ? 0 : start,
                                  end > note.desc.length
                                    ? note.desc.length
                                    : end,
                                )
                                .replace(
                                  keyword,
                                  `<b><a href="${
                                    locale === "fr" ? "/c/" : "/q/"
                                  }${note.id}">${keyword}</a></b>`,
                                );
                              __html =
                                start > 1
                                  ? "..." + __html
                                  : end < note.desc.length
                                  ? __html + "..."
                                  : __html;

                              return (
                                <div
                                  className="prose"
                                  dangerouslySetInnerHTML={{ __html }}
                                />
                              );
                            }
                          })}
                        </Flex>
                      );
                    })}
                  </Flex>
                </>
              );
            }
            return <>{out}</>;
          })}
        </Flex>
      </Box>
    </div>
  );
};

export type ModalProps = {
  id: string;
  isOpen: boolean;
  book?: Book | null;
  note?: NoteT | null;
  email?: string | null;
};

export const Modal = (props) => {
  const { i18n } = props;
  const { collections, libs, isMobile, keyword, modal } = useSelector(getState);
  const comments = collections.comments.filter(
    ({ is_feedback }) => is_feedback,
  );
  const { id, book, note } = modal;
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const dispatch = useDispatch<any>();
  const showToast = useToast();
  const toggleModal = useToggleModal();

  if (keyword) {
    return <SearchModal />;
  } else if (id === "share-modal" && book && note)
    return (
      <div id="modal">
        <div id={id}>
          <Flex direction="column" justify="center" gap="3">
            <Heading>
              {localize("Partager la citation", "Share the quote")}{" "}
              {note.page ? "p." + note.page : ""}
            </Heading>

            <MailTo
              to=""
              subject={`Citation ${note.page ? "p." + note.page : ""} du ${
                book.title
                  ? ""
                  : note.index === 0
                  ? "premier"
                  : typeof note.index === "number"
                  ? Number(note.index + 1) + "ème"
                  : ""
              }${
                book.title
                  ? " livre : " + book.title
                  : " livre de la bibliothèque : " + props.loaderData.lib.name
              } `}
              obfuscate
            >
              <MailToTrigger>
                {localize("Envoyer par mail", "Send by email")}
              </MailToTrigger>
              <MailToBody>
                - Citation du livre {""} :
                <br />
                <br />
                {sanitize(note.desc)}
              </MailToBody>
            </MailTo>

            <Button
              size="4"
              onClick={() => {
                navigator.clipboard.writeText(
                  import.meta.env.VITE_PUBLIC_URL + "/q/" + note!.id,
                );
                showToast(
                  localize(
                    "Le lien a été copié dans votre presse-papiers",
                    "The link has been copied to your clipboard",
                  ),
                );
              }}
            >
              {localize("Copier le lien", "Copy link to clipboard")}
            </Button>

            <BackButton size="3" onClick={() => toggleModal(id)} />
          </Flex>
        </div>
      </div>
    );
  else if (id === "notif-modal")
    return (
      <div id="modal">
        <div id={id}>
          <Flex direction="column" justify="center" gap="3">
            <Flex>
              <BackButton onClick={() => toggleModal(id)} />
              {/* <DonateButton /> */}
            </Flex>

            <Heading>Notifications</Heading>

            <Flex
              direction={isMobile ? "column" : "row"}
              css={css`
                position: relative;
              `}
            >
              {!modal.email ? (
                <>
                  <Flex
                    css={css`
                      position: absolute;
                      top: 0;
                      left: 0;
                      width: 2.5em;
                      height: 2.5em;
                      font-size: 18px;
                      color: black;
                      svg {
                        flex-shrink: 0;
                        padding: 0 12px;
                      }
                    `}
                  >
                    <EmailIcon />
                  </Flex>
                  <Input
                    autoFocus
                    name="email"
                    type="email"
                    readOnly={!!modal.email}
                    value={email || modal.email || ""}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </>
              ) : (
                <>
                  {localize(
                    "Seront envoyées à votre adresse e-mail",
                    "Will be send to your email address",
                  )}{" "}
                  : <Badge variant="solid">{modal.email}</Badge>
                </>
              )}
            </Flex>

            <h2>{localize("Quand ?", "When?")}</h2>

            <Flex>
              <label>{localize("Quotidienne", "Daily")}</label>
              <Switch
                checked={false}
                onCheckedChange={(checked) => {
                  if (checked) {
                    alert(
                      localize(
                        "Si vous trouvez cette fonctionnalité intéressante, merci d'envoyer un mail à " +
                          import.meta.env.VITE_PUBLIC_EMAIL +
                          " pour m'en parler.",
                        "If you are intested in this improvement, please send an email to " +
                          import.meta.env.VITE_PUBLIC_EMAIL +
                          " to let me know.",
                      ),
                    );
                  }
                }}
              />
            </Flex>

            <Flex>
              <label>{localize("Hebdomadaire", "Weekly")}</label>
              <Switch
                checked={false}
                onCheckedChange={(checked) => {
                  if (checked) {
                    alert(
                      localize(
                        "Si vous trouvez cette fonctionnalité intéressante, merci d'envoyer un mail à " +
                          import.meta.env.VITE_PUBLIC_EMAIL +
                          " pour m'en parler.",
                        "If you are intested in this improvement, please send an email to " +
                          import.meta.env.VITE_PUBLIC_EMAIL +
                          " to let me know.",
                      ),
                    );
                  }
                }}
              />
            </Flex>
          </Flex>
        </div>
      </div>
    );
  else if (id === "login-modal")
    return (
      <div id="modal">
        <div id={id}>
          <Login showToast={showToast} toggleModal={toggleModal} i18n={i18n} />
        </div>
      </div>
    );
  else if (id === "heart-modal")
    return (
      <div id="modal">
        <div id={id}>
          <Flex direction="column" justify="center" gap="3">
            <Flex>
              <BackButton onClick={() => toggleModal(id)} />
              {/* <DonateButton /> */}
            </Flex>

            <Flex>
              <Heading>
                {localize(
                  "Écrivez un message pour suggérer des améliorations",
                  "Write a message to suggest improvements",
                )}
              </Heading>
            </Flex>

            <TextArea
              autoFocus
              cols={80}
              value={message}
              placeholder={localize("Écrivez ici", "Write here")}
              onChange={(e) => setMessage(e.target.value)}
            />

            <Flex>
              <Button
                onClick={async () => {
                  try {
                    const comment = { html: message, is_feedback: true };
                    const { data } = await dispatch(
                      postComments.initiate({
                        comment,
                      }),
                    );

                    if (data.error) throw new Error(data.error);

                    setMessage("");

                    dispatch(
                      setState({
                        collections: {
                          ...collections,
                          comments: collections.comments.concat([data]),
                        },
                      }),
                    );
                  } catch (error: any) {
                    showToast(error, true);
                  }
                }}
              >
                {localize("Envoyer", "Send")}
              </Button>

              <MailTo
                to={import.meta.env.VITE_PUBLIC_EMAIL}
                subject={localize("Amélioration", "Improvement")}
                obfuscate
              >
                <MailToTrigger>
                  {localize("Envoyer par e-mail", "Send by email")}
                </MailToTrigger>
                <MailToBody>{sanitize(message)}</MailToBody>
              </MailTo>
            </Flex>

            <Flex direction="column" width="100%" justify="center">
              {comments.map((comment) => (
                <Comment
                  key={"comment-" + comment.id}
                  width="100%"
                  comment={comment}
                  onDeleteClick={async (comment) => {
                    try {
                      const { data, error } = await dispatch(
                        deleteComment.initiate({
                          url: "/comment?id=" + comment.id,
                        }),
                      );
                      if (data.error) throw new Error(data.error);

                      dispatch(
                        setState({
                          collections: {
                            ...collections,
                            comments: collections.comments.filter(
                              ({ id }) => id !== comment.id,
                            ),
                          },
                        }),
                      );
                    } catch (error) {
                      showToast(error, true);
                    }
                  }}
                />
              ))}
            </Flex>
          </Flex>
        </div>
      </div>
    );

  return null;
};

export const useToggleModal = () => {
  const dispatch = useDispatch<any>();
  const { modal } = useSelector(getState);
  return (id = "login-modal", props = {}) =>
    dispatch(
      setState({
        modal: {
          id,
          isOpen: modal.id !== id ? true : !modal.isOpen,
          ...props,
        },
      }),
    );
};

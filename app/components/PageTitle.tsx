import { css } from "@emotion/react";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import {
  Box,
  Button,
  Heading,
  IconButton,
  Select,
  Spinner,
} from "@radix-ui/themes";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import {
  BooksIcon,
  Flex,
  LocaleSwitch,
  UserIcon,
  useToggleModal,
} from "~/components";
import { tokenKey } from "~/lib/supabase/tokenKey";
import { getState, setState } from "~/store";
import { localize, type Lib } from "~/utils";

export const PageTitle = () => {
  const { auth, isMobile, isLoaded, lib, libs, locale } = useSelector(getState);
  const user = auth?.user;
  const [item, setItem] = useState("0");
  const libsGroupedByAuthor = useMemo(() => {
    if (!libs) {
    }
    const rows = [...libs].sort((a, b) => (a.author > b.author ? 1 : -1));
    let els: Record<string, Lib[]> = {};
    for (const row of rows) {
      if (row.isVisible === false) continue;
      els[row.author] = (els[row.author] || []).concat([row]);
    }
    return els;
  }, [libs]);

  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const location = useLocation();
  const toggleModal = useToggleModal();

  const LoginButton = (
    <>
      {isLoaded && (
        <Button
          className="with-icon"
          type="button"
          onClick={async (e) => {
            e.stopPropagation();

            if (user) {
              const ok = confirm(
                localize(
                  "Êtes-vous sûr de vouloir vous déconnecter?",
                  "Do you really want to log out?",
                ),
              );
              if (ok) {
                dispatch(setState({ auth: undefined }));
                localStorage.removeItem(tokenKey);
              }
            } else {
              toggleModal();
            }
          }}
        >
          <UserIcon />
          {user ? <div>{user.email}</div> : localize("Connexion", "Login")}
        </Button>
      )}
      {!isLoaded && <Spinner />}
    </>
  );

  return (
    <Flex
      id="page-title"
      className="bg-purple-900/50"
      direction="column"
      gap="3"
    >
      <Heading
        onClick={() => {
          navigate("/");
        }}
      >
        {localize("Cassiopaea Bibliotheca", "Cassiopaea Bibliotheca")}
      </Heading>

      <Flex direction={isMobile ? "column" : "row"}>
        {!isMobile && <BooksIcon className="books-icon" fill="white" />}

        <Select.Root
          value={item}
          onValueChange={(value) => {
            //setItem(value);
            if (value === "1") {
              alert(
                localize(
                  `Si vous voulez accéder à des citations classées par thématiques, merci d'envoyer un mail à ${
                    import.meta.env.VITE_PUBLIC_EMAIL
                  } pour me le faire savoir.`,
                  `If you are interested in having quotes grouped by topics, please send an email to ${
                    import.meta.env.VITE_PUBLIC_EMAIL
                  } to let me know.`,
                ),
              );
            }
          }}
        >
          <Select.Trigger variant="classic" />
          <Select.Content>
            <Select.Item value="0">
              {localize("Bibliothèques", "Libraries")}
            </Select.Item>
            <Select.Item value="1">
              {localize("Thématiques", "Topics")}
            </Select.Item>
          </Select.Content>
        </Select.Root>

        <Flex>
          {item === "0" && (
            <Select.Root
              defaultValue={lib[localize("name")] || lib.name}
              onValueChange={(value) => {
                const newLib = libs.find(
                  (lib) => (lib[localize("name")] || lib.name) === value,
                );
                dispatch(
                  setState({
                    //book: null,
                    lib: newLib,
                  }),
                );
                if (location.pathname !== "/") navigate("/");
              }}
            >
              <Select.Trigger
                className="lib-select"
                placeholder={localize(
                  "Choisir une bibliothèque",
                  "Pick a library",
                )}
                variant="classic"
              />
              <Select.Content
                css={css`
                  * {
                    margin: 0;
                    padding: 3px;
                  }
                `}
              >
                {Object.keys(libsGroupedByAuthor).map((author, i) => (
                  <Select.Group key={"author" + i}>
                    <Select.Label>{author}</Select.Label>
                    {(libsGroupedByAuthor[author] || []).map((l) => (
                      <Select.Item
                        key={"lib-" + l.id}
                        value={l[localize("name")] || l.name}
                      >
                        {l[localize("name")] || l.name}
                      </Select.Item>
                    ))}
                  </Select.Group>
                ))}
              </Select.Content>
            </Select.Root>
          )}

          <IconButton
            onClick={() => {
              alert(
                localize(
                  "Pour ajouter une bibliothèque, envoyez un e-mail à " +
                    import.meta.env.VITE_PUBLIC_EMAIL +
                    "",
                  "To add a library, send an email to " +
                    import.meta.env.VITE_PUBLIC_EMAIL +
                    "",
                ),
              );
            }}
            variant="surface"
          >
            <PlusCircledIcon />
          </IconButton>
        </Flex>
      </Flex>

      <Flex>
        {LoginButton}

        {/* <LocaleSwitch
          width={"2em"}
          height={"2em"}
          onClick={(e) => {
            e.stopPropagation();
            window.location.replace(
              locale === "en"
                ? "https://cbib.romseguy.com"
                : "https://knowmyquotes.com",
            );
          }}
        /> */}
      </Flex>
    </Flex>
  );
};

{
  /* <Select.Root
          defaultValue={item}
          onOpenChange={(open) => {
            if (open)
              alert(
                localize(
                  `Si vous voulez avoir les bibliothèques classées par catégories, merci d'envoyer un mail à ${
                    import.meta.env.VITE_PUBLIC_EMAIL
                  } pour me le faire savoir.`,
                  `If you are interested in having quotes grouped by categories, please send an email to ${
                    import.meta.env.VITE_PUBLIC_EMAIL
                  } to make me know.`,
                ),
              );
          }}
        >
          <Select.Trigger variant="classic" />
          <Select.Content>
            <Select.Item value="0">
              {localize("Catégories", "Categories")}
            </Select.Item>
          </Select.Content>
        </Select.Root> */
}

import { css } from "@emotion/react";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Slider, Spinner } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Flex, NoteTitle } from "~/components";
import { getState } from "~/store";
import { createLocalize, toCssString } from "~/utils";

export const Note = () => {
  //#region state
  const { lib, book, note, locale, screenWidth } = useSelector(getState);
  const localize = createLocalize(locale);
  const [lineHeight, setLineHeight] = useState(2);
  const [size, setSize] = useState(16);
  const [width, setWidth] = useState(screenWidth);
  const [isLoaded, setIsLoaded] = useState(false);

  const desc =
    (locale === "en" ? note.desc_en : note.desc) ||
    `<i>${
      locale === "en"
        ? note.desc
          ? `Quote is in french only, <a href='/c/${note.id}'>click here to read it in french`
          : "Empty quote"
        : "Aucun texte"
    }</i>`;
  //#endregion

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div id="note-page">
      <header>
        <NoteTitle lib={lib} book={book} note={note} />

        {/* sliders */}
        <Flex
          direction="column"
          align="start"
          gap="3"
          style={{
            // borderBottom: "1px solid white",
            // borderTop: "1px solid white",
            padding: "12px",
            paddingTop: "0",
          }}
        >
          {/* <Button className="with-icon" onClick={() => setIsDark(!isDark)}>
              {isDark ? (
                <>
                  <SunIcon />
                  Utiliser le thème clair
                </>
              ) : (
                <>
                  <MoonIcon />
                  Utiliser le thème sombre
                </>
              )}
            </Button> */}

          <Flex>
            <InfoCircledIcon stroke="lightblue" />
            {localize("Taille du texte", "Font size")}
          </Flex>
          {isLoaded ? (
            <Slider
              defaultValue={[16]}
              min={6}
              max={72}
              step={1}
              onValueChange={(v) => {
                setSize(Number(v[0]));
              }}
            />
          ) : (
            <Spinner />
          )}

          <Flex>
            <InfoCircledIcon stroke="lightblue" />
            {localize("Largeur du texte", "Text width")}
          </Flex>
          {isLoaded ? (
            <Slider
              defaultValue={[screenWidth]}
              min={screenWidth / 3}
              max={screenWidth}
              step={1}
              onValueChange={(v) => {
                setWidth(Number(v[0]));
              }}
            />
          ) : (
            <Spinner />
          )}

          <Flex>
            <InfoCircledIcon stroke="lightblue" />
            {localize("Espace entre les lignes", "Space between lines")}
          </Flex>
          {isLoaded ? (
            <Slider
              defaultValue={[2]}
              min={0.1}
              max={10}
              step={0.1}
              onValueChange={(v) => {
                setLineHeight(Number(v[0]));
              }}
            />
          ) : (
            <Spinner />
          )}
        </Flex>
      </header>

      <main
        className="prose"
        css={css`
          font-size: ${size}px;
          line-height: ${lineHeight};
          width: ${width > screenWidth ? screenWidth : width}px;
          max-width: ${screenWidth}px;
          text-align: justify;
        `}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: desc,
          }}
        />
      </main>
    </div>
  );
};

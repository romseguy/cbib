import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { BackButton, Flex } from "~/components";
import { getState } from "~/store";
import { createLocalize } from "~/utils";

export const NoteTitle = (props) => {
  const { lib, book, note } = props;
  const { locale } = useSelector(getState);
  const localize = createLocalize(locale);
  const navigate = useNavigate();

  return (
    <Flex p="3">
      <BackButton
        label={localize("Retour", "Back")}
        style={{ marginRight: "6px" }}
        onClick={() =>
          navigate("/" + localize("livre", "book") + "/" + book.id)
        }
      />

      <h2>
        {localize("Citation", "Quote")} {note.page && `p.${note.page} `}
        {book.title ? (
          <>
            {book.is_conf && (
              <>
                {localize("de la conférence", "from the talk show")} :{" "}
                <i>
                  {book.title} ({lib[localize("name")] || lib.name})
                </i>
              </>
            )}
            {!book.is_conf && (
              <>
                {localize("du livre", "from book")} :{" "}
                <i>
                  {book[localize("title")]} ({lib[localize("name")]})
                </i>
              </>
            )}
          </>
        ) : (
          <>
            {localize("du", "from the")}{" "}
            {book.index === 0
              ? localize("Premier", "First")
              : book.index === 1
              ? `${book.index + 1}${localize("ème", "nd")}`
              : book.index === 2
              ? book.index + localize("ème", "rd")
              : book.index + localize("ème", "th")}
            <span> </span>
            {book.is_conf
              ? localize("conférence", "talk show")
              : localize("livre", "book")}
            <span> </span>
            {localize("de la bibliothèque", "in the library")} :<span> </span>
            <i>{lib[localize("name")] || lib.name}</i>
            {/* du {book?.id === 1 ? "premier" : book?.id + "ème"} livre de la
            bibliothèque : <i>{lib?.name}</i> */}
          </>
        )}
      </h2>
    </Flex>
  );
};

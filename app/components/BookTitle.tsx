import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { useSelector } from "react-redux";
import { BookIcon } from "~/components";
import { getState } from "~/store";
import { localize, type BookT } from "~/utils";

export const bookTitle = (book: BookT) => `
  ${
    book.index === 0
      ? localize("Premier", "First")
      : book.index === 1
      ? `${book.index + 1}${localize("ème", "nd")}`
      : book.index === 2
      ? book.index + localize("ème", "rd")
      : book.index + localize("ème", "th")
  }
  ${
    book.is_conf
      ? " " + localize("conférence", "talk show")
      : " " + localize("livre", "book")
  }`;

export const BookTitle = (props) => {
  const { lib, book, isMobile } = useSelector(getState);
  return (
    <>
      {book.title && (
        <>
          {book.is_conf ? (
            <h1>
              <ChatBubbleIcon width={30} height={30} />
              {localize("Conférence", "Talk show")}
              {!isMobile && <span> : </span>}
            </h1>
          ) : (
            <BookIcon />
          )}

          {book.title && (
            <h2>
              <i>{book[localize("title")] || book.title}</i>
            </h2>
          )}
        </>
      )}

      {!book.title && (
        <>
          <h2>
            {book.is_conf ? <ChatBubbleIcon /> : <BookIcon />}
            {bookTitle(book)}
            {" " + localize("de la bibliothèque", "in the library")} :
          </h2>
          <h1>
            <i>{lib[localize("name")] || lib.name}</i>
          </h1>
        </>
      )}
    </>
  );
};

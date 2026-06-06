import { css } from "@emotion/react";
import { Box } from "@radix-ui/themes";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { Book1Icon, bookTitle, Flex, LibTitle } from "~/components";
import { getState } from "~/store";
import { localize } from "~/utils";
Array.prototype.orderBy = function (selector, desc = false) {
  return [...this].sort((a, b) => {
    a = selector(a);
    b = selector(b);

    if (a == b) return 0;
    return (desc ? a > b : a < b) ? -1 : 1;
  });
};

export const PageHeader = (props) => {
  const { isMobile, book, lib } = useSelector(getState);
  const navigate = useNavigate();
  const books = (lib.books || []).orderBy(
    ({ pos }) => (!pos ? -1 : parseInt(pos)),
    true,
  );
  return (
    <div id="page-header">
      {!isMobile && (
        <Box ml="1">
          <Flex>
            <LibTitle lib={lib} />
          </Flex>
        </Box>
      )}

      {/* books list */}
      <Flex gap="0" overflowX="scroll">
        {books.map((b, index) => {
          const to = "/" + localize("livre", "book") + "/" + b.id;
          return (
            <div
              key={"book-" + index}
              className="book"
              css={css`
                ${b.src && "background: url(" + b.src + ");"}
                border: ${b.id === book?.id
                  ? "1px solid yellow"
                  : "1px solid white"};
              `}
              onClick={() => {
                navigate(to);
              }}
            >
              {!b.src && (
                <Flex direction="column">
                  <Book1Icon />
                  <Link to={to}>
                    {b.title ? b[localize("title")] || b.title : bookTitle(b)}
                  </Link>
                </Flex>
              )}
            </div>
          );
        })}
      </Flex>
    </div>
  );
};

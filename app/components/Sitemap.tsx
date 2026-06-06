import React from "react";
import { useParams } from "react-router";
import { Link, useLocation, useRoutes, type RouteObject } from "react-router";
import { localize } from "~/utils";

export const Sitemap = (props) => {
  // console.log("🚀 ~ Sitemap ~ props:", props);
  const location = useLocation();
  // console.log("🚀 ~ Sitemap ~ location:", location);
  const params = useParams();
  // console.log("🚀 ~ params:", params);
  const {
    loaderData: { libs, lib, book },
  } = props;
  const routes: RouteObject[] = [
    {
      path: "/*",
      element: React.createElement(() => (
        <ul>
          {libs.map((lib) =>
            lib.books.map((book, index) => (
              <li key={book.id}>
                <Link to={"/" + localize("livre", "book") + "/" + book.id}>
                  {book.title ||
                    "Livre " +
                      Number(index + 1) +
                      " de la bibliothèque " +
                      lib.name}
                </Link>
              </li>
            )),
          )}
        </ul>
      )),
    },
    {
      path: "book/:id",
      element: React.createElement(() => (
        <ul>
          {book &&
            book.notes?.map((note) => (
              <li
                key={note.id}
                dangerouslySetInnerHTML={{
                  __html: note.desc_en ? note.desc_en : note.desc,
                }}
              />
            ))}
        </ul>
      )),
    },
    {
      path: "livre/:id",
      element: React.createElement(() => (
        <ul>
          {book &&
            book.notes?.map((note) => (
              <li
                key={note.id}
                dangerouslySetInnerHTML={{ __html: note.desc }}
              />
            ))}
        </ul>
      )),
    },
  ];
  return <main>{useRoutes(routes)}</main>;
};

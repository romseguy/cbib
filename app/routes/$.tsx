import { isbot } from "isbot";
import { Provider } from "react-redux";
import { useLocation, useRoutes } from "react-router";
import { Sitemap } from "~/components";
import { Livre } from "~/routes/Livre";
import { Note } from "~/routes/Note";
import { createStore } from "~/store";
import { type AppState } from "~/utils";
import { loader as rootLoader } from "./_index";
import Page from "./Page";
import previousLocation from "./previousLocation";

export const loader = async (props) => {
  const [, entity, id] = new URL(props.request.url).pathname.split("/");

  if (
    !entity ||
    entity === ".well-known" ||
    typeof id === "undefined" ||
    !["livre", "book", "c", "q"].includes(entity)
  )
    throw new Response("", {
      status: 404,
      statusText: "La page n'a pas été trouvée",
    });

  const app: AppState = await rootLoader(props);

  if (["livre", "book"].includes(entity)) {
    for (const lib of app.libs) {
      let index = 0;
      for (const b of lib.books || []) {
        if (b.id === id) {
          app.lib = lib;
          app.book = { ...b, index };
        }
        index++;
      }
    }
    if (!app.book)
      throw new Response("", {
        status: 404,
        statusText: "Le livre n'a pas été trouvé",
      });
  } else if (["c", "q"].includes(entity)) {
    for (const lib of app.libs) {
      let index = 0;
      for (const b of lib.books || []) {
        for (const n of b.notes || []) {
          if (n.id === id) {
            app.lib = lib;
            app.book = { ...b, index };
            app.note = n;
          }
        }
        index++;
      }
    }
    if (!app.note)
      throw new Response("", {
        status: 404,
        statusText: "La citation n'a pas été trouvée",
      });
  }

  return app;
};

export default function CatchAllRoute(props) {
  const { loaderData } = props;
  const location = useLocation();
  const p = previousLocation();
  const skipCache = typeof window === "undefined" || p !== location.pathname;
  previousLocation(location.pathname);
  const { store } = createStore(
    {
      app: {
        ...loaderData,
        locale:
          location.pathname.includes("/livre/") ||
          location.pathname.includes("/c/")
            ? "fr"
            : "en",
      },
    },
    skipCache,
    typeof window !== "undefined",
  );

  const App = isbot() ? (
    <Sitemap {...props} />
  ) : (
    useRoutes([
      {
        path: "livre/:id",
        element: <Page component={Livre} />,
      },
      {
        path: "book/:id",
        element: <Page component={Livre} />,
      },
      {
        path: "c/:id",
        element: <Page component={Note} simple />,
      },
      {
        path: "q/:id",
        element: <Page component={Note} simple />,
      },
    ])
  );

  return <Provider store={store}>{App}</Provider>;
}

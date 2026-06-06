// import HelloWorld from "./HelloWorld.jsx";
import { page } from "@vitest/browser/context";
import { expect, test } from "vitest";
import "../app/root.scss";
import Page from "../app/routes/Page";
import { Home } from "../app/routes/Home";
//import { renderWithRouter } from "../app/utils/testing";

import { render } from "vitest-browser-react";
import { type ReactElement } from "react";
import { Provider } from "react-redux";
import { createMemoryRouter, RouterProvider } from "react-router";
import { createStore } from "../app/store";
import { collections, toLibs } from "../app/utils";

const renderWithRouter = (element: ReactElement, path = "/") => {
  const { pathname } = new URL(`http://localhost:3000${path}`);

  const libs = toLibs(collections.libraries);
  const lib = libs[0];
  const router = createMemoryRouter(
    [
      {
        path: pathname,
        element: (
          <Provider store={createStore({ app: { libs, lib } }).store}>
            {element}
          </Provider>
        ),
      },
    ],
    { initialEntries: [path] },
  );

  return render(<RouterProvider router={router} />);
};

test("screenshots", async () => {
  const { getByText } = renderWithRouter(
    <Page component={Home} loaderData={{}} />,
  );
  await expect.element(getByText("Auteur")).toBeInTheDocument();
  await page.screenshot();
});

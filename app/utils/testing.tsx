import { render, type RenderOptions, screen } from "@testing-library/react";
import { type ReactElement } from "react";
import { Provider } from "react-redux";
import { createMemoryRouter, RouterProvider } from "react-router";
import { createStore } from "../store";
import { collections, toLibs } from "../utils";

export const renderWithRouter = (
  element: ReactElement,
  path = "/",
  options?: Omit<RenderOptions, "wrapper">,
) => {
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

  return render(<RouterProvider router={router} />, { ...options });
};

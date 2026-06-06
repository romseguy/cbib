import {
  combineReducers,
  configureStore,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { getSelectorsByUserAgent } from "react-device-detect";
import { api } from "~/api";
import type { AppState } from "~/utils";

const reducer = (i) => {
  const app = (state = i.app, action: PayloadAction<any>) => {
    //console.log(action.type);
    if (action.type === "app/setState") {
      const newState = {
        ...state,
        ...action.payload,
      };
      if (!action.payload.screenWidth && process.env.NODE_ENV === "development")
        console.log(action, newState);
      return newState;
    }
    return state;
  };
  return combineReducers({
    app,
    api: api.reducer,
  });
};
const middleware = (getDefaultMiddleware) => {
  return getDefaultMiddleware({ serializableCheck: false }).concat([
    api.middleware,
  ]);
};
const makeStore = (i) => {
  return configureStore({
    reducer: reducer(i),
    middleware,
    preloadedState: i,
  });
};

export let store;
export const createStore: (
  i?: any,
  skipCache?: boolean,
  shouldCache?: boolean,
) => {
  store: AppStore;
} = (i = { app: {} }, skipCache = true, shouldCache = false) => {
  let isMobile = false;
  if (i.app.userAgent)
    isMobile = getSelectorsByUserAgent(i.app.userAgent).isMobile;
  if (typeof i.app.isMobile === "undefined" || i.app.isMobile !== isMobile)
    i.app.isMobile = isMobile;

  if (!i.app) i.app = {};
  if (!i.app.auth) i.app.auth = {};

  if (!i.app.locale) i.app.locale = import.meta.env.VITE_PUBLIC_LOCALE;
  if (!i.app.modal) i.app.modal = {};

  if (store && !skipCache) {
    //console.log("cached", typeof window, store.getState().app);
    return { store };
  }
  if (shouldCache) {
    //console.log("caching", typeof window, i);
    store = makeStore(i);
    return { store };
  }
  //console.log("fresh", typeof window, i);
  return { store: makeStore(i) };
};
export const getState = (state) => {
  return state.app as AppState;
};
export const setState = (payload) => ({ type: "app/setState", payload });
export type AppStore = ReturnType<typeof configureStore<any>>;

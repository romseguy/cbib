import { useScript } from "@charlietango/hooks/use-script";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postIp } from "~/api";
import { getState, setState } from "~/store";
import { splash } from "~/lib/ios/splash";
import { useNavigation } from "react-router";
import { tokenKey } from "~/lib/supabase/tokenKey";

const controller = new AbortController();
const signal = controller.signal;

export const Config = () => {
  const { isMobile, screenWidth } = useSelector(getState);
  const dispatch = useDispatch<any>();
  const navigation = useNavigation();

  // useScript("https://unpkg.com/pwacompat", {
  //   attributes: { async: "true", crossOrigin: "anonymous" },
  // });

  useEffect(() => {
    if (process.env.NODE_ENV === "production")
      splash("/icons/icon-512x512.png", "#000000");

    (async () => {
      try {
        if (process.env.NODE_ENV === "production") {
          const res = await fetch("https://api.ipify.org?format=json");
          const data = await res.json();
          if (data.ip) dispatch(postIp.initiate({ ip: data.ip }));
        }
      } catch (error) {}
    })();

    function updateScreenWidth() {
      const newScreenWidth = window.innerWidth - 16;
      if (newScreenWidth !== screenWidth) {
        dispatch(setState({ screenWidth: newScreenWidth }));
      }
    }

    updateScreenWidth();

    if (!isMobile) {
      window.addEventListener("resize", updateScreenWidth);
      signal.addEventListener("abort", () => {
        window.removeEventListener("resize", updateScreenWidth);
      });
      return () => {
        if (!isMobile) controller.abort();
      };
    }
  }, []);

  useEffect(() => {
    if (navigation.state === "idle") {
      let bearer = "";
      if (localStorage.getItem(tokenKey)) {
        bearer = localStorage.getItem(tokenKey) || "";
      }
      // else if (process.env.NODE_ENV === "development") {
      //   bearer = import.meta.env.VITE_PUBLIC_AUTH_TOKEN;
      // }
      if (bearer) {
        localStorage.setItem(tokenKey, bearer);
      }
      const { user, ...token } = bearer ? JSON.parse(bearer) : {};

      dispatch(
        setState({
          auth: { bearer, token, user },
          isLoaded: true,
        }),
      );
    }
  }, [navigation.state]);

  return null;
};

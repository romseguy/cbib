import { useEffect, useState } from "react";

export function useCookie(key, initial): [string, (value: string) => any] {
  const [value, setValue] = useState(
    typeof window !== "undefined"
      ? document.cookie
          .split("; ")
          .find((row) => row.startsWith(`${key}=`))
          ?.split("=")[1] ?? initial
      : initial,
  );

  function setCookie(value) {
    document.cookie = `${key}=${value}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT; SameSite=Lax;`;
  }

  useEffect(() => {
    setCookie(value);
  }, [value, key]);

  return [
    value,
    (value) => {
      setCookie(value);
      setValue(value);
    },
  ];
}

import { css } from "@emotion/react";
import unitless from "@emotion/unitless";
import { type CSSProperties } from "react";
export const MB = 1000000;

export const bindEvent = (
  target: Document | Element,
  eventName: string,
  fun: () => void,
) => {
  if (target.addEventListener) {
    target.removeEventListener(eventName, fun, false);
    target.addEventListener(eventName, fun, false);
  }
};

export const length = (arrayOrObject) => {
  if (typeof arrayOrObject === "undefined") return 0;
  return Array.isArray(arrayOrObject)
    ? arrayOrObject.length
    : Object.keys(arrayOrObject).length;
};

export const createLocalize = (locale) => (fr, en?: string) => {
  if (!en) return locale === "en" ? `${fr}_en` : fr;
  return locale === "en" ? en : fr;
};

export const localize: (fr: string, en?: string) => string = (fr, en) => {
  if (!en) return import.meta.env.VITE_PUBLIC_LOCALE === "en" ? `${fr}_en` : fr;
  return import.meta.env.VITE_PUBLIC_LOCALE === "en" ? en : fr;
};

export const rand = () => Math.round(Math.random() * 100);

function stringifyCSSProperties(
  cssProperties: CSSProperties,
  isImportant: boolean = false,
) {
  function isCSSPropertyValue(value: unknown): value is number | string {
    return typeof value === "number" || typeof value === "string";
  }
  function camelToKebab(str: string) {
    return str.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
  }
  function applyCssUnits(
    prop: string,
    value: string | number,
    units: string = "px",
  ) {
    if (typeof value !== "string" && typeof value !== "number") {
      throw new Error(
        "Invalid input: value of 'cssProperties' must be string or number.",
      );
    }

    if (typeof value === "number" && value !== 0 && !isUnitless(prop)) {
      return `${value}${units}`;
    }

    function isUnitless(prop: string) {
      return unitless[prop] === 1;
    }

    return `${value}`;
  }
  if (typeof cssProperties !== "object" || cssProperties === null) {
    throw new Error("Invalid input: 'cssProperties' must be an object.");
  }

  const important = isImportant ? "!important" : "";
  const str = Object.entries(cssProperties)
    .filter(([_, value]) => isCSSPropertyValue(value))
    .map(([key, value]) => {
      return `${camelToKebab(key)}:${applyCssUnits(key, value)}${important};`;
    })
    .join("");
  return str;
}
function trimCssSelector(selector: string) {
  return selector
    .replace(/\s*([+~>])\s*/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}
export const toCssString = (styleMap, isImportant?: boolean) => {
  return Object.keys(styleMap)
    .map((key) => [key, styleMap[key]])
    .reduce<string[]>((result, [key, value]) => {
      if (Object.keys(value).length > 0) {
        const str = `${stringifyCSSProperties(
          { [trimCssSelector(key)]: value },
          isImportant,
        )}`;
        result.push(str);
      }
      return result;
    }, [])
    .join("");
};

export const toCss = (
  styleMap: Record<string, string>,
  isImportant?: boolean,
) => {
  return css(toCssString(styleMap, isImportant));
};

export const toUsername = (email) => {
  return email?.replace(/@.+/, "");
};

//#region image
export async function getImageSize(file: File | Blob | string) {
  let img = new Image();
  if (typeof file === "string") {
    img.src = file;
  } else {
    img.src = URL.createObjectURL(file);
  }

  await img.decode();
  let width = img.width;
  let height = img.height;
  return {
    width,
    height,
  };
}
//#endregion

//#region hooks
import React, { useRef } from "react";

export const useScroll = <T extends HTMLElement>(
  options?: boolean | ScrollIntoViewOptions,
): [() => void, React.LegacyRef<T>] => {
  const elRef = useRef<T>(null);
  const executeScroll = (): void => {
    if (elRef.current) {
      elRef.current.scrollIntoView(options);
    }
  };

  return [executeScroll, elRef];
};
//#endregion

{
  /*
    export const scrollToBottomOfDynamicPage = (duration = 1000): Promise<void> => {
      return new Promise((resolve) => {
        const startTime: number = performance.now();
        const startY: number = window.scrollY;

        const step = (currentTime: number) => {
          const elapsed: number = currentTime - startTime;
          const progress: number = Math.min(elapsed / duration, 1);

          const targetY: number = document.body.scrollHeight - window.innerHeight;
          const newY: number = startY + (targetY - startY) * progress;

          window.scrollTo({ top: newY, behavior: "instant" });

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            resolve();
          }
        };

        requestAnimationFrame(step);
      });
    };

    export const useScrollToBottomWhen = (condition: boolean) => {
      useEffect(() => {
        if (condition) {
          window.scrollTo({
            top: document.documentElement.scrollHeight - window.innerHeight,
            left: 0,
            behavior: "smooth",
          });
        }
      }, [condition]);
    };
  */
}

{
  /* {React.Children.map(children, (child) =>
        React.cloneElement(child, { showToast }),
      )} */
}

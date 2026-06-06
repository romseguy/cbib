//@ts-nocheck
import React from "react";
import {
  type RenderProps,
  type SlotProps,
  OTPInputContext,
  type OTPInputProps,
} from "input-otp";
import { cn } from "~/lib/shadcn/utils";

export function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        "relative w-10 h-14 text-[2rem]",
        "flex items-center justify-center",
        "transition-all duration-300",
        "border-border border-y border-r first:border-l first:rounded-l-md last:rounded-r-md",
        "group-hover:border-accent-foreground/20 group-focus-within:border-accent-foreground/20",
        "outline outline-accent-foreground/20",
        { "outline-4 outline-accent-foreground": props.isActive },
      )}
    >
      <div className="group-has-[input[data-input-otp-placeholder-shown]]:opacity-20">
        {props.char ?? props.placeholderChar}
      </div>
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  );
}

function FakeCaret() {
  return (
    <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink">
      <div className="w-px h-8 bg-white" />
    </div>
  );
}

export function FakeDash() {
  return (
    <div className="flex w-10 justify-center items-center">
      <div className="w-3 h-1 rounded-full bg-border" />
    </div>
  );
}

// const PWM_BADGE_MARGIN_RIGHT = 18;
// const PWM_BADGE_SPACE_WIDTH_PX = 40;
// const PWM_BADGE_SPACE_WIDTH = `${PWM_BADGE_SPACE_WIDTH_PX}px` as const;
// const PASSWORD_MANAGERS_SELECTORS = [
//   "[data-lastpass-icon-root]", // LastPass
//   "com-1password-button", // 1Password
//   "[data-dashlanecreated]", // Dashlane
//   '[style$="2147483647 !important;"]', // Bitwarden
// ].join(",");

// function syncTimeouts(cb: (...args: any[]) => unknown): number[] {
//   const t1 = setTimeout(cb, 0); // For faster machines
//   const t2 = setTimeout(cb, 1_0);
//   const t3 = setTimeout(cb, 5_0);
//   return [t1, t2, t3];
// }

// function usePasswordManagerBadge({
//   containerRef,
//   inputRef,
//   pushPasswordManagerStrategy,
//   isFocused,
// }: {
//   containerRef: React.RefObject<HTMLDivElement>;
//   inputRef: React.RefObject<HTMLInputElement>;
//   pushPasswordManagerStrategy: OTPInputProps["pushPasswordManagerStrategy"];
//   isFocused: boolean;
// }) {
//   /** Password managers have a badge
//    *  and I'll use this state to push them
//    *  outside the input */
//   const [hasPWMBadge, setHasPWMBadge] = React.useState(false);
//   const [hasPWMBadgeSpace, setHasPWMBadgeSpace] = React.useState(false);
//   const [done, setDone] = React.useState(false);

//   const willPushPWMBadge = React.useMemo(() => {
//     if (pushPasswordManagerStrategy === "none") {
//       return false;
//     }

//     const increaseWidthCase =
//       (pushPasswordManagerStrategy === "increase-width" ||
//         // TODO: remove 'experimental-no-flickering' support in 2.0.0
//         pushPasswordManagerStrategy === "experimental-no-flickering") &&
//       hasPWMBadge &&
//       hasPWMBadgeSpace;

//     return increaseWidthCase;
//   }, [hasPWMBadge, hasPWMBadgeSpace, pushPasswordManagerStrategy]);

//   const trackPWMBadge = React.useCallback(() => {
//     const container = containerRef.current;
//     const input = inputRef.current;
//     if (
//       !container ||
//       !input ||
//       done ||
//       pushPasswordManagerStrategy === "none"
//     ) {
//       return;
//     }

//     const elementToCompare = container;

//     // Get the top right-center point of the container.
//     // That is usually where most password managers place their badge.
//     const rightCornerX =
//       elementToCompare.getBoundingClientRect().left +
//       elementToCompare.offsetWidth;
//     const centereredY =
//       elementToCompare.getBoundingClientRect().top +
//       elementToCompare.offsetHeight / 2;
//     const x = rightCornerX - PWM_BADGE_MARGIN_RIGHT;
//     const y = centereredY;

//     // Do an extra search to check for famous password managers
//     const pmws = document.querySelectorAll(PASSWORD_MANAGERS_SELECTORS);

//     // If no password manager is automatically detect,
//     // we'll try to dispatch document.elementFromPoint
//     // to identify badges
//     if (pmws.length === 0) {
//       const maybeBadgeEl = document.elementFromPoint(x, y);

//       // If the found element is the input itself,
//       // then we assume it's not a password manager badge.
//       // We are not sure. Most times that means there isn't a badge.
//       if (maybeBadgeEl === container) {
//         return;
//       }
//     }

//     setHasPWMBadge(true);
//     setDone(true);
//   }, [containerRef, inputRef, done, pushPasswordManagerStrategy]);

//   React.useEffect(() => {
//     const container = containerRef.current;
//     if (!container || pushPasswordManagerStrategy === "none") {
//       return;
//     }

//     // Check if the PWM area is 100% visible
//     function checkHasSpace() {
//       const viewportWidth = window.innerWidth;
//       const distanceToRightEdge =
//         viewportWidth - container.getBoundingClientRect().right;
//       setHasPWMBadgeSpace(distanceToRightEdge >= PWM_BADGE_SPACE_WIDTH_PX);
//     }

//     checkHasSpace();
//     const interval = setInterval(checkHasSpace, 1000);

//     return () => {
//       clearInterval(interval);
//     };
//   }, [containerRef, pushPasswordManagerStrategy]);

//   React.useEffect(() => {
//     const _isFocused = isFocused || document.activeElement === inputRef.current;

//     if (pushPasswordManagerStrategy === "none" || !_isFocused) {
//       return;
//     }
//     const t1 = setTimeout(trackPWMBadge, 0);
//     const t2 = setTimeout(trackPWMBadge, 2000);
//     const t3 = setTimeout(trackPWMBadge, 5000);
//     const t4 = setTimeout(() => {
//       setDone(true);
//     }, 6000);
//     return () => {
//       clearTimeout(t1);
//       clearTimeout(t2);
//       clearTimeout(t3);
//       clearTimeout(t4);
//     };
//   }, [inputRef, isFocused, pushPasswordManagerStrategy, trackPWMBadge]);

//   return { hasPWMBadge, willPushPWMBadge, PWM_BADGE_SPACE_WIDTH };
// }

// function usePrevious<T>(value: T) {
//   const ref = React.useRef<T>();
//   React.useEffect(() => {
//     ref.current = value;
//   });
//   return ref.current;
// }

// export const OTPInput = React.forwardRef<HTMLInputElement, OTPInputProps>(
//   (
//     {
//       value: uncheckedValue,
//       onChange: uncheckedOnChange,
//       maxLength,
//       textAlign = "left",
//       pattern,
//       placeholder,
//       inputMode = "numeric",
//       onComplete,
//       pushPasswordManagerStrategy = "increase-width",
//       pasteTransformer,
//       containerClassName,
//       noScriptCSSFallback = NOSCRIPT_CSS_FALLBACK,

//       render,
//       children,

//       ...props
//     },
//     ref,
//   ) => {
//     // Only used when `value` state is not provided
//     const [internalValue, setInternalValue] = React.useState(
//       typeof props.defaultValue === "string" ? props.defaultValue : "",
//     );

//     // Definitions
//     const value = uncheckedValue ?? internalValue;
//     const previousValue = usePrevious(value);
//     const onChange = React.useCallback(
//       (newValue: string) => {
//         uncheckedOnChange?.(newValue);
//         setInternalValue(newValue);
//       },
//       [uncheckedOnChange],
//     );
//     const regexp = React.useMemo(
//       () =>
//         pattern
//           ? typeof pattern === "string"
//             ? new RegExp(pattern)
//             : pattern
//           : null,
//       [pattern],
//     );

//     /** useRef */
//     const inputRef = React.useRef<HTMLInputElement>(null);
//     const containerRef = React.useRef<HTMLDivElement>(null);
//     const initialLoadRef = React.useRef({
//       value,
//       onChange,
//       isIOS:
//         typeof window !== "undefined" &&
//         window?.CSS?.supports?.("-webkit-touch-callout", "none"),
//     });
//     const inputMetadataRef = React.useRef<{
//       prev: [number | null, number | null, "none" | "forward" | "backward"];
//     }>({
//       prev: [
//         inputRef.current?.selectionStart,
//         inputRef.current?.selectionEnd,
//         inputRef.current?.selectionDirection,
//       ],
//     });
//     React.useImperativeHandle(ref, () => inputRef.current, []);
//     React.useEffect(() => {
//       const input = inputRef.current;
//       const container = containerRef.current;

//       if (!input || !container) {
//         return;
//       }

//       // Sync input value
//       if (initialLoadRef.current.value !== input.value) {
//         initialLoadRef.current.onChange(input.value);
//       }

//       // Previous selection
//       inputMetadataRef.current.prev = [
//         input.selectionStart,
//         input.selectionEnd,
//         input.selectionDirection,
//       ];
//       function onDocumentSelectionChange() {
//         if (document.activeElement !== input) {
//           setMirrorSelectionStart(null);
//           setMirrorSelectionEnd(null);
//           return;
//         }

//         // Aliases
//         const _s = input.selectionStart;
//         const _e = input.selectionEnd;
//         const _dir = input.selectionDirection;
//         const _ml = input.maxLength;
//         const _val = input.value;
//         const _prev = inputMetadataRef.current.prev;

//         // Algorithm
//         let start = -1;
//         let end = -1;
//         let direction: "forward" | "backward" | "none" = undefined;
//         if (_val.length !== 0 && _s !== null && _e !== null) {
//           const isSingleCaret = _s === _e;
//           const isInsertMode = _s === _val.length && _val.length < _ml;

//           if (isSingleCaret && !isInsertMode) {
//             const c = _s;
//             if (c === 0) {
//               start = 0;
//               end = 1;
//               direction = "forward";
//             } else if (c === _ml) {
//               start = c - 1;
//               end = c;
//               direction = "backward";
//             } else if (_ml > 1 && _val.length > 1) {
//               let offset = 0;
//               if (_prev[0] !== null && _prev[1] !== null) {
//                 direction = c < _prev[1] ? "backward" : "forward";
//                 const wasPreviouslyInserting =
//                   _prev[0] === _prev[1] && _prev[0] < _ml;
//                 if (direction === "backward" && !wasPreviouslyInserting) {
//                   offset = -1;
//                 }
//               }

//               start = offset + c;
//               end = offset + c + 1;
//             }
//           }

//           if (start !== -1 && end !== -1 && start !== end) {
//             inputRef.current.setSelectionRange(start, end, direction);
//           }
//         }

//         // Finally, update the state
//         const s = start !== -1 ? start : _s;
//         const e = end !== -1 ? end : _e;
//         const dir = direction ?? _dir;
//         setMirrorSelectionStart(s);
//         setMirrorSelectionEnd(e);
//         // Store the previous selection value
//         inputMetadataRef.current.prev = [s, e, dir];
//       }
//       document.addEventListener("selectionchange", onDocumentSelectionChange, {
//         capture: true,
//       });

//       // Set initial mirror state
//       onDocumentSelectionChange();
//       document.activeElement === input && setIsFocused(true);

//       // Apply needed styles
//       if (!document.getElementById("input-otp-style")) {
//         const styleEl = document.createElement("style");
//         styleEl.id = "input-otp-style";
//         document.head.appendChild(styleEl);

//         if (styleEl.sheet) {
//           const autofillStyles =
//             "background: transparent !important; color: transparent !important; border-color: transparent !important; opacity: 0 !important; box-shadow: none !important; -webkit-box-shadow: none !important; -webkit-text-fill-color: transparent !important;";

//           safeInsertRule(
//             styleEl.sheet,
//             "[data-input-otp]::selection { background: transparent !important; color: transparent !important; }",
//           );
//           safeInsertRule(
//             styleEl.sheet,
//             `[data-input-otp]:autofill { ${autofillStyles} }`,
//           );
//           safeInsertRule(
//             styleEl.sheet,
//             `[data-input-otp]:-webkit-autofill { ${autofillStyles} }`,
//           );
//           // iOS
//           safeInsertRule(
//             styleEl.sheet,
//             `@supports (-webkit-touch-callout: none) { [data-input-otp] { letter-spacing: -.6em !important; font-weight: 100 !important; font-stretch: ultra-condensed; font-optical-sizing: none !important; left: -1px !important; right: 1px !important; } }`,
//           );
//           // PWM badges
//           safeInsertRule(
//             styleEl.sheet,
//             `[data-input-otp] + * { pointer-events: all !important; }`,
//           );
//         }
//       }
//       // Track root height
//       const updateRootHeight = () => {
//         if (container) {
//           container.style.setProperty(
//             "--root-height",
//             `${input.clientHeight}px`,
//           );
//         }
//       };
//       updateRootHeight();
//       const resizeObserver = new ResizeObserver(updateRootHeight);
//       resizeObserver.observe(input);

//       return () => {
//         document.removeEventListener(
//           "selectionchange",
//           onDocumentSelectionChange,
//           { capture: true },
//         );
//         resizeObserver.disconnect();
//       };
//     }, []);

//     /** Mirrors for UI rendering purpose only */
//     const [isHoveringInput, setIsHoveringInput] = React.useState(false);
//     const [isFocused, setIsFocused] = React.useState(false);
//     const [mirrorSelectionStart, setMirrorSelectionStart] = React.useState<
//       number | null
//     >(null);
//     const [mirrorSelectionEnd, setMirrorSelectionEnd] = React.useState<
//       number | null
//     >(null);

//     /** Effects */
//     React.useEffect(() => {
//       syncTimeouts(() => {
//         // Forcefully remove :autofill state
//         inputRef.current?.dispatchEvent(new Event("input"));

//         // Update the selection state
//         const s = inputRef.current?.selectionStart;
//         const e = inputRef.current?.selectionEnd;
//         const dir = inputRef.current?.selectionDirection;
//         if (s !== null && e !== null) {
//           setMirrorSelectionStart(s);
//           setMirrorSelectionEnd(e);
//           inputMetadataRef.current.prev = [s, e, dir];
//         }
//       });
//     }, [value, isFocused]);

//     React.useEffect(() => {
//       if (previousValue === undefined) {
//         return;
//       }

//       if (
//         value !== previousValue &&
//         previousValue.length < maxLength &&
//         value.length === maxLength
//       ) {
//         onComplete?.(value);
//       }
//     }, [maxLength, onComplete, previousValue, value]);

//     const pwmb = usePasswordManagerBadge({
//       containerRef,
//       inputRef,
//       pushPasswordManagerStrategy,
//       isFocused,
//     });

//     /** Event handlers */
//     const _changeListener = React.useCallback(
//       (e: React.ChangeEvent<HTMLInputElement>) => {
//         const newValue = e.currentTarget.value.slice(0, maxLength);
//         if (newValue.length > 0 && regexp && !regexp.test(newValue)) {
//           e.preventDefault();
//           return;
//         }
//         const maybeHasDeleted =
//           typeof previousValue === "string" &&
//           newValue.length < previousValue.length;
//         if (maybeHasDeleted) {
//           // Since cutting/deleting text doesn't trigger
//           // selectionchange event, we'll have to dispatch it manually.
//           // NOTE: The following line also triggers when cmd+A then pasting
//           // a value with smaller length, which is not ideal for performance.
//           document.dispatchEvent(new Event("selectionchange"));
//         }
//         onChange(newValue);
//       },
//       [maxLength, onChange, previousValue, regexp],
//     );
//     const _focusListener = React.useCallback(() => {
//       if (inputRef.current) {
//         const start = Math.min(inputRef.current.value.length, maxLength - 1);
//         const end = inputRef.current.value.length;
//         inputRef.current?.setSelectionRange(start, end);
//         setMirrorSelectionStart(start);
//         setMirrorSelectionEnd(end);
//       }
//       setIsFocused(true);
//     }, [maxLength]);
//     // Fix iOS pasting
//     const _pasteListener = React.useCallback(
//       (e: React.ClipboardEvent<HTMLInputElement>) => {
//         const input = inputRef.current;
//         if (
//           !pasteTransformer &&
//           (!initialLoadRef.current.isIOS || !e.clipboardData || !input)
//         ) {
//           return;
//         }

//         const _content = e.clipboardData.getData("text/plain");
//         const content = pasteTransformer
//           ? pasteTransformer(_content)
//           : _content;
//         e.preventDefault();

//         const start = inputRef.current?.selectionStart;
//         const end = inputRef.current?.selectionEnd;

//         const isReplacing = start !== end;

//         const newValueUncapped = isReplacing
//           ? value.slice(0, start) + content + value.slice(end) // Replacing
//           : value.slice(0, start) + content + value.slice(start); // Inserting
//         const newValue = newValueUncapped.slice(0, maxLength);

//         if (newValue.length > 0 && regexp && !regexp.test(newValue)) {
//           return;
//         }

//         input.value = newValue;
//         onChange(newValue);

//         const _start = Math.min(newValue.length, maxLength - 1);
//         const _end = newValue.length;

//         input.setSelectionRange(_start, _end);
//         setMirrorSelectionStart(_start);
//         setMirrorSelectionEnd(_end);
//       },
//       [maxLength, onChange, regexp, value],
//     );

//     /** Styles */
//     const rootStyle = React.useMemo<React.CSSProperties>(
//       () => ({
//         position: "relative",
//         cursor: props.disabled ? "default" : "text",
//         userSelect: "none",
//         WebkitUserSelect: "none",
//         pointerEvents: "none",
//       }),
//       [props.disabled],
//     );

//     const inputStyle = React.useMemo<React.CSSProperties>(
//       () => ({
//         position: "absolute",
//         inset: 0,
//         width: pwmb.willPushPWMBadge
//           ? `calc(100% + ${pwmb.PWM_BADGE_SPACE_WIDTH})`
//           : "100%",
//         clipPath: pwmb.willPushPWMBadge
//           ? `inset(0 ${pwmb.PWM_BADGE_SPACE_WIDTH} 0 0)`
//           : undefined,
//         height: "100%",
//         display: "flex",
//         textAlign,
//         opacity: "1", // Mandatory for iOS hold-paste
//         color: "transparent",
//         pointerEvents: "all",
//         background: "transparent",
//         caretColor: "transparent",
//         border: "0 solid transparent",
//         outline: "0 solid transparent",
//         boxShadow: "none",
//         lineHeight: "1",
//         letterSpacing: "-.5em",
//         fontSize: "var(--root-height)",
//         fontFamily: "monospace",
//         fontVariantNumeric: "tabular-nums",
//         // letterSpacing: '-1em',
//         // transform: 'scale(1.5)',
//         // paddingRight: '100%',
//         // paddingBottom: '100%',
//         // debugging purposes
//         // inset: undefined,
//         // position: undefined,
//         // color: 'black',
//         // background: 'white',
//         // opacity: '1',
//         // caretColor: 'black',
//         // padding: '0',
//         // letterSpacing: 'unset',
//         // fontSize: 'unset',
//         // paddingInline: '.5rem',
//       }),
//       [pwmb.PWM_BADGE_SPACE_WIDTH, pwmb.willPushPWMBadge, textAlign],
//     );

//     /** Rendering */
//     const renderedInput = React.useMemo(
//       () => (
//         <input
//           autoComplete={props.autoComplete || "one-time-code"}
//           {...props}
//           data-input-otp
//           data-input-otp-placeholder-shown={value.length === 0 || undefined}
//           data-input-otp-mss={mirrorSelectionStart}
//           data-input-otp-mse={mirrorSelectionEnd}
//           inputMode={inputMode}
//           pattern={regexp?.source}
//           aria-placeholder={placeholder}
//           style={inputStyle}
//           maxLength={maxLength}
//           value={value}
//           ref={inputRef}
//           onPaste={(e) => {
//             _pasteListener(e);
//             props.onPaste?.(e);
//           }}
//           onChange={_changeListener}
//           onMouseOver={(e) => {
//             setIsHoveringInput(true);
//             props.onMouseOver?.(e);
//           }}
//           onMouseLeave={(e) => {
//             setIsHoveringInput(false);
//             props.onMouseLeave?.(e);
//           }}
//           onFocus={(e) => {
//             _focusListener();
//             props.onFocus?.(e);
//           }}
//           onBlur={(e) => {
//             setIsFocused(false);
//             props.onBlur?.(e);
//           }}
//         />
//       ),
//       [
//         _changeListener,
//         _focusListener,
//         _pasteListener,
//         inputMode,
//         inputStyle,
//         maxLength,
//         mirrorSelectionEnd,
//         mirrorSelectionStart,
//         props,
//         regexp?.source,
//         value,
//       ],
//     );

//     const contextValue = React.useMemo<RenderProps>(() => {
//       return {
//         slots: Array.from({ length: maxLength }).map((_, slotIdx) => {
//           const isActive =
//             isFocused &&
//             mirrorSelectionStart !== null &&
//             mirrorSelectionEnd !== null &&
//             ((mirrorSelectionStart === mirrorSelectionEnd &&
//               slotIdx === mirrorSelectionStart) ||
//               (slotIdx >= mirrorSelectionStart &&
//                 slotIdx < mirrorSelectionEnd));

//           const char = value[slotIdx] !== undefined ? value[slotIdx] : null;
//           const placeholderChar =
//             value[0] !== undefined ? null : placeholder?.[slotIdx] ?? null;

//           return {
//             char,
//             placeholderChar,
//             isActive,
//             hasFakeCaret: isActive && char === null,
//           };
//         }),
//         isFocused,
//         isHovering: !props.disabled && isHoveringInput,
//       };
//     }, [
//       isFocused,
//       isHoveringInput,
//       maxLength,
//       mirrorSelectionEnd,
//       mirrorSelectionStart,
//       props.disabled,
//       value,
//     ]);

//     const renderedChildren = React.useMemo(() => {
//       if (render) {
//         return render(contextValue);
//       }
//       return (
//         <OTPInputContext.Provider value={contextValue}>
//           {children}
//         </OTPInputContext.Provider>
//       );
//     }, [children, contextValue, render]);

//     return (
//       <>
//         {noScriptCSSFallback !== null && (
//           <noscript>
//             <style>{noScriptCSSFallback}</style>
//           </noscript>
//         )}

//         <div
//           ref={containerRef}
//           data-input-otp-container
//           style={rootStyle}
//           className={containerClassName}
//         >
//           {renderedChildren}

//           <div
//             style={{
//               position: "absolute",
//               inset: 0,
//               pointerEvents: "none",
//             }}
//           >
//             {renderedInput}
//           </div>
//         </div>
//       </>
//     );
//   },
// );
// OTPInput.displayName = "Input";

// function safeInsertRule(sheet: CSSStyleSheet, rule: string) {
//   if (!sheet || typeof rule !== "string") {
//     console.error("Invalid parameters for safeInsertRule:", { sheet, rule });
//     return;
//   }
//   try {
//     sheet.insertRule(rule);
//   } catch (error) {
//     //console.info("input-otp could not insert CSS rule:", rule, error);
//     const styleElement = sheet.ownerNode as HTMLStyleElement;
//     if (styleElement) {
//       styleElement.appendChild(document.createTextNode(rule));
//     }
//   }
// }

// // Decided to go with <noscript>
// // instead of `scripting` CSS media query
// // because it's a fallback for initial page load
// // and the <script> tag won't be loaded
// // unless the user has JS disabled.
// const NOSCRIPT_CSS_FALLBACK = `
// [data-input-otp] {
//   --nojs-bg: white !important;
//   --nojs-fg: black !important;

//   background-color: var(--nojs-bg) !important;
//   color: var(--nojs-fg) !important;
//   caret-color: var(--nojs-fg) !important;
//   letter-spacing: .25em !important;
//   text-align: center !important;
//   border: 1px solid var(--nojs-fg) !important;
//   border-radius: 4px !important;
//   width: 100% !important;
// }
// @media (prefers-color-scheme: dark) {
//   [data-input-otp] {
//     --nojs-bg: black !important;
//     --nojs-fg: white !important;
//   }
// }`;

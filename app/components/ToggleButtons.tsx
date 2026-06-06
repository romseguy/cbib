import { css } from "@emotion/react";
import {
  ArrowUpIcon,
  BellIcon,
  HeartIcon,
  MoonIcon,
  SunIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { Toggle } from "@radix-ui/react-toggle";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "react-router";
import { Flex, Input, useToggleModal } from "~/components";
import { getState, setState } from "~/store";
import { useCookie } from "~/utils/cookie";

export const ToggleButtonsTopRight = (props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [value, setValue] = useState("");
  const dispatch = useDispatch();
  const onSubmit = () => {
    if (value === "" && isVisible) setIsVisible(false);
    else if (value) {
      setValue("");
      setIsVisible(false);
      dispatch(setState({ keyword: value, modal: { isOpen: true } }));
    } else setIsVisible(true);
  };
  return (
    <Flex
      className="toggle-buttons top-right"
      css={css`
        ${isVisible ? "background: black; border: 1px solid white;" : ""}
      `}
    >
      <form
        css={css`
          display: flex;
        `}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {isVisible && (
          <Input
            autoFocus
            className="border-0"
            onChange={(e) => setValue(e.target.value)}
          />
        )}
        <Toggle
          type="submit"
          css={css`
            ${isVisible ? "border: 0;" : ""}
          `}
        >
          <MagnifyingGlassIcon />
        </Toggle>
      </form>
    </Flex>
  );
};

export const ToggleButtonsBottomRight = (props) => {
  const { auth, isMobile, ...state } = useSelector(getState);
  const user = auth?.user;
  const [appearance, setAppearance] = useCookie("color-mode", state.appearance);
  const dispatch = useDispatch<any>();
  const toggleModal = useToggleModal();

  return (
    <Flex className="toggle-buttons bottom-right">
      <Toggle
        onPressedChange={() => {
          toggleModal("heart-modal");
        }}
      >
        <HeartIcon />
      </Toggle>
      <Toggle
        onPressedChange={() => {
          toggleModal("notif-modal", {
            email: user?.email,
          });
        }}
      >
        <BellIcon />
      </Toggle>
      <Toggle
        onPressedChange={() => {
          const a = appearance === "dark" ? "light" : "dark";
          setAppearance(a);
          dispatch(
            setState({
              appearance: a,
            }),
          );
        }}
      >
        {appearance === "dark" ? <SunIcon /> : <MoonIcon />}
      </Toggle>
      <Toggle
        onPressedChange={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUpIcon />
      </Toggle>
    </Flex>
  );
};

export const ToggleButtons = (props) => {
  return (
    <>
      <ToggleButtonsTopRight />
      <ToggleButtonsBottomRight />
    </>
  );
};

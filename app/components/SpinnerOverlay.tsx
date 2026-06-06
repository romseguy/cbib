import { Spinner } from "@radix-ui/themes";
import { useSelector } from "react-redux";
import { Flex } from "~/components";
import { getState } from "~/store";
import { localize } from "~/utils";

export const SpinnerOverlay = () => {
  const { screenWidth } = useSelector(getState);

  return (
    <Flex
      justify="center"
      height="100%"
      width="100%"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        background: "rgba(0, 0, 0, 0.5)",
        pointerEvents: "all",
      }}
    >
      <Flex
        p="3"
        style={{
          background: "rgba(255, 255, 255, 0.8)",
          borderRadius: "var(--radius-3)",
          color: "black",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <Spinner size="3" /> {localize("Chargement", "Loading")}...
      </Flex>
    </Flex>
  );
};

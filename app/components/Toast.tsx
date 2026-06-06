import { useState, useEffect } from "react";
import { css } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { getState, setState } from "~/store";

export interface ToastProps {
  message: string;
  delay: number;
  isError?: boolean;
  onHide?: () => void;
}

const Toast = (toast: ToastProps) => {
  const { delay = 5500, message, onHide, isError } = toast;
  const [className, setClassname] = useState("toast-container hide-toast");
  useEffect(() => {
    if (typeof toast.message === "string") {
      setClassname("toast-container show-toast");
      let hideTimeout: NodeJS.Timeout;
      const timeout = setTimeout(() => {
        setClassname("toast-container hide-toast");
        hideTimeout = setTimeout(() => {
          onHide && onHide();
        }, 500);
      }, delay);
      return () => {
        clearTimeout(timeout);
        clearTimeout(hideTimeout);
      };
    }
  }, [toast]);
  return (
    <div
      className={className}
      css={css`
        background-color: ${isError ? "red" : "skyblue"};
      `}
    >
      {message}
    </div>
  );
};

export const ToastsContainer = ({ toast, onToastFinished }) => {
  return (
    <div className="toasts-container" css={css``}>
      <Toast {...toast} onHide={onToastFinished} />
    </div>
  );
};

export const useToast = () => {
  const dispatch = useDispatch<any>();
  return (message, isError?: boolean) => {
    const toast = {
      message: typeof message === "string" ? message : message.message,
      delay: 2500,
      isError,
    };
    dispatch(
      setState({
        toast,
      }),
    );
  };
};

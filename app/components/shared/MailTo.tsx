import React from "react";
const MAIL_TO_INDENT_SPACING_DEFAULT = 4;
const MAIL_TO_BREAK_SPACING_DEFAULT = 1;

type MailtoHeaders = {
  /**
   * Additional recipients to be copied on the email.
   * @example ["cc@example.com"]
   */
  cc?: string[];

  /**
   * Additional recipients to be blind copied on the email.
   * @example ["bcc@example.com"]
   */
  bcc?: string[];

  /**
   * The subject of the email.
   * @example "Meeting Request"
   */
  subject?: string;

  /**
   * The body content of the email.
   * @example "Please find the details attached."
   */
  body?: string;
};

const toSearchString = (searchParams: MailtoHeaders = {}): string => {
  return Object.entries(searchParams)
    .flatMap(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((item) => `${key}=${encodeURIComponent(item)}`);
      }
      return value ? `${key}=${encodeURIComponent(value)}` : "";
    })
    .filter(Boolean)
    .join("&");
};

const createMailToLink = (email: string[], headers: MailtoHeaders): string => {
  let link = `mailto:${email.join(",")}`;
  if (headers) {
    const params = toSearchString(headers);
    if (params.length > 0) {
      link += `?${params}`;
    }
  }
  return link;
};

const extractBodyContent = (
  children: React.ReactNode,
  level: number = 0,
): string => {
  let bodyContent = "";

  const traverse = (node: any, currentLevel: number) => {
    const indent = " ".repeat(currentLevel * MAIL_TO_INDENT_SPACING_DEFAULT);
    if (typeof node === "string") {
      bodyContent += node;
    } else if (
      React.isValidElement<React.PropsWithChildren<{ spacing?: number }>>(node)
    ) {
      switch (node.type) {
        case "br":
          bodyContent += "\n";
          break;
        case MailToBreak:
          bodyContent += "\n".repeat(
            node.props.spacing ?? MAIL_TO_BREAK_SPACING_DEFAULT,
          );
          break;
        case MailToIndent:
          const arr = [
            " ".repeat(node.props.spacing ?? MAIL_TO_INDENT_SPACING_DEFAULT),
          ];
          const arr2 = [node.props.children];
          React.Children.forEach([...arr, ...arr2], (child) =>
            traverse(child, currentLevel),
          );
          break;
        case "ul":
        case "ol":
          if (bodyContent && !bodyContent.endsWith("\n")) {
            bodyContent += "\n";
          }
          React.Children.forEach(node.props.children, (child) => {
            if (React.isValidElement(child) && child.type === "li") {
              traverse(child, currentLevel);
            }
          });
          break;
        case "li":
          const prefix = "- ";
          React.Children.forEach(node.props.children, (child) => {
            if (
              React.isValidElement(child) &&
              (child.type === "ul" || child.type === "ol")
            ) {
              traverse(child, currentLevel + 1);
            } else if (typeof child === "string") {
              traverse(`${indent}${prefix}${child}`, currentLevel);
            }
          });
          if (!bodyContent.endsWith("\n")) {
            bodyContent += "\n";
          }
          break;
        case MailToBody:
          React.Children.forEach(node.props.children, (child) =>
            traverse(child, currentLevel),
          );
          break;
        default:
          break;
      }
    }
  };

  React.Children.forEach<React.ReactNode>(children, (child) =>
    traverse(child, level),
  );
  return bodyContent.trim();
};

export const MailTo = ({
  to,
  subject,
  cc = [],
  bcc = [],
  obfuscate = false,
  children,
  ...others
}: {
  to: string | string[];
  subject?: string;
  cc?: string | string[];
  bcc?: string | string[];
  obfuscate?: boolean;
  children: React.ReactNode;
} & React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>) => {
  // Normalize to, cc, and bcc to always be arrays
  const normalizeToList = (input?: string | string[]): string[] =>
    typeof input === "string" ? [input] : input ?? [];
  const normalizedTo = normalizeToList(to);
  const normalizedCc = normalizeToList(cc);
  const normalizedBcc = normalizeToList(bcc);
  // Extract the body content from children
  const bodyContent = extractBodyContent(children);

  // Prepare headers for the mailto link
  const headers: MailtoHeaders = {
    subject,
    cc: normalizedCc,
    bcc: normalizedBcc,
    body: bodyContent || undefined,
  };

  // Find the MailToTrigger in the children
  const trigger = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === MailToTrigger,
  ) as React.ReactElement | undefined;

  if (!trigger) {
    console.error("MailToTrigger is required inside Mailto component.");
    return <div></div>;
  }

  // Generate the mailto link
  const mailtoLink = createMailToLink(normalizedTo, headers);

  // If obfuscate is true, handle the link differently
  if (obfuscate) {
    return React.cloneElement(trigger, {
      onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        window.location.href = mailtoLink;
      },
      href: "#",
      ...others,
    });
  }

  // Render the trigger with the mailto link
  return React.cloneElement(trigger, {
    href: mailtoLink,
    ...others,
  });
};

export const MailToBody = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

export const MailToTrigger = ({
  children,
  ...props
}: {
  children: React.ReactNode;
  props?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
}) => <a {...props}>{children}</a>;

export const MailToIndent = ({
  children,
  spacing = MAIL_TO_INDENT_SPACING_DEFAULT,
}: {
  children: React.ReactNode;
  spacing?: number;
}) => (
  <div>
    {`${" ".repeat(spacing)}`}
    {children}
  </div>
);

export const MailToBreak = ({
  spacing = MAIL_TO_BREAK_SPACING_DEFAULT,
}: {
  spacing?: number;
}) => <div>{"\n".repeat(spacing)}</div>;

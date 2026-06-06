import { Button, IconButton } from "@radix-ui/themes";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getState } from "~/store";
import { localize } from "~/utils";
//import add from "/add.svg";
import b1 from "/b1.svg";
import { Flex } from "./Containers";
import { Input } from "../ui";
import { CheckIcon } from "@radix-ui/react-icons";

//#region buttons
export const AddNoteButton = ({ book, setBook, ...props }) => {
  return (
    <Button
      disabled={!!book?.notes?.find(({ isNew }) => isNew)}
      onClick={(e) => {
        const b = {
          ...book,
          notes: (book.notes || []).concat([
            {
              isEditing: true,
              isNew: true,
            },
          ]),
        };
        setBook(b);
      }}
      {...props}
    >
      {localize("Ajouter une citation", "Add a quote")}
    </Button>
  );
};
export const BackButton = (props) => {
  const navigate = useNavigate();
  const {
    onClick = () => {
      //@ts-expect-error
      navigate(!!history && history.length > 1 ? -1 : "/");
    },
    label = localize("Retour", "Back"),
  } = props;
  return (
    <Button type="button" className="back-btn" onClick={onClick} {...props}>
      {"<"} {label}
    </Button>
  );
};
export const DonateButton = () => {
  return (
    <a id="donate-button" target="_blank" href="https://romseguy.com">
      {localize("Faire un don", "Donate")}
    </a>
  );
};
export const LocaleSwitch = (props) => {
  const { onClick, setLocale, ...p } = props;
  const { locale } = useSelector(getState);
  if (locale === "en")
    return (
      <FrIcon
        className="fr-icon"
        onClick={(e) => {
          if (setLocale) setLocale("fr");
          else if (onClick) onClick(e);
        }}
        {...p}
      />
    );

  return (
    <EnIcon
      className="en-icon"
      onClick={(e) => {
        if (setLocale) setLocale("en");
        else if (onClick) onClick(e);
      }}
      {...p}
    />
  );
};
export const PageSwitch = ({
  isPageEdit,
  setIsPageEdit,
  page,
  setPage,
  note,
  onClick,
  ...props
}) => {
  return (
    <div>
      {!isPageEdit ? (
        <Button
          type="button"
          variant="soft"
          className="with-icon"
          onClick={() => setIsPageEdit(true)}
          {...props}
        >
          <EditIcon
            {...iconProps({
              title: "Modifier la page",
              style: {
                border: "none",
                padding: "unset",
              },
            })}
          />
          p.{note.page}
        </Button>
      ) : (
        <Flex gap="2">
          <Input
            autoFocus
            type="number"
            defaultValue={page}
            style={{ width: "80px" }}
            onChange={(e) => {
              const p = Number(e.target.value);
              if (p < 10000) setPage(p);
            }}
          />
          <IconButton
            onClick={() => {
              setIsPageEdit(false);
              onClick(page);
            }}
          >
            <CheckIcon />
          </IconButton>
        </Flex>
      )}
    </div>
  );
};
//#endregion

//#region icons
export const iconProps = (props) => {
  const { title, style, onClick } = props;
  const { isMobile } = useSelector(getState);

  const out: Record<string, any> = {
    "aria-label": title,
    height: undefined,
    width: undefined,
    style: {
      cursor: "pointer",
      ...(isMobile
        ? {
            padding: "6px",
            border: "1px solid white",
          }
        : {}),
      ...style,
    },
  };

  if (onClick) {
    out.onClick = (e) => {
      e.preventDefault();
      onClick();
    };
  }

  return out;
};
//export const AddIcon = (props) => <img src={add} width="30em" {...props} />;
// export const Book1Icon = (props) => <img src={b1} width="30em" {...props} />;
export const Book1Icon = (props) => (
  <svg
    className="icon"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 -960 960 960"
    {...props}
  >
    <path d="M440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6q47 0 91.5 10.5T440-278m40 118q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q74 0 126 17t112 52q11 6 16.5 14t5.5 21v418q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-481q15 5 29.5 11t28.5 14q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59m140-240v-440l120-40v440zm-340-99" />
  </svg>
);
//export const BooksIcon = (props) => <img src={l2} width="30em" {...props} />;
export const BooksIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 487.866 487.866"
    {...props}
  >
    <path d="M482.866 243.444h-72.203c1.063-.471 1.946-1.279 2.467-2.333a5 5 0 0 0 .207-3.951L374.941 133.4a5 5 0 0 0-6.16-3.043l-24.386 7.502v-37.816a5 5 0 0 0-5-5h-21.837a5 5 0 0 0-5 5v13.369h-24.974v-13.369a5 5 0 0 0-5-5h-52.375a5 5 0 0 0-5 5v13.369h-11.837v-4.347a5 5 0 0 0-5-5h-32.454v-4.021a5 5 0 0 0-5-5h-52.375a5 5 0 0 0-5 5v23.933H79.219a5 5 0 0 0-5 5v114.469H5a5 5 0 0 0-5 5v39.835a5 5 0 0 0 5 5h54.733v94.545a5 5 0 0 0 5 5h39.822a5 5 0 0 0 5-5v-94.545h267.434v94.545a5 5 0 0 0 5 5h39.822a5 5 0 0 0 5-5v-94.545h56.055a5 5 0 0 0 5-5v-39.835a5 5 0 0 0-5-5.002m-115.663-102.14 34.919 94.368-21.464 6.603-34.919-94.368zm3.225 102.14h-26.033v-70.353zm-47.87-138.402h11.837v38.33a4.97 4.97 0 0 0 0 2.54v97.531h-11.837V105.042m-10 18.369v120.033h-24.974V123.411zm-77.349-18.369h42.375v138.402h-42.375V105.042m-10 18.369v120.033h-11.837V123.411zm-21.837-9.348v129.38h-27.454v-129.38zm-79.829-9.021h42.375v3.687c-.008.113-.034.22-.034.334v134.38h-42.341V105.042m-39.324 28.933h29.324v109.469H84.219zm-5 119.469h298.377l.013.001.013-.001h100.244v14.961H10v-14.961zm20.336 129.38H69.733v-89.545h9.911v4.95a5 5 0 0 0 10 0v-4.95h9.911zm317.256 0h-29.822v-89.545h9.911v4.95a5 5 0 0 0 10 0v-4.95h9.911zm5-99.545h-19.795c-.04-.001-.076-.012-.116-.012s-.077.011-.116.012H84.76c-.04-.001-.076-.012-.116-.012s-.077.011-.116.012H10v-4.874h467.866v4.874zM91.802 367.913a7.158 7.158 0 1 1-14.317 0 7.158 7.158 0 0 1 14.317 0m318.578 0a7.158 7.158 0 1 1-14.317 0 7.158 7.158 0 0 1 14.317 0M79.644 352.71v-34.468a5 5 0 0 1 10 0v34.468a5 5 0 0 1-10 0m317.256 0v-34.468a5 5 0 0 1 10 0v34.468a5 5 0 0 1-10 0" />
  </svg>
);
export const FrIcon = (props) => {
  return (
    <svg
      cursor="pointer"
      viewBox="0 0 30 30.000001"
      preserveAspectRatio="xMidYMid meet"
      zoomAndPan="magnify"
      {...props}
    >
      <defs>
        <clipPath id="id1">
          <path
            d="M 19 5.261719 L 27.582031 5.261719 L 27.582031 23.40625 L 19 23.40625 Z M 19 5.261719 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="id2">
          <path
            d="M 2.179688 5.261719 L 11 5.261719 L 11 23.40625 L 2.179688 23.40625 Z M 2.179688 5.261719 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="id3">
          <path
            d="M 10 5.261719 L 20 5.261719 L 20 23.40625 L 10 23.40625 Z M 10 5.261719 "
            clipRule="nonzero"
          />
        </clipPath>
      </defs>
      <g clipPath="url(#id1)">
        <path
          fill="rgb(92.939758%, 16.079712%, 22.349548%)"
          d="M 27.574219 20.617188 C 27.574219 22.15625 26.3125 23.40625 24.753906 23.40625 L 19.113281 23.40625 L 19.113281 5.261719 L 24.753906 5.261719 C 26.3125 5.261719 27.574219 6.511719 27.574219 8.054688 Z M 27.574219 20.617188 "
          fillOpacity="1"
          fillRule="nonzero"
        />
      </g>
      <g clipPath="url(#id2)">
        <path
          fill="rgb(0%, 14.118958%, 58.428955%)"
          d="M 5.011719 5.261719 C 3.453125 5.261719 2.191406 6.511719 2.191406 8.054688 L 2.191406 20.617188 C 2.191406 22.15625 3.453125 23.40625 5.011719 23.40625 L 10.652344 23.40625 L 10.652344 5.261719 Z M 5.011719 5.261719 "
          fillOpacity="1"
          fillRule="nonzero"
        />
      </g>
      <g clipPath="url(#id3)">
        <path
          fill="rgb(93.328857%, 93.328857%, 93.328857%)"
          d="M 10.652344 5.261719 L 19.113281 5.261719 L 19.113281 23.40625 L 10.652344 23.40625 Z M 10.652344 5.261719 "
          fillOpacity="1"
          fillRule="nonzero"
        />
      </g>
    </svg>
  );
};
export const EnIcon = (props) => (
  <svg
    cursor="pointer"
    viewBox="0 0 30 30.000001"
    preserveAspectRatio="xMidYMid meet"
    zoomAndPan="magnify"
    {...props}
  >
    <defs>
      <clipPath id="id1">
        <path
          d="M 2.511719 6.402344 L 27.191406 6.402344 L 27.191406 24.546875 L 2.511719 24.546875 Z M 2.511719 6.402344 "
          clipRule="nonzero"
        />
      </clipPath>
    </defs>
    <g clipPath="url(#id1)" strokeLinecap="round">
      <path
        fill="rgb(0%, 14.118958%, 49.01886%)"
        d="M 2.519531 9.234375 L 2.519531 11.984375 L 6.375 11.984375 Z M 5.714844 24.546875 L 11.425781 24.546875 L 11.425781 20.472656 Z M 18.277344 20.472656 L 18.277344 24.546875 L 23.984375 24.546875 Z M 2.519531 18.964844 L 2.519531 21.714844 L 6.378906 18.964844 Z M 23.988281 6.402344 L 18.277344 6.402344 L 18.277344 10.472656 Z M 27.183594 21.714844 L 27.183594 18.964844 L 23.324219 18.964844 Z M 27.183594 11.984375 L 27.183594 9.234375 L 23.324219 11.984375 Z M 11.425781 6.402344 L 5.714844 6.402344 L 11.425781 10.472656 Z M 11.425781 6.402344 "
        fillOpacity="1"
        fillRule="nonzero"
      />
      <path
        fill="rgb(81.17981%, 10.5896%, 16.859436%)"
        d="M 19.742188 18.964844 L 26.394531 23.710938 C 26.71875 23.375 26.949219 22.953125 27.074219 22.488281 L 22.132812 18.964844 Z M 11.425781 18.964844 L 9.960938 18.964844 L 3.304688 23.707031 C 3.664062 24.078125 4.121094 24.34375 4.632812 24.464844 L 11.425781 19.621094 Z M 18.277344 11.984375 L 19.742188 11.984375 L 26.394531 7.238281 C 26.039062 6.867188 25.582031 6.605469 25.070312 6.480469 L 18.277344 11.324219 Z M 9.960938 11.984375 L 3.304688 7.238281 C 2.984375 7.574219 2.753906 7.992188 2.628906 8.460938 L 7.570312 11.984375 Z M 9.960938 11.984375 "
        fillOpacity="1"
        fillRule="nonzero"
      />
      <path
        fill="rgb(93.328857%, 93.328857%, 93.328857%)"
        d="M 27.183594 17.566406 L 16.90625 17.566406 L 16.90625 24.546875 L 18.277344 24.546875 L 18.277344 20.472656 L 23.984375 24.546875 L 24.441406 24.546875 C 25.207031 24.546875 25.898438 24.222656 26.394531 23.710938 L 19.742188 18.964844 L 22.132812 18.964844 L 27.074219 22.488281 C 27.136719 22.253906 27.183594 22.011719 27.183594 21.753906 L 27.183594 21.714844 L 23.324219 18.964844 L 27.183594 18.964844 Z M 2.519531 17.566406 L 2.519531 18.964844 L 6.378906 18.964844 L 2.519531 21.714844 L 2.519531 21.753906 C 2.519531 22.515625 2.820312 23.203125 3.304688 23.707031 L 9.960938 18.964844 L 11.425781 18.964844 L 11.425781 19.621094 L 4.632812 24.464844 C 4.835938 24.515625 5.042969 24.546875 5.261719 24.546875 L 5.714844 24.546875 L 11.425781 20.472656 L 11.425781 24.546875 L 12.796875 24.546875 L 12.796875 17.566406 Z M 27.183594 9.191406 C 27.183594 8.429688 26.882812 7.742188 26.394531 7.238281 L 19.742188 11.984375 L 18.277344 11.984375 L 18.277344 11.324219 L 25.070312 6.480469 C 24.867188 6.433594 24.660156 6.402344 24.441406 6.402344 L 23.988281 6.402344 L 18.277344 10.472656 L 18.277344 6.402344 L 16.90625 6.402344 L 16.90625 13.378906 L 27.183594 13.378906 L 27.183594 11.984375 L 23.324219 11.984375 L 27.183594 9.234375 Z M 11.425781 6.402344 L 11.425781 10.472656 L 5.714844 6.402344 L 5.261719 6.402344 C 4.496094 6.402344 3.804688 6.722656 3.304688 7.238281 L 9.960938 11.984375 L 7.570312 11.984375 L 2.628906 8.460938 C 2.566406 8.695312 2.519531 8.9375 2.519531 9.191406 L 2.519531 9.234375 L 6.375 11.984375 L 2.519531 11.984375 L 2.519531 13.378906 L 12.796875 13.378906 L 12.796875 6.402344 Z M 11.425781 6.402344 "
        fillOpacity="1"
        fillRule="nonzero"
      />
      <path
        fill="rgb(81.17981%, 10.5896%, 16.859436%)"
        d="M 16.90625 13.378906 L 16.90625 6.402344 L 12.796875 6.402344 L 12.796875 13.378906 L 2.519531 13.378906 L 2.519531 17.566406 L 12.796875 17.566406 L 12.796875 24.546875 L 16.90625 24.546875 L 16.90625 17.566406 L 27.183594 17.566406 L 27.183594 13.378906 Z M 16.90625 13.378906 "
        fillOpacity="1"
        fillRule="nonzero"
      />
    </g>
  </svg>
);
export const BookIcon = (props) => (
  <svg
    className="icon"
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 448 512"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M448 360V24c0-13.3-10.7-24-24-24H96C43 0 0 43 0 96v320c0 53 43 96 96 96h328c13.3 0 24-10.7 24-24v-16c0-7.5-3.5-14.3-8.9-18.7-4.2-15.4-4.2-59.3 0-74.7 5.4-4.3 8.9-11.1 8.9-18.6zM128 134c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm0 64c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm253.4 250H96c-17.7 0-32-14.3-32-32 0-17.6 14.4-32 32-32h285.4c-1.9 17.1-1.9 46.9 0 64z"></path>
  </svg>
);
export const DeleteIcon = ({ ...props }) => (
  <svg
    className="delete-icon"
    viewBox="0 0 24 24"
    height="1em"
    width="1em"
    {...props}
  >
    <path d="M19.452 7.5H4.547a.5.5 0 00-.5.545l1.287 14.136A2 2 0 007.326 24h9.347a2 2 0 001.992-1.819L19.95 8.045a.5.5 0 00-.129-.382.5.5 0 00-.369-.163zm-9.2 13a.75.75 0 01-1.5 0v-9a.75.75 0 011.5 0zm5 0a.75.75 0 01-1.5 0v-9a.75.75 0 011.5 0zM22 4h-4.75a.25.25 0 01-.25-.25V2.5A2.5 2.5 0 0014.5 0h-5A2.5 2.5 0 007 2.5v1.25a.25.25 0 01-.25.25H2a1 1 0 000 2h20a1 1 0 000-2zM9 3.75V2.5a.5.5 0 01.5-.5h5a.5.5 0 01.5.5v1.25a.25.25 0 01-.25.25h-5.5A.25.25 0 019 3.75z"></path>
  </svg>
);
export const EditIcon = ({ ...props }) => (
  <svg className="edit-icon" viewBox="0 0 24 24" {...props}>
    <g strokeLinecap="round" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </g>
  </svg>
);
export const EmailIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    focusable="false"
    width="1em"
    height="1em"
    {...props}
  >
    <path
      fill="currentColor"
      d="M12,.5A11.634,11.634,0,0,0,.262,12,11.634,11.634,0,0,0,12,23.5a11.836,11.836,0,0,0,6.624-2,1.25,1.25,0,1,0-1.393-2.076A9.34,9.34,0,0,1,12,21a9.132,9.132,0,0,1-9.238-9A9.132,9.132,0,0,1,12,3a9.132,9.132,0,0,1,9.238,9v.891a1.943,1.943,0,0,1-3.884,0V12A5.355,5.355,0,1,0,12,17.261a5.376,5.376,0,0,0,3.861-1.634,4.438,4.438,0,0,0,7.877-2.736V12A11.634,11.634,0,0,0,12,.5Zm0,14.261A2.763,2.763,0,1,1,14.854,12,2.812,2.812,0,0,1,12,14.761Z"
    ></path>
  </svg>
);
export const ExternalIcon = ({ ...props }) => (
  <svg className="external-icon" viewBox="0 0 24 24" {...props}>
    <g fill="none" strokeLinecap="round" strokeWidth={2}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <path d="M15 3h6v6"></path>
      <path d="M10 14L21 3"></path>
    </g>
  </svg>
);
export const ShareIcon = ({ ...props }) => (
  <svg className="share-icon" viewBox="0 0 512 512" {...props}>
    <g stroke="currentColor">
      <path d="M503.691 189.836L327.687 37.851C312.281 24.546 288 35.347 288 56.015v80.053C127.371 137.907 0 170.1 0 322.326c0 61.441 39.581 122.309 83.333 154.132 13.653 9.931 33.111-2.533 28.077-18.631C66.066 312.814 132.917 274.316 288 272.085V360c0 20.7 24.3 31.453 39.687 18.164l176.004-152c11.071-9.562 11.086-26.753 0-36.328z"></path>
    </g>
  </svg>
);
export const UserIcon = (props) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 448 512"
    height="1em"
    width="1em"
    {...props}
  >
    <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path>
  </svg>
);
//#endregion

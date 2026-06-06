import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ReaderIcon,
  Share1Icon,
} from "@radix-ui/react-icons";
import { Box, Button } from "@radix-ui/themes";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { editNote } from "~/api";
import {
  EditIcon,
  Flex,
  LocaleSwitch,
  NoteDeleteIcon,
  PageSwitch,
  iconProps,
  useToast,
} from "~/components";
import { getState, setState } from "~/store";
import { localize, type NoteT } from "~/utils";

export const NoteHeaderLeft = (props) => {
  const { notes, note } = props;
  const { book, isMobile, locale } = useSelector(getState);
  const [isPageEdit, setIsPageEdit] = useState(false);
  const [page, setPage] = useState<number | undefined>(note.page);
  const openLabel = localize("Ouvrir le lecteur", "Open the reader");

  const dispatch = useDispatch<any>();
  const setBook = (b) => dispatch(setState({ book: b }));
  const navigate = useNavigate();
  const showToast = useToast();

  async function onEditPageClick(note: NoteT) {
    console.log("🚀 ~ onEditPageClick ~ note:", note);
    try {
      const { data, error } = await dispatch(
        editNote.initiate({
          note,
        }),
      );
      if (data.error || error) data.error || error;

      setBook({
        ...book,
        notes: book.notes?.map((n) => {
          if (n.id === note.id) return note;
          return n;
        }),
      });
    } catch (error) {
      showToast(error, true);
    }
  }

  const onOpenClick = () => {
    navigate(`/${locale === "en" ? "q" : "c"}/${note.id}`);
  };

  return (
    <Flex
      direction={isMobile ? "column" : "row"}
      gap={isMobile ? "0" : "3"}
      {...props}
    >
      <PageSwitch
        variant="soft"
        isPageEdit={isPageEdit}
        setIsPageEdit={setIsPageEdit}
        page={page}
        setPage={setPage}
        note={note}
        onClick={(pageNumber) => {
          onEditPageClick({ ...note, page: pageNumber });
        }}
      />

      <Button
        type="button"
        variant="soft"
        className="with-icon"
        onClick={onOpenClick}
      >
        <ReaderIcon
          className="reader-icon"
          {...iconProps({
            title: openLabel,
            style: { border: 0, padding: "unset" },
          })}
        />
        {openLabel}
      </Button>

      {note.index !== 0 && (
        <Button variant="soft" type="button">
          <ChevronLeftIcon />
          {localize("Précédent", "Previous")}
        </Button>
      )}

      {note.index !== notes.length - 1 && (
        <Button variant="soft" type="button">
          {localize("Suivant", "Next")}
          <ChevronRightIcon />
        </Button>
      )}
    </Flex>
  );
};

export const NoteHeaderRight = (props) => {
  const { note } = props;
  const { book } = useSelector(getState);
  const dispatch = useDispatch<any>();
  const setBook = (b) => dispatch(setState({ book: b }));
  const navigate = useNavigate();

  const onEditClick = () => {
    setBook({
      ...book,
      notes: book.notes?.map((n) => {
        if (n.id === note.id) return { ...n, isEditing: true };
        return n;
      }),
    });
  };

  const onShareClick = () => {
    dispatch(
      setState({
        modal: {
          id: "share-modal",
          isOpen: true,
          book,
          note,
        },
      }),
    );
  };

  return (
    <Box {...props}>
      {/* {!isLoading && ( */}
      <Flex gap="3">
        <LocaleSwitch
          setLocale={(locale) => {
            navigate(
              locale === "fr"
                ? location.pathname.replace("book", "livre")
                : location.pathname.replace("livre", "book"),
            );
          }}
        />
        <Share1Icon
          className="share-icon"
          color="var(--color-blue-500)"
          {...iconProps({
            title: localize("Partager la citation", "Share the quote"),
            onClick: onShareClick,
          })}
        />
        <EditIcon
          {...iconProps({
            title: localize("Modifier la citation", "Edit the quote"),
            onClick: onEditClick,
          })}
        />
        <NoteDeleteIcon />
      </Flex>
      {/* )} */}
      {/* {isLoading && (
        <div className="spinner">
          <span>Chargement...</span>
        </div>
      )} */}
    </Box>
  );
};

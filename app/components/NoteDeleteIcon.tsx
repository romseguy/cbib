import { useDispatch, useSelector } from "react-redux";
import { deleteNote } from "~/api";
import { DeleteIcon, iconProps, useToast } from "~/components";
import { getState, setState } from "~/store";
import { localize } from "~/utils";

export const NoteDeleteIcon = () => {
  const { book, note } = useSelector(getState);
  const dispatch = useDispatch<any>();
  const setBook = (b) => dispatch(setState({ book: b }));
  const showToast = useToast();

  async function onDeleteClick() {
    try {
      const ok = confirm(
        localize(
          "Êtes-vous sûr de vouloir supprimer cette citation ?",
          "Do you really want to delete this quote?",
        ),
      );
      if (!ok) return;

      const { data, error } = await dispatch(
        deleteNote.initiate({
          url: "/note?id=" + note.id,
        }),
      );

      if (data.error) throw new Error(data.error);

      setBook({
        ...book,
        notes: book.notes?.filter((n) => n.id !== note.id),
      });
    } catch (error) {
      showToast(error, true);
    }
  }
  return (
    <DeleteIcon
      {...iconProps({
        title: localize("Supprimer la citation", "Delete the quote"),
        onClick: onDeleteClick,
      })}
    />
  );
};

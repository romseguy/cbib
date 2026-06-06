import type { ThemeOwnProps } from "@radix-ui/themes/components/theme.props";
import type { ModalProps, ToastProps } from "~/components";

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type User = { email: string };
export enum ENoteOrder {
  ID = "ID",
  PAGE = "PAGE",
}
export type Comment = {
  id: string;
  html: string;
  comment_email: string;
  is_feedback?: boolean;
  created_at: string;
};
export type NoteT = Note & {
  isEditing?: boolean;
  isNew?: boolean;
  index?: number;
};
export type Note = {
  id: string;
  desc: string;
  desc_en?: string;
  page?: number;
  book_id: string;
  note_email?: string;
  comments?: Comment[];
};
export type BookT = Omit<Book, "notes"> & { index: number; notes?: NoteT[] };
export type Book = {
  id: string;
  title?: string;
  title_en?: string;
  notes?: Note[];
  src?: string;
  library_id?: string;
  is_conf?: boolean;
  pos?: number;
};
export type Lib = {
  id: string;
  name: string;
  name_en?: string;
  author: string;
  author_url?: string;
  books?: BookT[];
  isVisible?: boolean;
};

export type Collections = { libraries: Lib[]; comments: Comment[] };

export type Seed = Record<
  string,
  (
    | (Omit<Lib, "id" | "books"> & {
        books: (Omit<Book, "id" | "notes"> & {
          notes?: (Omit<Note, "id" | "comments" | "book_id"> & {
            comments?: Omit<Comment, "id">[];
          })[];
        })[];
      })
    | Comment
  )[]
>;

export type RootData = {
  appearance: ThemeOwnProps["appearance"];
  collections: any;
  libs: any;
  lib?: any;
  userAgent: string;
  initialState?: { api: any; app: any };
};

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export interface AppState {
  collections: Collections;
  libs: Lib[];
  lib: Lib;
  book: BookT;
  note: NoteT;

  appearance: ThemeOwnProps["appearance"];
  auth: any;
  isMobile: boolean;
  isLoaded: boolean;
  keyword?: string;
  locale: string;
  modal: ModalProps;
  screenWidth: number;
  toast: ToastProps;
  userAgent: string;
}

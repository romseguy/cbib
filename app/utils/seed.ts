import type { Seed } from "./types";

export const collections: Seed = {
  libraries: [
    {
      name: "L'Onde",
      name_en: "The Wave",
      author: "Laura Knight-Jadczyk",
      books: [
        {
          title: "L'Onde 1",
          title_en: "The Wave 1",
          src: "https://image.jimcdn.com/app/cms/image/transf/dimension=141x10000:format=png/path/sd7739c2374e37db5/image/id624acc08d96ca45/version/1456401001/image.png",
          notes: [
            {
              page: 123,
              desc: "desc",
              desc_en: "en",
              note_email: "a@b.com",
              comments: [
                {
                  html: "stuff",
                  comment_email: import.meta.env.VITE_PUBLIC_EMAIL,
                  created_at: new Date().toISOString(),
                },
              ],
            },
            { page: 12, desc: "test" },
          ],
        },
      ],
    },
    {
      name: "Evolutionary Psychology y y y y y y y y y y y y y y",
      isVisible: false,
      author: "Bernard de Montréal",
      books: [
        {
          is_conf: true,
          title: "L'incapacité é é é é é é é é é é é é é é é é é é é é é é é é",
          title_en: "The powerlessness",
          notes: [
            {
              page: 123,
              desc: "l'incapacité des moutons",
              desc_en: "The powerlessness of the sheep",
              note_email: "a@b.com",
              comments: [
                {
                  html: "stuff",
                  comment_email: import.meta.env.VITE_PUBLIC_EMAIL,
                  created_at: new Date().toISOString(),
                },
                {
                  html: "stuff2",
                  comment_email: import.meta.env.VITE_PUBLIC_EMAIL,
                  created_at: new Date().toISOString(),
                },
              ],
            },
            { page: 12, desc: "La domination du berger" },
          ],
        },
        {
          is_conf: true,
          notes: [
            {
              page: 123,
              desc: "l'incapacité des moutons",
              desc_en: "The powerlessness of the sheep",
              note_email: "a@b.com",
              comments: [
                {
                  html: "stuff",
                  comment_email: import.meta.env.VITE_PUBLIC_EMAIL,
                  created_at: new Date().toISOString(),
                },
                {
                  html: "stuff2",
                  comment_email: import.meta.env.VITE_PUBLIC_EMAIL,
                  created_at: new Date().toISOString(),
                },
              ],
            },
            { page: 12, desc: "La domination du berger" },
          ],
        },
      ],
    },
  ],
  comments: [
    {
      id: "0",
      comment_email: import.meta.env.VITE_PUBLIC_EMAIL2,
      html: "okikko aae b okikko aae b okikko aae b okikko aae b okikko aae b okikko aae b okikko aae b okikko aae b okikko aae b okikko aae b okikko aae b okikko aae b okikko aae b okikko aae b okikko aae b okikko aae b okikko aae b okikko aae b okikko aae b okikko aae b okikko aae b",
      is_feedback: true,
      created_at: new Date().toISOString(),
    },

    {
      id: "1",
      comment_email: import.meta.env.VITE_PUBLIC_EMAIL2,
      html: "blabal aae b blabal aae b blabal aae b blabal aae b blabal aae b blabal aae b blabal aae b blabal aae b blabal aae b blabal aae b blabal aae b blabal aae b blabal aae b blabal aae b blabal aae b blabal aae b blabal aae b blabal aae b blabal aae b blabal aae b blabal aae b",
      is_feedback: true,
      created_at: new Date().toISOString(),
    },
  ],
};

export const toLibs = (libraries) =>
  libraries.map((lib, i) => {
    const id = Number(i + 1).toString();
    return {
      ...lib,
      id,
      books: lib.books?.map((book, j) => {
        const bookId = `${id}${j + 1}`;
        return {
          ...book,
          id: bookId,
          index: j,
          src: undefined,
          notes: book.notes?.map((note, k) => {
            const noteId = `${bookId}${k + 1}`;
            return {
              ...note,
              id: noteId,
              book_id: bookId,
              comments: note.comments?.map((comment, l) => ({
                ...comment,
                id: `${noteId}${l + 1}`,
              })),
            };
          }),
        };
      }),
    };
  });

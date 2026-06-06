import { Editor, type IAllProps } from "@tinymce/tinymce-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getState } from "~/store";
import { bindEvent, getImageSize, MB } from "~/utils";

type ProgressFn = (percent: number) => void;
interface BlobInfo {
  id: () => string;
  name: () => string;
  filename: () => string;
  blob: () => Blob;
  base64: () => string;
  blobUri: () => string;
  uri: () => string | undefined;
}

export const RTEditor = ({
  defaultValue,
  readOnly,
  value,
  onBlur,
  onChange,
  ...props
}: {
  defaultValue?: string | null;
  height?: number;
  //minHeight?: number;
  //maxHeight?: number;
  readOnly?: boolean;
  setIsLoading?: (bool: boolean) => void;
  value?: string;
  onBlur?: (html: string) => void;
  onChange?: ({ html }: { html: string }) => void;
}) => {
  const { isMobile } = useSelector(getState);
  const isDark = true;

  const currentIndex = 0;
  const [isLoading, setIsLoading] = useState(true);
  const [isTouched, setIsTouched] = useState(false);
  const [shortId, setShortId] = useState<string | undefined>();
  const [minHeight, setMinHeight] = useState(238);
  const [maxHeight, setMaxHeight] = useState(238);
  //useEffect(() => setMaxHeight(window.innerHeight - 250), []);

  //#region tinymce
  const editorRef = useRef<any | null>(null);
  const closeToolbar = useCallback(() => {
    const editor = editorRef.current;
    if (editor) {
      editor.on("keydown", (e) => {
        if (e.keyCode === 27) {
          //escape
        }
      });

      if (editor.queryCommandState("ToggleToolbarDrawer")) {
        try {
          editor.execCommand("ToggleToolbarDrawer");
        } catch (error) {
          console.error(error);
        }
      }
    }
  }, [editorRef]);
  const init: IAllProps["init"] = {
    contextmenu: "",
    //contextmenu_never_use_native: true,
    menubar: false,
    statusbar: false,
    plugins: [
      "anchor",
      "autolink",
      "autoresize",
      "charmap",
      "code",
      "emoticons",
      "fullscreen",
      "help",
      //"hr",
      "image",
      "link",
      "lists",
      "media",
      //"paste",
      "searchreplace",
    ],
    toolbar: [
      {
        name: "",
        items: [
          "fullscreen",
          "searchreplace",
          "undo",
          "redo",
          "removeformat",
          "emoticons",
          "bold",
          "italic",
          "underline",
          "forecolor",
          "align",
          "bullist",
          "numlist",
          "outdent",
          "indent",
          "fontsizeinput",
          "blockquote",
          "hr",
          "link",
          "unlink",
          "image",
          "media",
          "code",
          "help",
        ],
      },
    ],
    images_upload_handler,
    file_picker_types: "image",
    file_picker_callback: onImageClick,

    auto_focus: true,
    branding: false,
    browser_spellcheck: true,
    content_css: isDark ? "dark" : undefined,
    content_style: `
      body {
        font-family: 'Spectral', Georgia, ui-serif, serif;
        font-size: ${isMobile ? "16px" : "19px"};
        text-align: justify;
      }
      blockquote {
        border-left: 2px solid white;
        margin-left: 3px;
        margin-right: 12px;
        padding-left: 12px;
      }
      hr {
        border-top-width: 3px;
        margin: ${isMobile ? "0" : "0 24px"};
      }
      p {
        margin: 0;
        padding: 0;
      }
    `,
    convert_urls: false,
    document_base_url: import.meta.env.VITE_PUBLIC_URL,
    //font_css: "/spectral.css",
    //font_family_formats: "Spectral",
    font_family_formats:
      "Spectral;Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;",
    // https://www.tiny.cloud/docs/tinymce/6/content-behavior-options/#newline_behavior
    forced_root_block_attrs: { style: "text-align: justify;" },
    //height: props.height || 250,
    language: "fr_FR",
    language_url: "/tinymce/langs/fr_FR.js",
    link_default_target: "_blank",
    paste_postprocess: (editor, args) => {
      args.node.setAttribute("target", "_blank");
    },
    min_height: minHeight,
    max_height: maxHeight,
    skin: isDark ? "oxide-dark" : undefined,
    text_patterns: [
      { start: "*", end: "*", format: "italic" },
      { start: "**", end: "**", format: "bold" },
      { start: "#", format: "h1" },
      { start: "##", format: "h2" },
      { start: "###", format: "h3" },
      { start: "####", format: "h4" },
      { start: "#####", format: "h5" },
      { start: "######", format: "h6" },
      // The following text patterns require the `lists` plugin
      { start: "1. ", cmd: "InsertOrderedList" },
      { start: "* ", cmd: "InsertUnorderedList" },
      { start: "- ", cmd: "InsertUnorderedList" },
    ],
  };

  // function onImageClick(
  //   cb: Function
  //   /*
  //     value: any,
  //     meta: Record<string, any>
  //     */
  // ) {
  //   const input = document.createElement("input");
  //   input.setAttribute("type", "file");
  //   input.setAttribute("accept", "image/*");
  //   input.onchange = onFileInputChange;
  //   input.click();

  //   function onFileInputChange() {
  //     //@ts-expect-error
  //     const file = this.files[0];
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       if (typeof reader.result !== "string") return;
  //       const id = "blobid" + new Date().getTime();
  //       const blobCache = editorRef.current!.editorUpload.blobCache;
  //       const base64 = reader.result.split(",")[1];
  //       const blobInfo = blobCache.create(id, file, base64);
  //       blobCache.add(blobInfo);
  //       cb(blobInfo.blobUri(), { title: file.name });
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

  // async function uploadImage(
  //   blobInfo: BlobInfo,
  //   success: (url: string) => void,
  //   failure: (err: string, options?: UploadFailureOptions) => void,
  //   progress?: (percent: number) => void
  // ) {
  //   let formData = new FormData();
  //   const file = blobInfo.blob();

  //   if (file.size >= 10 * MB) {
  //     toast({
  //       status: "error",
  //       title: "L'image ne doit pas dépasser 10Mo."
  //     });
  //     return;
  //   }

  //   formData.append("files[]", file, blobInfo.filename());
  //   if (event) formData.append("eventId", event._id);
  //   else if (org) formData.append("orgId", org._id);
  //   else if (session) formData.append("userId", session.user.userId);

  //   try {
  //     const mutation = await client.post("/", formData);
  //     if (mutation.status !== 200) {
  //       failure("Erreur dans la sauvegarde des images", {
  //         remove: true
  //       });
  //       return;
  //     }
  //     if (typeof mutation.data.file !== "string") {
  //       failure("Réponse invalide", { remove: true });
  //       return;
  //     }

  //     let url = `${process.env.NEXT_PUBLIC_API2}/view?fileName=${mutation.data.file}`;
  //     if (event) url += `&eventId=${event._id}`;
  //     else if (org) url += `&orgId=${org._id}`;
  //     else if (session) url += `&userId=${session.user.userId}`;

  //     success(url);
  //   } catch (error) {
  //     console.error(error);
  //     failure("Erreur dans la sauvegarde des images", {
  //       remove: true
  //     });
  //   }
  // }
  //#endregion

  useEffect(() => {
    //dispatch(incrementRTEditorIndex());
    setShortId(`rteditor-${currentIndex + 1}`);
    //   if (editorRef.current) {
    //     console.log(editorRef.current.getContent());
    //   }
  }, []);

  function images_upload_handler(
    blobInfo: BlobInfo,
    progress: ProgressFn,
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const file = blobInfo.blob();

      if (file.size >= 10 * MB) {
        // showToast({
        //    "L'image ne doit pas dépasser 10Mo.",true
        // });
        reject("L'image ne doit pas dépasser 10Mo.");
      }

      // const { width, height } = await getImageSize(file);
      // let payload: AddDocumentPayload = {
      //   documentName: blobInfo.filename(),
      //   documentHeight: height,
      //   documentWidth: width,
      //   documentTime: new Date().getTime(),
      //   documentBytes: file.size,
      // };
      // const { documentId } = await addDocument(payload).unwrap();

      // if (documentId) {
      const formData = new FormData();
      formData.append("file", file, blobInfo.filename());
      const xhr = new XMLHttpRequest();
      xhr.overrideMimeType("application/json");
      //xhr.responseType = "json";
      xhr.withCredentials = false;
      xhr.open("POST", import.meta.env.VITE_PUBLIC_API2);

      xhr.upload.onprogress = (e) => {
        progress((e.loaded / e.total) * 100);
      };

      xhr.onload = () => {
        if (xhr.status !== 200) {
          reject({ message: "HTTP Error: " + xhr.status, remove: true });
          return;
        }
        const data = JSON.parse(xhr.responseText);
        if (!data || typeof data.file !== "string") {
          reject("Invalid JSON: " + xhr.responseText);
          return;
        }
        resolve(import.meta.env.VITE_PUBLIC_FILES + "/" + data.file);
      };

      xhr.onerror = () => {
        reject(
          "Image upload failed due to a XHR Transport error. Code: " +
            xhr.status,
        );
      };
      xhr.send(formData);
      //}
    });
  }

  function onImageClick(
    cb: Function,
    /*
      value: any,
      meta: Record<string, any>
      */
  ) {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.onchange = onFileInputChange;
    input.click();

    function onFileInputChange() {
      //@ts-expect-error
      const file = this.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result !== "string") return;
        const id = "blobid" + new Date().getTime();
        const blobCache = editorRef.current!.editorUpload.blobCache;
        const base64 = reader.result.split(",")[1];
        const blobInfo = blobCache.create(id, file, base64);
        blobCache.add(blobInfo);
        cb(blobInfo.blobUri(), { title: file.name });
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <>
      {shortId && (
        <Editor
          disabled={readOnly}
          id={shortId}
          init={init}
          initialValue={/*isTouched ? undefined :*/ defaultValue || ""}
          tinymceScriptSrc="/tinymce/tinymce.min.js"
          value={value}
          onBlur={(e, editor) => {
            closeToolbar();
            onBlur && onBlur(editor.getContent());
          }}
          onEditorChange={(html, editor) => {
            onChange && onChange({ html });

            if (html !== defaultValue) {
              setIsTouched(true);
            }
          }}
          onInit={(evt, editor) => {
            setIsLoading(false);
            props.setIsLoading && props.setIsLoading(false);
            editorRef.current = editor;
            const target = editor.contentDocument.documentElement;

            if (target) {
              bindEvent(target, "click", () => {
                closeToolbar();
              });
            }
          }}
        />
      )}
    </>
  );
};

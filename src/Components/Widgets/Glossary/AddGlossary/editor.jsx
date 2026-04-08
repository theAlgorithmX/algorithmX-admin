import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";
import { Editor } from "@tinymce/tinymce-react";

const WordEditor = forwardRef(({ updateContent, initialContent = "" }, ref) => {
  const editorRef = useRef(null);

  // Add useEffect to handle initialContent changes
  useEffect(() => {
    console.log("Editor received initialContent:", initialContent);
    if (initialContent && editorRef.current) {
      console.log("Setting editor content to:", initialContent);
      editorRef.current.setContent(initialContent);
    }
  }, [initialContent]);

  useImperativeHandle(ref, () => ({
    getContent: () => {
      return editorRef.current?.getContent() || "";
    },
    setContent: (html) => {
      if (editorRef.current) {
        editorRef.current.setContent(html);
      }
    },
    focus: () => {
      editorRef.current?.focus();
    },
  }));

  return (
    <div className=" py-10">
      <div className="rounded-lg p-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            Glossary Description Editor
          </h2>
        </div>
        <Editor
          apiKey="jnwzo6x0ch3vfi76ixspm2353f8kmb7rp87xiqlaksgesnxh"
          onInit={(evt, editor) => {
            editorRef.current = editor;
          }}
          initialValue={initialContent}
          init={{
            height: 500,
            menubar: false,
            plugins: [
              "anchor",
              "autolink",
              "charmap",
              "codesample",
              "emoticons",
              "image",
              "link",
              "lists",
              "media",
              "searchreplace",
              "table",
              "visualblocks",
              "wordcount",
              "advlist",
              "code",
              "directionality",
              "fullscreen",
              "help",
              "importcss",
              "insertdatetime",
              "nonbreaking",
              "pagebreak",
              "preview",
              "quickbars",
              "save",
              "visualchars",
            ],
            toolbar:
              "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",

            branding: false,
            promotion: false,
            resize: false,
            statusbar: false,
            paste_data_images: true,
            browser_spellcheck: true,
            contextmenu: false,
            automatic_uploads: true,
            file_picker_types: "image",

            // Image upload handler
            images_upload_handler: (blobInfo) => {
              return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () =>
                  reject(`Image upload failed: ${reader.error}`);
                reader.readAsDataURL(blobInfo.blob());
              });
            },

            file_picker_callback: (callback, value, meta) => {
              if (meta.filetype === "image") {
                const input = document.createElement("input");
                input.setAttribute("type", "file");
                input.setAttribute("accept", "image/*");
                input.addEventListener("change", (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      callback(reader.result, { alt: file.name });
                    };
                    reader.readAsDataURL(file);
                  }
                });
                input.click();
              }
            },

            setup: (editor) => {
              editor.on("blur", () => {
                const content = editor.getContent();
                updateContent?.(content);
              });
            },

            // Optional settings for clean HTML output
            entity_encoding: "raw",
            verify_html: false,
            cleanup: false,
            forced_root_block: "p",
          }}
        />
      </div>
    </div>
  );
});

WordEditor.displayName = "WordEditor";

export default WordEditor;

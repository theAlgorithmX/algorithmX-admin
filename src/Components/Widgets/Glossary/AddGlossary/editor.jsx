import React, {
  forwardRef,
  useImperativeHandle,
  useCallback,
  useEffect,
} from "react";
import { Editor } from "@tinymce/tinymce-react";

const WordEditor = forwardRef(({ updateContent, initialContent = "" }, ref) => {
  const editorRef = React.useRef(null);
  const [content, setContent] = React.useState(initialContent);

  // Add useEffect to handle initialContent changes
  useEffect(() => {
    console.log("Editor received initialContent:", initialContent);
    if (initialContent && editorRef.current) {
      console.log("Setting editor content to:", initialContent);
      setContent(initialContent);
      editorRef.current.setContent(initialContent);
    }
  }, [initialContent]);

  useImperativeHandle(ref, () => ({
    getContent: () => {
      const content = editorRef.current?.getContent() || "";
      console.log("Getting editor content:", content);
      return content;
    },
    setContent: (html) => {
      console.log("Setting editor content via ref:", html);
      if (editorRef.current) {
        editorRef.current.setContent(html);
        setContent(html);
      }
    },
    focus: () => {
      if (editorRef.current) {
        editorRef.current.focus();
      }
    },
  }));

  // Debounced content update to prevent excessive re-renders
  const debouncedUpdateContent = useCallback(
    (newContent) => {
      let timeoutId;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setContent(newContent);
        if (updateContent) {
          updateContent(newContent);
        }
      }, 100);
    },
    [updateContent]
  );

  // Fixed image upload handler with proper Promise handling
  const handleImageUpload = (blobInfo, success, failure, progress) => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();

        reader.onload = () => {
          const result = reader.result;
          success(result);
          resolve(result);
        };

        reader.onerror = (error) => {
          console.error("Image upload failed:", error);
          failure("Image upload failed");
          reject(error);
        };

        reader.readAsDataURL(blobInfo.blob());
      } catch (error) {
        console.error("Error in image upload handler:", error);
        failure("Image upload failed");
        reject(error);
      }
    });
  };

  return (
    <div className="bg-white py-10">
      <div className="rounded-lg shadow-lg p-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Post Description Editor
          </h2>
        </div>
        <Editor
          apiKey="ua8x8h7a2upzgedzsg60aa0xyx1304nkt4p15rrv3iovvrps"
          onInit={(evt, editor) => {
            console.log("Editor initialized");
            editorRef.current = editor;
            if (initialContent) {
              console.log("Setting initial content on init:", initialContent);
              editor.setContent(initialContent);
            }
          }}
          value={content}
          onEditorChange={(newContent) => {
            console.log("Editor content changed:", newContent);
            setContent(newContent);
            updateContent?.(newContent);
          }}
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
              "autoresize",
              "autosave",
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
            content_style:
              "body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; }",
            branding: false,
            promotion: false,
            resize: false,
            statusbar: false,
            paste_data_images: true,
            // Performance optimizations
            browser_spellcheck: true,
            contextmenu: false,
            // Reduced update frequency to prevent cursor issues
            update_interval: 300,
            // Fixed image upload configuration
            images_upload_handler: handleImageUpload,
            automatic_uploads: true,
            file_picker_types: "image",
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
                      callback(reader.result, {
                        alt: file.name,
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                });

                input.click();
              }
            },
            setup: (editor) => {
              editor.on("init", () => {
                if (editor.getBody()) {
                  editor.getBody().style.fontSize = "14px";
                }
              });

              // Add error handling for image uploads
              editor.on("ImageUploadError", (e) => {
                console.error("Image upload error:", e);
              });

              // Optimized paste handler to prevent cursor issues
              editor.on("paste", (e) => {
                const items = e.clipboardData?.items;
                if (items) {
                  for (let i = 0; i < items.length; i++) {
                    if (items[i].type.indexOf("image") !== -1) {
                      e.preventDefault(); // Prevent default paste behavior
                      const blob = items[i].getAsFile();
                      if (blob) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          // Use execCommand instead of insertContent for better cursor handling
                          editor.execCommand(
                            "mceInsertContent",
                            false,
                            `<img src="${reader.result}" alt="Pasted image" />`
                          );
                        };
                        reader.readAsDataURL(blob);
                      }
                      break;
                    }
                  }
                }
              });

              // Prevent issues with rapid updates
              let updateTimeout;
              editor.on("input", () => {
                clearTimeout(updateTimeout);
                updateTimeout = setTimeout(() => {
                  // Force cursor position maintenance
                  const bookmark = editor.selection.getBookmark();
                  setTimeout(() => {
                    editor.selection.moveToBookmark(bookmark);
                  }, 0);
                }, 50);
              });
            },
          }}
        />
      </div>
    </div>
  );
});

WordEditor.displayName = "WordEditor";

export default WordEditor;

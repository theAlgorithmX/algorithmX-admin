import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import WordEditor from "./editor";

export default function AddGuideForm({ onSubmit, guideId }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [initialEditorContent, setInitialEditorContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      summary: "",
      tag: "",
      content: "",
    },
  });

  const editorRef = useRef(null);

  const updateEditorContent = (content) => {
    setValue("content", content, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (guideId && typeof guideId === "object" && guideId.data) {
      setIsEditMode(true);
      const guide = guideId.data;
      setInitialEditorContent(guide.content || "");
      if (guide.guide_image) {
        setImagePreview(guide.guide_image);
      }
      reset({
        title: guide.title || "",
        summary: guide.summary || "",
        tag: guide.tag || "",
        content: guide.content || "",
      });
    } else {
      setIsEditMode(false);
      setInitialEditorContent("");
      setSelectedImage(null);
      setImagePreview("");
      reset({
        title: "",
        summary: "",
        tag: "",
        content: "",
      });
    }
  }, [guideId]);

  const handleFormKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      e.target.tagName !== "TEXTAREA" &&
      e.target.type !== "submit"
    ) {
      e.preventDefault();
    }
  };

  const getEditorContent = () => {
    if (editorRef.current && editorRef.current.getContent) {
      const editorContent = editorRef.current.getContent();
      setValue("content", editorContent);
      return editorContent;
    }
    return watch("content");
  };

  return (
    <form
      onSubmit={handleSubmit((data) => {
        const currentContent = getEditorContent();
        const finalData = {
          ...data,
          content: currentContent,
          guide_image: selectedImage,
        };
        if (!finalData.content || finalData.content.trim() === "") {
          toast.error("Content is required");
          return;
        }
        onSubmit(finalData);
      })}
      onKeyDown={handleFormKeyDown}
      className="space-y-6 max-w-5xl mx-auto px-6 py-4 bg-white"
    >
      <h1 className="text-[32px] font-semibold text-center">
        {isEditMode ? "Update Guide" : "Add Guide"}
      </h1>
      {/* Title */}
      <div>
        <label className="block mb-1 font-medium">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          {...register("title", { required: "Title is required" })}
          placeholder="Enter Guide Title"
          className={`w-full p-2 border rounded ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>
      {/* Summary */}
      <div>
        <label className="block mb-1 font-medium">
          Summary <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("summary", { required: "Summary is required" })}
          placeholder="Enter a brief summary"
          rows={3}
          className={`w-full p-2 border rounded ${
            errors.summary ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.summary && (
          <p className="text-red-500 text-sm">{errors.summary.message}</p>
        )}
      </div>
      {/* Tag */}
      <div>
        <label className="block mb-1 font-medium">
          Tag <span className="text-red-500">*</span>
        </label>
        <input
          {...register("tag", { required: "Tag is required" })}
          placeholder="Enter Tag"
          className={`w-full p-2 border rounded ${
            errors.tag ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.tag && (
          <p className="text-red-500 text-sm">{errors.tag.message}</p>
        )}
      </div>
      {/* Guide Image Upload */}
      <div>
        <label className="block mb-1 font-medium">
          Guide Image <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Guide preview"
              className="w-32 h-32 object-cover rounded border"
            />
          </div>
        )}
      </div>
      {/* Editor */}
      <WordEditor
        ref={editorRef}
        updateContent={updateEditorContent}
        initialContent={isEditMode ? initialEditorContent : watch("content")}
        onBlur={() => {
          if (editorRef.current && editorRef.current.getContent) {
            const content = editorRef.current.getContent();
            setValue("content", content);
          }
        }}
      />
      <div className="text-center mt-6">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {isEditMode ? "Update Guide" : "Submit Guide"}
        </button>
      </div>
    </form>
  );
} 
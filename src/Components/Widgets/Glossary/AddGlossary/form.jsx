// BlogForm.jsx
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import WordEditor from "./editor";
import axiosHttp from "../../../../utils/httpConfig";

export default function BlogForm({ onSubmit, blogId }) {
  console.log(blogId, "blogId");
  const [isEditMode, setIsEditMode] = useState(false);
  const [initialEditorContent, setInitialEditorContent] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      keyword: "",
      summary: "",
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

  const getBlogById = async () => {
    try {
      const response = await axiosHttp.get(`/glossary/glossaries/${blogId}`);
      if (response?.status === 200) {
        // Set edit mode to true
        setIsEditMode(true);

        // Get blog data from response
        const glossaryData = response.data.data;
        console.log("API Response:", response.data);
        console.log("Glossary Data:", glossaryData);

        // Set initial editor content first
        setInitialEditorContent(glossaryData.content || "");

        // Then reset form with all data
        reset({
          keyword: glossaryData.keyword || "",
          summary: glossaryData.summary || "",
          content: glossaryData.content || "",
        });
      }
    } catch (err) {
      console.error("Error fetching glossary:", err);
      toast.warning(err?.response?.data?.message || "Failed to load glossary");
    }
  };

  useEffect(() => {
    if (blogId) {
      getBlogById();
    } else {
      // Make sure we're in add mode when no blogId is present
      setIsEditMode(false);
      setInitialEditorContent("");

      // Reset form to default values when switching to add mode
      reset({
        keyword: "",
        summary: "",
        content: "",
      });
    }
  }, [blogId]);

  // Add effect to monitor initialEditorContent changes
  useEffect(() => {
    console.log("Initial editor content changed:", initialEditorContent);
  }, [initialEditorContent]);

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
        // Get the latest content from editor before submitting
        const currentContent = getEditorContent();
        const finalData = {
          ...data,
          content: currentContent,
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
        {isEditMode ? "Update Glossary" : "Add Glossary"}
      </h1>

      {/* Title */}
      <div>
        <label className="block mb-1 font-medium">
          Keyword <span className="text-red-500">*</span>
        </label>
        <input
          {...register("keyword", { required: "Keyword is required" })}
          placeholder="Enter Keyword "
          className={`w-full p-2 border rounded ${
            errors.keyword ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.keyword && (
          <p className="text-red-500 text-sm">{errors.keyword.message}</p>
        )}
      </div>

      {/* Summary */}
      <div>
        <label className="block mb-1 font-medium">
          Summary <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("summary", { required: "Summary is required" })}
          placeholder="Enter a brief summary of the blog post"
          rows={3}
          className={`w-full p-2 border rounded ${
            errors.summary ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.summary && (
          <p className="text-red-500 text-sm">{errors.summary.message}</p>
        )}
      </div>

      {/* Modify the WordEditor props */}
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
          {isEditMode ? "Update Glossary" : "Submit Glossary"}
        </button>
      </div>
    </form>
  );
}

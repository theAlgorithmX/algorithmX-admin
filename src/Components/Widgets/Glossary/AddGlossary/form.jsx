// Glossary.jsx
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
      slug: "",
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
        setIsEditMode(true);
        const glossaryData = response.data.data;

        setInitialEditorContent(glossaryData.content || "");

        reset({
          keyword: glossaryData.keyword || "",
          slug: glossaryData.slug || "",
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
      setIsEditMode(false);
      setInitialEditorContent("");
      reset({
        keyword: "",
        slug: "",
        summary: "",
        content: "",
      });
    }
  }, [blogId]);

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
        };

        if (!finalData.content || finalData.content.trim() === "") {
          toast.error("Content is required");
          return;
        }
        onSubmit(finalData);
      })}
      onKeyDown={handleFormKeyDown}
      className="space-y-6 max-w-5xl mx-auto px-6 py-4 "
    >
      <h1 className="text-[32px] font-semibold text-center text-white">
        {isEditMode ? "Update Glossary" : "Add Glossary"}
      </h1>

      {/* Keyword */}
      <div>
        <label className="block mb-1 font-medium text-white">
          Keyword <span className="text-red-500">*</span>
        </label>
        <input
          {...register("keyword", { required: "Keyword is required" })}
          placeholder="Enter Keyword "
          className={`w-full p-2 border rounded bg-white/10 backdrop-blur-sm text-white placeholder-white/70 ${
            errors.keyword ? "border-red-500" : "border-white/20"
          }`}
        />
        {errors.keyword && (
          <p className="text-red-500 text-sm">{errors.keyword.message}</p>
        )}
      </div>

      {/* Slug */}
      <div>
        <label className="block mb-1 font-medium text-white">
          Slug <span className="text-red-500">*</span>
        </label>
        <input
          {...register("slug", { required: "Slug is required" })}
          placeholder="Enter Slug (e.g. my-keyword)"
          className={`w-full p-2 border rounded bg-white/10 backdrop-blur-sm text-white placeholder-white/70 ${
            errors.slug ? "border-red-500" : "border-white/20"
          }`}
        />
        {errors.slug && (
          <p className="text-red-500 text-sm">{errors.slug.message}</p>
        )}
      </div>

      {/* Summary */}
      <div>
        <label className="block mb-1 font-medium text-white">
          Summary <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("summary", { required: "Summary is required" })}
          placeholder="Enter a brief summary of the blog post"
          rows={3}
          className={`w-full p-2 border rounded bg-white/10 backdrop-blur-sm text-white placeholder-white/70 ${
            errors.summary ? "border-red-500" : "border-white/20"
          }`}
        />
        {errors.summary && (
          <p className="text-red-500 text-sm">{errors.summary.message}</p>
        )}
      </div>

      {/* Content Editor */}
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
          className="bg-white/10 shadow-lg shadow-black/10 backdrop-blur-sm hover:bg-white/20 text-white px-6 py-2 rounded "
        >
          {isEditMode ? "Update Glossary" : "Submit Glossary"}
        </button>
      </div>
    </form>
  );
}

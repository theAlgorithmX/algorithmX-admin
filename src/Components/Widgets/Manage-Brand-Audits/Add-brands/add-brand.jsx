// BrandForm.jsx
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import WordEditor from "./editor";
import axiosHttp from "../../../../utils/httpConfig";

export default function BrandForm({ onSubmit, brandId }) {
  console.log(brandId, "brandId");
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
      description: "",
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

  const getBrandById = async () => {
    try {
      const response = await axiosHttp.get(`/brands/${brandId}`);
      if (response?.status === 200) {
        // Set edit mode to true
        setIsEditMode(true);

        // Get brand data from response
        const brandData = response.data.data;
        console.log("API Response:", response.data);
        console.log("Brand Data:", brandData);

        // Set initial editor content first
        setInitialEditorContent(brandData.content || "");

        // Set image preview if exists
        if (brandData.image) {
          setImagePreview(brandData.image);
        }

        // Then reset form with all data
        reset({
          title: brandData.title || "",
          description: brandData.description || "",
          content: brandData.content || "",
        });
      }
    } catch (err) {
      console.error("Error fetching brand:", err);
      toast.warning(err?.response?.data?.message || "Failed to load brand");
    }
  };

  useEffect(() => {
    if (brandId) {
      getBrandById();
    } else {
      // Make sure we're in add mode when no brandId is present
      setIsEditMode(false);
      setInitialEditorContent("");
      setSelectedImage(null);
      setImagePreview("");

      // Reset form to default values when switching to add mode
      reset({
        title: "",
        description: "",
        content: "",
      });
    }
  }, [brandId]);

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
          image: selectedImage,
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
        {isEditMode ? "Update Brand" : "Add Brand"}
      </h1>

      {/* Title */}
      <div>
        <label className="block mb-1 font-medium">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          {...register("title", { required: "Title is required" })}
          placeholder="Enter Brand Title"
          className={`w-full p-2 border rounded ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block mb-1 font-medium">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("description", { required: "Description is required" })}
          placeholder="Enter a brief description of the brand"
          rows={3}
          className={`w-full p-2 border rounded ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block mb-1 font-medium">
          Brand Image <span className="text-red-500">*</span>
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
              alt="Brand preview"
              className="w-32 h-32 object-cover rounded border"
            />
          </div>
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
          {isEditMode ? "Update Brand" : "Submit Brand"}
        </button>
      </div>
    </form>
  );
}

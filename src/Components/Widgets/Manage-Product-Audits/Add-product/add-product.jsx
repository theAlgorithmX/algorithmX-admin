import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import WordEditor from "./editor";
import axiosHttp from "../../../../utils/httpConfig";

export default function ProductForm({ onSubmit, productId }) {
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
      name: "",
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

  const getProductById = async () => {
    try {
      const response = await axiosHttp.get(`/product-audit/${productId}`);
      if (response?.status === 200) {
        setIsEditMode(true);
        const productData = response.data.data;
        setInitialEditorContent(productData.content || "");
        if (productData.productAuditCover) {
          setImagePreview(productData.productAuditCover);
        }
        reset({
          name: productData.title || "",
          description: productData.description || "",
          content: productData.content || "",
        });
      }
    } catch (err) {
      toast.warning(err?.response?.data?.message || "Failed to load product");
    }
  };

  useEffect(() => {
    if (productId) {
      getProductById();
    } else {
      setIsEditMode(false);
      setInitialEditorContent("");
      setSelectedImage(null);
      setImagePreview("");
      reset({
        name: "",
        description: "",
        content: "",
      });
    }
  }, [productId]);

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
          product_image: selectedImage,
        };
        if (!finalData.content || finalData.content.trim() === "") {
          toast.error("Content is required");
          return;
        }
        onSubmit(finalData);
      })}
      onKeyDown={handleFormKeyDown}
      className="space-y-6 max-w-5xl mx-auto px-6 py"
    >
      <h1 className="text-[32px] font-semibold text-center text-white">
        {isEditMode ? "Update Product" : "Add Product"}
      </h1>
      {/* Name */}
      <div>
        <label className="block mb-1 font-medium text-white">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          {...register("name", { required: "Name is required" })}
          placeholder="Enter Product Name"
          className="w-full p-3 rounded-lg bg-white/10 shadow-lg shadow-black/10 backdrop-blur-sm 
               text-white caret-white placeholder:text-white/70 
               focus:outline-none border border-white/20"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>
      {/* Description */}
      <div>
        <label className="block mb-1 font-medium text-white">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("description", { required: "Description is required" })}
          placeholder="Enter a brief description of the product"
          rows={3}
          className="w-full p-3 rounded-lg bg-white/10 shadow-lg shadow-black/10 backdrop-blur-sm 
               text-white caret-white placeholder:text-white/70 
               focus:outline-none border border-white/20"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>
      {/* Product Image Upload */}
      <div>
        <label className="block mb-1 font-medium text-white">
          Product Image <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-3 rounded-lg bg-white/10 shadow-lg shadow-black/10 backdrop-blur-sm 
               text-white caret-white placeholder:text-white/70 
               file:text-white file:bg-transparent 
               focus:outline-none border border-white/20 cursor-pointer"
        />

        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Product preview"
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
          {isEditMode ? "Update Product" : "Submit Product"}
        </button>
      </div>
    </form>
  );
}

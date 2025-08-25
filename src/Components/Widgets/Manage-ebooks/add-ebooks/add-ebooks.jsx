// EbookForm.jsx
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axiosHttp from "../../../../utils/httpConfig";
import { useLocation } from "react-router-dom";

export default function EbookForm({ onSubmit, ebookId: propEbookId }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryEbookId = searchParams.get("id");
  const ebookId = propEbookId || queryEbookId;
  console.log(ebookId, "ebookId");
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCoverImage, setCurrentCoverImage] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);

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
      coverImage: null,
      file: null,
    },
  });

  const getEbookById = async () => {
    try {
      // Use the correct endpoint as per user: '/ebook/:id'
      const response = await axiosHttp.get(`/ebook/${ebookId}`);
      if (response?.status === 200) {
        setIsEditMode(true);
        // The API response structure should match the list view
        const ebookData = response.data.data;
        setCurrentCoverImage(ebookData.ebookCover || null);
        setCurrentFile(ebookData.file || null);
        setCoverImagePreview(ebookData.ebookCover || null);
        reset({
          title: ebookData.title || "",
          description: ebookData.description || "",
          coverImage: null, // Don't set file inputs in reset
          file: null,
        });
      }
    } catch (err) {
      console.error("Error fetching ebook:", err);
      toast.warning(err?.response?.data?.message || "Failed to load ebook");
    }
  };

  useEffect(() => {
    if (ebookId) {
      getEbookById();
    } else {
      // Make sure we're in add mode when no ebookId is present
      setIsEditMode(false);
      setCurrentCoverImage(null);
      setCurrentFile(null);
      setCoverImagePreview(null);

      // Reset form to default values when switching to add mode
      reset({
        title: "",
        description: "",
        coverImage: null,
        file: null,
      });
    }
  }, [ebookId]);

  const handleFormKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      e.target.tagName !== "TEXTAREA" &&
      e.target.type !== "submit"
    ) {
      e.preventDefault();
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("coverImage", file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("file", file);
    }
  };

  const onFormSubmit = async (data) => {
    // Create FormData for file uploads
    const formData = new FormData();

    // Add payload data, sending null if empty
    const payload = {
      title: data.title, // Title is required, so no null fallback
      description:
        data.description && data.description.trim() !== ""
          ? data.description
          : null,
    };

    // Add text fields to FormData
    Object.keys(payload).forEach((key) => {
      formData.append(key, payload[key]);
    });

    // Add files to FormData, send null if not present
    if (data.coverImage) {
      formData.append("ebookCover", data.coverImage);
    } else {
      formData.append("ebookCover", null);
    }

    if (data.file) {
      formData.append("file", data.file);
    } else {
      formData.append("file", null);
    }

    // Log FormData key-value pairs as a plain object
    const formDataObj = {};
    formData.forEach((value, key) => {
      formDataObj[key] = value;
    });
    console.log("FormData being sent:", formDataObj);

    try {
      if (ebookId) {
        // Edit mode: PUT /ebooks/:id
        const response = await axiosHttp.put(`/ebook/${ebookId}`, formData);
        if (response?.status === 200) {
          toast.success("Ebook updated successfully");
        }
      } else {
        // Add mode: POST /ebooks
        const response = await axiosHttp.post("/ebook/", formData);
        if (response?.status === 201 || response?.status === 200) {
          toast.success("Ebook added successfully");
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit ebook");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      onKeyDown={handleFormKeyDown}
      className="space-y-6 max-w-5xl mx-auto px-6 py-4 "
    >
      <h1 className="text-[32px] font-semibold text-center text-white">
        {isEditMode ? "Update Ebook" : "Add Ebook"}
      </h1>

      {/* Title */}
      <div>
        <label className="block mb-1 font-medium text-white">Title</label>
        <input
          {...register("title", { required: "Title is required" })}
          placeholder="Enter Title"
          className="w-full p-3 rounded-lg bg-white/10 shadow-lg shadow-black/10 backdrop-blur-sm 
               text-white caret-white placeholder:text-white/70 
               focus:outline-none border border-white/20"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block mb-1 font-medium text-white">Description</label>
        <textarea
          {...register("description")}
          placeholder="Enter description"
          rows={4}
          className="w-full p-3 rounded-lg bg-white/10 shadow-lg shadow-black/10 backdrop-blur-sm 
               text-white caret-white placeholder:text-white/70 
               focus:outline-none border border-white/20"
        />
      </div>

      {/* Cover Image */}
      <div>
        <label className="block mb-1 font-medium text-white">Cover Icons</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleCoverImageChange}
          className="w-full p-3 rounded-lg bg-white/10 shadow-lg shadow-black/10 backdrop-blur-sm 
               text-white caret-white placeholder:text-white/70 
               file:text-white file:bg-transparent 
               focus:outline-none border border-white/20 cursor-pointer"
        />
      </div>

      {/* File Upload */}
      <div>
        <label className="block mb-1 font-medium text-white">Upload File</label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="w-full p-3 rounded-lg bg-white/10 shadow-lg shadow-black/10 backdrop-blur-sm 
               text-white caret-white placeholder:text-white/70 
               file:text-white file:bg-transparent 
               focus:outline-none border border-white/20 cursor-pointer"
        />
      </div>

      <div className="text-center mt-6">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {isEditMode ? "Update Ebook" : "Submit Ebook"}
        </button>
      </div>
    </form>
  );
}

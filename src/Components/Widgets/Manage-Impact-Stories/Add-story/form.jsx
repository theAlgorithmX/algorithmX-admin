// StoryForm.jsx - Impact Stories Form Component
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import axiosHttp from "../../../../utils/httpConfig";

// Custom Tag Input component
const TagInput = ({ value = [], onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      const newValue = [...value, inputValue.trim()];
      onChange(newValue);
      setInputValue("");
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddTag = () => {
    if (inputValue.trim() !== "") {
      const newValue = [...value, inputValue.trim()];
      onChange(newValue);
      setInputValue("");
    }
  };

  const handleRemoveTag = (index) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 p-2 border border-gray-300 rounded"
        />
        <button
          type="button"
          onClick={handleAddTag}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {value.map((tag, index) => (
          <div
            key={index}
            className="bg-blue-100 px-3 py-1 rounded-full flex items-center gap-2"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => handleRemoveTag(index)}
              className="text-red-500 font-bold"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function StoryForm({ onSubmit }) {
  const [searchParams] = useSearchParams();
  const storyId = searchParams.get("storyId");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      tags: [],
      impact_story_media: null,
    },
  });

  const currentMedia = watch("impact_story_media") || "";

  // Get impact story by ID for editing
  const getImpactStoryById = async () => {
    try {
      setIsLoading(true);
      const response = await axiosHttp.get(`/impact-story/${storyId}`);
      console.log("API Response:", response.data);

      if (response?.status === 200) {
        // Set edit mode to true
        setIsEditMode(true);

        // Get impact story data from response
        const storyData = response.data.data;
        console.log("Story Data:", storyData);

        // Reset the form with the fetched data
        reset({
          title: storyData.title || "",
          tags: Array.isArray(storyData.tags) ? storyData.tags : [],
          impact_story_media: storyData.multi_media || null,
        });
      }
    } catch (err) {
      console.error("Error fetching impact story:", err);
      toast.warning(err?.response?.data?.message || "Failed to load impact story");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (storyId) {
      getImpactStoryById();
    } else {
      // Make sure we're in add mode when no storyId is present
      setIsEditMode(false);

      // Reset form to default values when switching to add mode
      reset({
        title: "",
        tags: [],
        impact_story_media: null,
      });
    }
  }, [storyId, reset]);

  const handleFormKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      e.target.tagName !== "TEXTAREA" &&
      e.target.type !== "submit"
    ) {
      e.preventDefault();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Loading story data...</div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data, storyId, isEditMode))}
      onKeyDown={handleFormKeyDown}
      className="space-y-6 max-w-5xl mx-auto px-6 py-4 bg-white"
    >
      <h1 className="text-[32px] font-semibold text-center">
        {isEditMode ? "Update Story" : "Add Story"}
      </h1>

      {/* Title */}
      <div>
        <label className="block mb-1 font-medium">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          {...register("title", { required: "Title is required" })}
          placeholder="Enter story title"
          className={`w-full p-2 border rounded ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      {/* Tags - Using Controller with custom TagInput component */}
      <div>
        <label className="block mb-1 font-medium">Tags</label>
        <Controller
          name="tags"
          control={control}
          render={({ field: { value, onChange } }) => (
            <TagInput
              value={value}
              onChange={onChange}
              placeholder="Type and press Enter to add tags"
            />
          )}
        />
        <p className="text-sm text-gray-500 mt-1">Press Enter after each tag</p>
      </div>

      {/* Upload Media */}
      <div>
        <label className="block mb-1 font-medium">
          {isEditMode ? "Replace Media" : "Upload Media"}{" "}
          {!isEditMode && <span className="text-red-500">*</span>}
        </label>
        <input
          type="file"
          accept="image/*,video/*"
          {...register("impact_story_media", {
            required: isEditMode ? false : "Media is required",
          })}
          className="w-full"
        />
        <p className="text-sm text-gray-500">
          {isEditMode
            ? "(Leave empty to keep current media)"
            : "(Only image or video files are allowed)"}
        </p>
        {errors.impact_story_media && (
          <p className="text-red-500 text-sm">{errors.impact_story_media.message}</p>
        )}

        {isEditMode && typeof currentMedia === "string" && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-2">Current media:</p>
            {currentMedia.match(/\.(jpeg|jpg|png|gif)$/i) ? (
              <img src={currentMedia} alt="media-preview" height={100} width={100} />
            ) : (
              <video src={currentMedia} controls height={100} width={100} />
            )}
          </div>
        )}
      </div>

      <div className="text-center mt-6">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {isEditMode ? "Update Story" : "Submit Story"}
        </button>
      </div>
    </form>
  );
}

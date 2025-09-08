import React, { Fragment } from "react";
import BlogForm from "./form";
import axiosHttp from "../../../../utils/httpConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "react-router-dom";

const AddBlogComponent = () => {
  const [searchParams] = useSearchParams();
  const blogId = searchParams.get("blogId");

  const handleBlogSubmit = async (data) => {
    // If image is uploaded:
    let imageFile;
    if (typeof data?.image === "string") {
      imageFile = data?.image;
    } else {
      if (data.image && data.image.length > 0) {
        imageFile = data.image[0];
      }
    }

    try {
      let URL;
      if (blogId) {
        URL = "/blog/update-blog";
      } else {
        URL = "/blog/add-blog";
      }
      console.log(data, "data response");
      const formData = new FormData();
      formData.append("blogId", blogId);
      formData.append("title", data.title);
      formData.append("meta_description", data.metaDescription);
      formData.append("meta_tags", JSON.stringify(data.metaTags));
      formData.append("meta_keywords", JSON.stringify(data.metaKeywords));
      formData.append("summary", data.summary);
      formData.append("content", data.editorContent);
      formData.append("category_id", data.category);
      formData.append("tags", JSON.stringify(data.tags));
      formData.append("post_date", "2025-05-13");
      formData.append("author_id", "1");
      formData.append("author_name", "");
      formData.append("author_ip", "");
      formData.append("status", data.status);
      formData.append("is_featured", data.isFeatured);
      formData.append("slug", data.slug);

      if (imageFile) {
        formData.append("blog_image", imageFile);
        formData.append("image_alt", data.imageAltText);
      }

      let result;
      if (blogId) {
        result = await axiosHttp.put(URL, formData);
      } else {
        result = await axiosHttp.post(URL, formData);
      }
      if (result.status === 201) {
        toast.success(result?.data?.message || "Blog added successfully!");
      }
      if (result.status === 200) {
        toast.success(result?.data?.message || "Blog updated successfully!");
      }
    } catch (err) {
      let error;
      if (err?.response?.data?.message) {
        error = err?.response?.data?.message;
      } else {
        error = err?.response?.statusText;
      }
      toast.warning(error);
    }
  };

  return (
    <Fragment>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
      <BlogForm onSubmit={handleBlogSubmit} blogId={blogId} />
    </Fragment>
  );
};

export default AddBlogComponent;

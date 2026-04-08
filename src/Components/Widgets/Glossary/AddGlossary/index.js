import React, { Fragment } from "react";
import BlogForm from "./form";
import axiosHttp from "../../../../utils/httpConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS
import { useSearchParams } from "react-router-dom";

const AddGlossaryComponent = () => {
  const [searchParams] = useSearchParams();
  const blogId = searchParams.get("GlossaryId");

  const handleBlogSubmit = async (data) => {
    try {
      let URL;
      if (blogId) {
        URL = `/glossary/${blogId}`;
      } else {
        URL = "/glossary/";
      }
      console.log(data, "data response");
      const payload = {
        keyword: data.keyword,
        summary: data.summary,
        content: data.content,
        slug: data.slug,
      };
      console.log(payload, "payload");

      let result;
      if (blogId) {
        result = await axiosHttp.put(URL, payload);
      } else {
        result = await axiosHttp.post(URL, payload);
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

export default AddGlossaryComponent;

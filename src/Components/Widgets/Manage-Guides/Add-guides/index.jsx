import React, { Fragment, useState, useEffect } from "react";
import AddGuideForm from "./add-guide";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "react-router-dom";
import axiosHttp from "../../../../utils/httpConfig";

export const AddGuide = () => {
  const [searchParams] = useSearchParams();
  const guideId = searchParams.get("guideId");
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    if (guideId) {
      axiosHttp.get(`/guide/${guideId}`)
        .then((res) => {
          if (res?.status === 200) {
            setEditData({ data: res.data.data });
          }
        })
        .catch((err) => {
          toast.warning(err?.response?.data?.message || "Failed to load guide");
        });
    } else {
      setEditData(null);
    }
  }, [guideId]);

  const handleGuideSubmit = async (data) => {
    try {
      let formData = new FormData();
      formData.append("title", data.title);
      formData.append("summary", data.summary);
      formData.append("tag", data.tag);
      formData.append("content", data.content);
      if (data.guide_image) {
        formData.append("guide_image", data.guide_image);
      }
      let response;
      if (guideId) {
        response = await axiosHttp.put(`/guide/${guideId}`, formData);
      } else {
        response = await axiosHttp.post("/guide/", formData);
      }
      if (response?.status === 201 || response?.status === 200) {
        toast.success(
          guideId ? "Guide updated successfully!" : "Guide added successfully!"
        );
      }
    } catch (err) {
      toast.warning(err?.response?.data?.message || "Failed to submit guide data");
    }
  };

  return (
    <Fragment>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
      <AddGuideForm onSubmit={handleGuideSubmit} guideId={editData} />
    </Fragment>
  );
};

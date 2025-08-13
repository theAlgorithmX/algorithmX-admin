import React, { Fragment, useState, useEffect } from "react";
import PressReleaseForm from "./add-press-release";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "react-router-dom";
import axiosHttp from "../../../../utils/httpConfig";

export const AddPressRelease = () => {
  const [searchParams] = useSearchParams();
  const pressReleaseId = searchParams.get("pressReleaseId");
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    if (pressReleaseId) {
      axiosHttp.get(`/press-release/${pressReleaseId}`)
        .then((res) => {
          if (res?.status === 200) {
            setEditData({ data: res.data.data });
          }
        })
        .catch((err) => {
          toast.warning(err?.response?.data?.message || "Failed to load press release");
        });
    } else {
      setEditData(null);
    }
  }, [pressReleaseId]);

  const handlePressReleaseSubmit = async (data) => {
    try {
      let formData = new FormData();
      formData.append("title", data.title);
      formData.append("summary", data.summary);
      formData.append("tag", data.tag);
      formData.append("content", data.content);
      if (data.cover_image) {
        formData.append("press_release_cover", data.cover_image);
      }
      let response;
      if (pressReleaseId) {
        response = await axiosHttp.put(`/press-release/${pressReleaseId}`, formData);
      } else {
        response = await axiosHttp.post("/press-release/", formData);
      }
      if (response?.status === 201 || response?.status === 200) {
        toast.success(
          pressReleaseId ? "Press Release updated successfully!" : "Press Release added successfully!"
        );
      }
    } catch (err) {
      toast.warning(err?.response?.data?.message || "Failed to submit press release data");
    }
  };

  return (
    <Fragment>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
      <PressReleaseForm onSubmit={handlePressReleaseSubmit} pressReleaseId={editData} />
    </Fragment>
  );
};

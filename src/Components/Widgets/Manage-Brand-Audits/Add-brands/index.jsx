import React, { Fragment } from "react";
import BrandForm from "./add-brand";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "react-router-dom";
import axiosHttp from "../../../../utils/httpConfig";

export default function AddBrandIndex() {
  const [searchParams] = useSearchParams();
  const brandId = searchParams.get("brandId");

  const handleBrandSubmit = async (data) => {
    try {
      let formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("content", data.content);
      if (data.brandAuditCover) {
        formData.append("brand_audit_image", data.brandAuditCover); 
      }
      let response;
      if (brandId) {
        response = await axiosHttp.put(`/brand-audit/${brandId}`, formData);
      } else {
        response = await axiosHttp.post("/brand-audit/", formData);
      }
      if (response?.status === 201 || response?.status === 200) {
        toast.success(
          brandId ? "Brand updated successfully!" : "Brand added successfully!"
        );
      }
    } catch (err) {
      toast.warning(err?.response?.data?.message || "Failed to submit brand data");
    }
  };

  return (
    <Fragment>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
      <BrandForm onSubmit={handleBrandSubmit} brandId={brandId} />
    </Fragment>
  );
}

import React, { Fragment } from "react";
import BrandForm from "./add-brand";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "react-router-dom";

export default function AddBrandIndex() {
  const [searchParams] = useSearchParams();
  const brandId = searchParams.get("brandId");

  const handleBrandSubmit = async (data) => {
    // Placeholder: You can update this logic to call your add/edit brand API
    // For now, just show a toast and log the data
    try {
      // TODO: Replace with actual API call
      console.log("Submitted brand data:", data);
      toast.success(
        brandId ? "Brand updated successfully!" : "Brand added successfully!"
      );
    } catch (err) {
      toast.warning("Failed to submit brand data");
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

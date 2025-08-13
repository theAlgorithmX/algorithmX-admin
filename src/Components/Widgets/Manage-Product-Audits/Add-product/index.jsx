import React, { Fragment } from "react";
import ProductForm from "./add-product";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "react-router-dom";
import axiosHttp from "../../../../utils/httpConfig";

const AddProduct = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");

  const handleProductSubmit = async (data) => {
    try {
      let formData = new FormData();
      formData.append("title", data.name);
      formData.append("description", data.description);
      formData.append("content", data.content);
      if (data.product_image) {
        formData.append("product_audit_image", data.product_image);
      }
      let response;
      if (productId) {
        response = await axiosHttp.put(`/product-audit/${productId}`, formData);
      } else {
        response = await axiosHttp.post("/product-audit/", formData);
      }
      if (response?.status === 201 || response?.status === 200) {
        toast.success(
          productId ? "Product updated successfully!" : "Product added successfully!"
        );
      }
    } catch (err) {
      toast.warning(err?.response?.data?.message || "Failed to submit product data");
    }
  };

  return (
    <Fragment>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
      <ProductForm onSubmit={handleProductSubmit} productId={productId} />
    </Fragment>
  );
};

export default AddProduct;

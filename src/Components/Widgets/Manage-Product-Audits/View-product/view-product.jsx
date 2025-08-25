import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import axiosHttp from "../../../../utils/httpConfig";
import { toast } from "react-toastify";
import { classes } from "../../../../Data/Layouts";
const defaultLayoutObj = classes.find(
  (item) => Object.values(item).pop(1) === "compact-wrapper"
);
const layout =
  localStorage.getItem("layout") || Object.keys(defaultLayoutObj).pop();

const ProductViewSection = () => {
  const [productsData, setProductsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null); // NEW
  const productsPerPage = 10;

  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productsData.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Change page
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () =>
    setCurrentPage(Math.ceil(productsData.length / productsPerPage));
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.ceil(productsData.length / productsPerPage))
    );

  // Truncate text to specific length
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const navigate = useNavigate();
  const handleEdit = (id) => {
    navigate(
      `${process.env.PUBLIC_URL}/widgets/add-product/${layout}?productId=${id}`
    );
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosHttp.delete(`/product-audit/${id}`);
      if (response?.status === 200) {
        toast.success(response?.data?.message);
        getProducts();
      }
    } catch (err) {
      toast.warning(err?.response?.data?.message);
    }
  };

  // View product details
  const handleView = (product) => {
    setSelectedProduct(product);
  };

  // Close modal
  const closeModal = () => {
    setSelectedProduct(null);
  };

  const getProducts = async () => {
    try {
      const response = await axiosHttp.get("/product-audit/get-product-audits");
      if (response?.status === 200) {
        setProductsData(response?.data?.data);
      }
    } catch (err) {
      toast.warning(err?.response?.data?.message);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="w-full  rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/20 shadow-lg shadow-black/10 backdrop-blur-sm border-b border-white/30">
            <tr>
              <th className="py-4 px-6 text-white">ID</th>
              <th className="py-4 px-6 text-white">Name</th>
              <th className="py-4 px-6 text-white">Description</th>
              <th className="py-4 px-6 text-white">Product Image</th>
              <th className="py-4 px-6 text-white text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentProducts?.length ? (
              currentProducts?.map((product) => (
                <tr
                  key={product.id}
                  className="bg-white/5 backdrop-blur-sm divide-y divide-white/20 "
                >
                  <td className="py-4 px-6 text-white">{product?.id}</td>
                  <td className="py-4 px-6 font-medium">
                    <div className="flex items-center gap-3 text-white">
                      <span>{truncateText(product?.title, 30)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-white">
                    {truncateText(product?.description, 50)}
                  </td>
                  <td className="py-4 px-6 text-white">
                    {product?.productAuditCover && (
                      <img
                        src={product.productAuditCover}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="py-4 px-6 text-right text-white">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleView(product)}
                        className="p-2 text-green-600 hover:text-green-800"
                        aria-label="View product details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(product.id)}
                        className="p-2 text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setProductToDelete(product.id)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-white">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white/10 shadow-lg shadow-black/10 backdrop-blur-sm px-4 py-3 sm:px-6">
        <div className="flex flex-1 items-center justify-between">
          <div>
            <p className="text-sm text-white">
              <span className="font-medium">
                {indexOfFirstProduct + 1}-
                {Math.min(indexOfLastProduct, productsData.length)}
              </span>{" "}
              of <span className="font-medium">{productsData.length}</span>
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={goToFirstPage}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">First</span>
                <ChevronsLeft className="h-5 w-5" />
              </button>
              <button
                onClick={goToPreviousPage}
                className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                {currentPage}
              </span>
              <button
                onClick={goToNextPage}
                className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" />
              </button>
              <button
                onClick={goToLastPage}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Last</span>
                <ChevronsRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-auto">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Product Details
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              {/* Product Details */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                <div>
                  <h3 className="text-lg font-semibold">Description</h3>
                  <p className="text-white">{selectedProduct?.description}</p>
                </div>
                {selectedProduct?.product_image && (
                  <div>
                    <h3 className="text-lg font-semibold">Product Image</h3>
                    <img
                      src={selectedProduct.product_image}
                      alt={selectedProduct.name}
                      className="w-48 h-48 object-cover rounded border"
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold">Content</h3>
                  <div
                    className="text-white prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: selectedProduct?.content,
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full overflow-auto">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Delete
              </h3>
              <button
                onClick={() => setProductToDelete(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <p className="text-white mb-4">
                Are you sure you want to delete this product?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setProductToDelete(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  No
                </button>
                <button
                  onClick={async () => {
                    await handleDelete(productToDelete);
                    setProductToDelete(null);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductViewSection;

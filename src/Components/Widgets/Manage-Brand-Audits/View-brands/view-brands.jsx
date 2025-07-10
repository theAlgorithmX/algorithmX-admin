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

const BrandViewSection = () => {
  const [brandsData, setBrandsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const brandsPerPage = 10;

  // Get current brands
  const indexOfLastBrand = currentPage * brandsPerPage;
  const indexOfFirstBrand = indexOfLastBrand - brandsPerPage;
  const currentBrands = brandsData.slice(indexOfFirstBrand, indexOfLastBrand);

  // Change page
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () =>
    setCurrentPage(Math.ceil(brandsData.length / brandsPerPage));
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.ceil(brandsData.length / brandsPerPage))
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
      `${process.env.PUBLIC_URL}/widgets/managebrands/${layout}?BrandId=${id}`
    );
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosHttp.delete(`/brands/${id}`);
      if (response?.status === 200) {
        toast.success(response?.data?.message);
        getBrands();
      }
    } catch (err) {
      toast.warning(err?.response?.data?.message);
    }
  };

  // View brand details
  const handleView = (brand) => {
    setSelectedBrand(brand);
  };

  // Close modal
  const closeModal = () => {
    setSelectedBrand(null);
  };

  const getBrands = async () => {
    try {
      const response = await axiosHttp.get("/brands");
      if (response?.status === 200) {
        setBrandsData(response?.data?.data);
      }
    } catch (err) {
      toast.warning(err?.response?.data?.message);
    }
  };

  useEffect(() => {
    getBrands();
  }, []);

  return (
    <div className="w-full bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-700 bg-gray-50 border-b">
            <tr>
              <th className="py-4 px-6">ID</th>
              <th className="py-4 px-6">Title</th>
              <th className="py-4 px-6">Description</th>
              <th className="py-4 px-6">Image</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentBrands?.length ? (
              currentBrands?.map((brand, index) => (
                <tr key={brand.id} className="bg-white hover:bg-gray-50">
                  <td className="py-4 px-6">{brand?.id}</td>
                  <td className="py-4 px-6 font-medium">
                    <div className="flex items-center gap-3">
                      <span>{truncateText(brand?.title, 30)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {truncateText(brand?.description, 50)}
                  </td>
                  <td className="py-4 px-6">
                    {brand?.image && (
                      <img
                        src={brand.image}
                        alt={brand.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleView(brand)}
                        className="p-2 text-green-600 hover:text-green-800"
                        aria-label="View brand details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(brand.id)}
                        className="p-2 text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(brand.id)}
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
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No brands found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 items-center justify-between">
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">
                {indexOfFirstBrand + 1}-
                {Math.min(indexOfLastBrand, brandsData.length)}
              </span>{" "}
              of <span className="font-medium">{brandsData.length}</span>
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

              {/* Page Numbers - implement if needed, simplified for now */}
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
      {/* Brand Detail Modal */}
      {selectedBrand && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-auto">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Brand Details
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              {/* Brand Details */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">{selectedBrand.title}</h2>

                <div>
                  <h3 className="text-lg font-semibold">Description</h3>
                  <p className="text-gray-700">{selectedBrand?.description}</p>
                </div>

                {selectedBrand?.image && (
                  <div>
                    <h3 className="text-lg font-semibold">Brand Image</h3>
                    <img
                      src={selectedBrand.image}
                      alt={selectedBrand.title}
                      className="w-48 h-48 object-cover rounded border"
                    />
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold">Content</h3>
                  <div
                    className="text-gray-700 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedBrand?.content }}
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
    </div>
  );
};

export default BrandViewSection;

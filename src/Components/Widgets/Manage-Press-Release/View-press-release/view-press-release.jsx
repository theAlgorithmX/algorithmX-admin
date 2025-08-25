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

const PressReleaseViewSection = () => {
  const [pressData, setPressData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPress, setSelectedPress] = useState(null);
  const [pressToDelete, setPressToDelete] = useState(null); // NEW
  const pressPerPage = 10;

  // Get current press releases
  const indexOfLast = currentPage * pressPerPage;
  const indexOfFirst = indexOfLast - pressPerPage;
  const currentPress = pressData.slice(indexOfFirst, indexOfLast);

  // Change page
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () =>
    setCurrentPage(Math.ceil(pressData.length / pressPerPage));
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.ceil(pressData.length / pressPerPage))
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
      `${process.env.PUBLIC_URL}/widgets/add-press-release/default?pressReleaseId=${id}`
    );
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosHttp.delete(`/press-release/${id}`);
      if (response?.status === 200) {
        toast.success(response?.data?.message || "Deleted successfully");
        getPressReleases();
      }
    } catch (err) {
      toast.warning(err?.response?.data?.message);
    }
  };

  // View press release details
  const handleView = (press) => {
    setSelectedPress(press);
  };

  // Close modal
  const closeModal = () => {
    setSelectedPress(null);
  };

  const getPressReleases = async () => {
    try {
      const response = await axiosHttp.get("/press-release/get-press-releases");
      if (response?.status === 200) {
        setPressData(response?.data?.data);
      }
    } catch (err) {
      toast.warning(err?.response?.data?.message);
    }
  };

  useEffect(() => {
    getPressReleases();
  }, []);

  return (
    <div className="w-full  rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/20 shadow-lg shadow-black/10 backdrop-blur-sm border-b border-white/30 text-white">
            <tr>
              <th className="py-4 px-6">ID</th>
              <th className="py-4 px-6">Title</th>
              <th className="py-4 px-6">Summary</th>
              <th className="py-4 px-6">Tag</th>
              <th className="py-4 px-6">Cover Image</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentPress?.length ? (
              currentPress?.map((press) => (
                <tr
                  key={press.id}
                  className="bg-white/5 backdrop-blur-sm divide-y divide-white/20"
                >
                  <td className="py-4 px-6 text-white">{press?.id}</td>
                  <td className="py-4 px-6 font-medium text-white">
                    <span>{truncateText(press?.title, 30)}</span>
                  </td>
                  <td className="py-4 px-6 text-white">
                    {truncateText(press?.summary, 50)}
                  </td>
                  <td className="py-4 px-6 text-white">{press?.tag}</td>
                  <td className="py-4 px-6">
                    {press?.cover_image && (
                      <img
                        src={press.cover_image}
                        alt={press.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleView(press)}
                        className="p-2 text-green-600 hover:text-green-800"
                        aria-label="View press release details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(press.id)}
                        className="p-2 text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setPressToDelete(press.id)}
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
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No press releases found
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
                {indexOfFirst + 1}-{Math.min(indexOfLast, pressData.length)}
              </span>{" "}
              of <span className="font-medium">{pressData.length}</span>
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
      {/* Press Release Detail Modal */}
      {selectedPress && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-auto">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Press Release Details
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              {/* Press Release Details */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">{selectedPress.title}</h2>
                <div>
                  <h3 className="text-lg font-semibold">Summary</h3>
                  <p className="text-white">{selectedPress?.summary}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Tag</h3>
                  <p className="text-white">{selectedPress?.tag}</p>
                </div>
                {selectedPress?.cover_image && (
                  <div>
                    <h3 className="text-lg font-semibold">Cover Image</h3>
                    <img
                      src={selectedPress.cover_image}
                      alt={selectedPress.title}
                      className="w-48 h-48 object-cover rounded border"
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold">Content</h3>
                  <div
                    className="text-white prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedPress?.content }}
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
      {pressToDelete && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full overflow-auto">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Delete
              </h3>
              <button
                onClick={() => setPressToDelete(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <p className="text-white mb-4">
                Are you sure you want to delete this press release?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setPressToDelete(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  No
                </button>
                <button
                  onClick={async () => {
                    await handleDelete(pressToDelete);
                    setPressToDelete(null);
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

export default PressReleaseViewSection;

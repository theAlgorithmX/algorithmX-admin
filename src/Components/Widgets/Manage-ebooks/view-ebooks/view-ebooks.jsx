// ViewEbooks.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosHttp from "../../../../utils/httpConfig";
import { useNavigate } from "react-router-dom";

export default function ViewEbooks({ onEdit }) {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ebookToDelete, setEbookToDelete] = useState(null); // NEW
  // Removed pagination and search state
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  // const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Updated fetchEbooks to use new endpoint and remove pagination/search
  const fetchEbooks = async () => {
    try {
      setLoading(true);
      const response = await axiosHttp.get("/ebook/get-ebooks");
      if (response?.status === 200) {
        const data = response.data.data;
        setEbooks(data.ebooks || data || []);
      }
    } catch (err) {
      console.error("Error fetching ebooks:", err);
      toast.error(err?.response?.data?.message || "Failed to load ebooks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEbooks();
  }, []);

  // Removed handleSearch, handlePageChange, and searchTerm usage

  const handleDelete = async (ebookId) => {
    try {
      const response = await axiosHttp.delete(`/ebook/${ebookId}`);
      if (response?.status === 200) {
        toast.success("Ebook deleted successfully");
        fetchEbooks();
      }
    } catch (err) {
      console.error("Error deleting ebook:", err);
      toast.error(err?.response?.data?.message || "Failed to delete ebook");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-[32px] font-semibold text-white">View Ebooks</h1>
        </div>
        {/* Table */}
        <div className="overflow-x-auto  rounded-lg shadow">
          <table className="w-full table-auto">
            <thead className="text-white bg-white/20 shadow-lg shadow-black/10 backdrop-blur-sm border-b border-white/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Sr. No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Cover Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  File
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/5 backdrop-blur-sm divide-y divide-white/20">
              {ebooks.length > 0 ? (
                ebooks.map((ebook, index) => (
                  <tr key={ebook.id || ebook._id} className="">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {ebook.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ebook.ebookCover ? (
                        <img
                          src={ebook.ebookCover}
                          alt={ebook.title}
                          className="h-16 w-16 object-cover rounded"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-white text-xs">No Image</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      <div className="max-w-xs truncate" title={ebook.title}>
                        {ebook.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      <div
                        className="max-w-sm truncate"
                        title={ebook.description}
                      >
                        {ebook.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* Download anchor added */}
                      {ebook.file ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-white text-sm"></span>
                          <a
                            href={ebook.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={ebook.title || "ebook-file"}
                            className="text-green-600 hover:text-green-800 underline text-sm"
                          >
                            Download
                          </a>
                        </div>
                      ) : (
                        <span className="text-white text-sm">No file</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            navigate(
                              `/widgets/add-ebooks/default?id=${
                                ebook.id || ebook._id
                              }`
                            )
                          }
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            setEbookToDelete(ebook.id || ebook._id)
                          }
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-white">
                    No ebooks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      {ebookToDelete && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full overflow-auto">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">
                Confirm Delete
              </h3>
              <button
                onClick={() => setEbookToDelete(null)}
                className="text-gray-400 hover:text-white"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this ebook?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEbookToDelete(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  No
                </button>
                <button
                  onClick={async () => {
                    await handleDelete(ebookToDelete);
                    setEbookToDelete(null);
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
    </>
  );
}

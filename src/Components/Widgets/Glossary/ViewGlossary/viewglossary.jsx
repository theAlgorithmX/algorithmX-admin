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

const GlossaryViewSection = () => {
  const [blogsData, setBlogsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const blogsPerPage = 10;

  // Get current blogs
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogsData.slice(indexOfFirstBlog, indexOfLastBlog);

  // Change page
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () =>
    setCurrentPage(Math.ceil(blogsData.length / blogsPerPage));
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.ceil(blogsData.length / blogsPerPage))
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
      `${process.env.PUBLIC_URL}/widgets/manageglossary/${layout}?GlossaryId=${id}`
    );
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosHttp.delete(`/glossary/${id}`);
      if (response?.status === 200) {
        toast.success(response?.data?.message);
        getBlogs();
      }
    } catch (err) {
      toast.warning(err?.response?.data?.message);
    }
  };

  // View blog details
  const handleView = (blog) => {
    setSelectedBlog(blog);
  };

  // Close modal
  const closeModal = () => {
    setSelectedBlog(null);
  };

  const getBlogs = async () => {
    try {
      const response = await axiosHttp.get("/glossary/glossaries");
      if (response?.status === 200) {
        setBlogsData(response?.data?.data);
      }
    } catch (err) {
      toast.warning(err?.response?.data?.message);
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

  return (
    <div className="w-full rounded-lg shadow">
      <div className="overflow-x-auto">
        {/* Header */}
        <div className=" px-6 py-4 border-b border-white/20 text-center">
          <h2 className="text-2xl font-bold text-white">View Glossary</h2>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="text-white bg-white/20 shadow-lg shadow-black/10 backdrop-blur-sm border-b">
            <tr>
              <th className="py-4 px-6">ID</th>
              <th className="py-4 px-6">Keyword</th>
              <th className="py-4 px-6">Summary</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentBlogs?.length ? (
              currentBlogs?.map((blog, index) => (
                <tr
                  key={blog.id}
                  className="bg-gradient-to-br from-white/10 to-white/5 
                backdrop-blur-xl 
                border border-white/20 
                shadow-xl shadow-black/40 "
                >
                  <td className="py-4 px-6 text-white">{blog?.id}</td>
                  <td className="py-4 px-6 text-white">
                    <div className="flex items-center gap-3 text-white">
                      <span>{truncateText(blog?.keyword, 30)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-white">
                    {truncateText(blog?.summary, 50)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleView(blog)}
                        className="p-2 text-green-600 hover:text-green-800"
                        aria-label="View blog details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(blog.id)}
                        className="p-2 text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
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
                <td colSpan={4} className="text-center py-6 text-white">
                  No blogs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-transparent px-4 py-3 sm:px-6">
        <div className="flex flex-1 items-center justify-between">
          {/* <div>
            <p className="text-sm text-gray-700">
              Rows per page: <span className="text-blue-500"> 10</span>
            </p>
          </div> */}
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">
                {indexOfFirstBlog + 1}-
                {Math.min(indexOfLastBlog, blogsData.length)}
              </span>{" "}
              of <span className="font-medium">{blogsData.length}</span>
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
      {/* Blog Detail Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-transparent rounded-lg max-w-4xl w-full max-h-screen overflow-auto">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Glossary Details
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              {/* Blog Details */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">{selectedBlog.keyword}</h2>

                <div>
                  <h3 className="text-lg font-semibold">Summary</h3>
                  <p className="text-gray-700">{selectedBlog?.summary}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Content</h3>
                  <div
                    className="text-gray-700 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedBlog?.content }}
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

export default GlossaryViewSection;

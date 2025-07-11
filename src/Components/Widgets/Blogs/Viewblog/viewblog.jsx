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

const BlogViewSection = () => {
  const [blogsData, setBlogsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogToDelete, setBlogToDelete] = useState(null); // NEW STATE
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

  // Format arrays as comma-separated string, ensuring items is an array
  const formatArrayItems = (items) => {
    if (!items) return "";
    // Check if items is an array, if not (but has a value) return as string
    if (!Array.isArray(items)) {
      return String(items); // Convert to string if not already
    }
    return items.join(", ");
  };

  const navigate = useNavigate();
  const handleEdit = (id) => {
    navigate(
      `${process.env.PUBLIC_URL}/widgets/addblog/${layout}?blogId=${id}`
    );
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosHttp.patch(`/blog/delete-blog/${id}`);
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
      const response = await axiosHttp.get("/blog/get-blogs");
      if (response?.status === 200) {
        // Process the data to ensure arrays are handled correctly
        const processedData = response?.data?.data.map((blog) => ({
          ...blog,
          // Ensure tags is always an array
          tags: Array.isArray(blog.tags)
            ? blog.tags
            : blog.tags
            ? [blog.tags]
            : [],
          // Ensure meta_tags is always an array
          meta_tags: Array.isArray(blog.meta_tags)
            ? blog.meta_tags
            : blog.meta_tags
            ? [blog.meta_tags]
            : [],
          // Ensure meta_keywords is always an array
          meta_keywords: Array.isArray(blog.meta_keywords)
            ? blog.meta_keywords
            : blog.meta_keywords
            ? [blog.meta_keywords]
            : [],
          // Ensure category is a string
          category: Array.isArray(blog.category)
            ? blog.category.join(", ")
            : blog.category || "",
        }));

        setBlogsData(processedData);
      }
    } catch (err) {
      toast.warning(err?.response?.data?.message);
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

  return (
    <div className="w-full bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-700 bg-gray-50 border-b">
            <tr>
              <th className="py-4 px-6">Blog ID.</th>
              <th className="py-4 px-6">Title</th>
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Tags</th>
              <th className="py-4 px-6">Description</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Featured</th>
              <th className="py-4 px-6 text-center">Views</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentBlogs?.length ? (
              currentBlogs?.map((blog, index) => (
                <tr key={blog.id} className="bg-white hover:bg-gray-50">
                  <td className="py-4 px-6">{blog?.id}</td>
                  <td className="py-4 px-6 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden ">
                        <img
                          src={blog?.image_url}
                          alt={blog?.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span>{truncateText(blog?.title, 30)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">{blog?.post_date}</td>
                  <td className="py-4 px-6">
                    {truncateText(blog?.category?.title, 20)}
                  </td>
                  <td className="py-4 px-6">
                    {truncateText(formatArrayItems(blog.tags), 25)}
                  </td>
                  <td className="py-4 px-6">
                    {truncateText(blog.meta_description, 40)}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        blog.status === "published"
                          ? "bg-green-100 text-green-800"
                          : blog.status === "draft"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {blog?.status || "N/A"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        blog?.is_featured
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {blog?.is_featured ? "Yes" : "No"}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-center">
                    <span>{blog.views}</span>
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
                        onClick={() => setBlogToDelete(blog.id)} // CHANGE: open confirm modal
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
                <td colSpan={10} className="text-center py-6 text-gray-500">
                  No blogs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
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
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-auto">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Blog Details
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              {/* Blog Image */}
              <div className="mb-6">
                <img
                  src={selectedBlog.image_url}
                  alt={selectedBlog.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>

              {/* Blog Details */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">{selectedBlog.title}</h2>

                <div className="flex items-center justify-between">
                  <p className="text-gray-600">
                    Published on: {selectedBlog.post_date}
                  </p>
                  <p className="text-green-600 font-medium">
                    Views: {selectedBlog?.views || 0}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Meta Description</h3>
                  <p className="text-gray-700">
                    {selectedBlog?.meta_description}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Content</h3>
                  <div
                    className="text-gray-700 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Summary</h3>
                  <p className="text-gray-700">{selectedBlog?.summary}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">Category</h3>
                    <div className="mt-1">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {selectedBlog?.category?.title}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">Tags</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedBlog?.tags &&
                        selectedBlog?.tags?.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Meta Tags</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedBlog?.meta_tags &&
                      selectedBlog?.meta_tags?.map((metaTag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                        >
                          {metaTag}
                        </span>
                      ))}
                  </div>
                </div>

                {selectedBlog?.meta_keywords &&
                  selectedBlog?.meta_keywords?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold">Meta Keywords</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedBlog?.meta_keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
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
      {blogToDelete && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full overflow-auto">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Delete
              </h3>
              <button
                onClick={() => setBlogToDelete(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this blog?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setBlogToDelete(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  No
                </button>
                <button
                  onClick={async () => {
                    await handleDelete(blogToDelete);
                    setBlogToDelete(null);
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

export default BlogViewSection;

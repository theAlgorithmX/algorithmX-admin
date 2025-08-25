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

const ImpactStoryViewSection = () => {
  const [storiesData, setStoriesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStory, setSelectedStory] = useState(null);
  const [storyToDelete, setStoryToDelete] = useState(null);
  const storiesPerPage = 10;

  // Get current stories
  const indexOfLastStory = currentPage * storiesPerPage;
  const indexOfFirstStory = indexOfLastStory - storiesPerPage;
  const currentStories = storiesData.slice(indexOfFirstStory, indexOfLastStory);

  // Change page
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () =>
    setCurrentPage(Math.ceil(storiesData.length / storiesPerPage));
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.ceil(storiesData.length / storiesPerPage))
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
      `${process.env.PUBLIC_URL}/widgets/add-story/${layout}?storyId=${id}`
    );
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosHttp.delete(`/impact-story/${id}`);
      if (response?.status === 200) {
        toast.success(
          response?.data?.message || "Impact story deleted successfully"
        );
        getImpactStories();
      }
    } catch (err) {
      toast.warning(
        err?.response?.data?.message || "Failed to delete impact story"
      );
    }
  };

  // View story details
  const handleView = (story) => {
    setSelectedStory(story);
  };

  // Close modal
  const closeModal = () => {
    setSelectedStory(null);
  };

  const getImpactStories = async () => {
    try {
      const response = await axiosHttp.get("/impact-story/get-impact-stories");
      if (response?.status === 200) {
        // Process the data to ensure arrays are handled correctly
        const processedData = response?.data?.data.map((story) => ({
          ...story,
          // Ensure tags is always an array
          tags: Array.isArray(story.tags)
            ? story.tags
            : story.tags
            ? [story.tags]
            : [],
        }));

        setStoriesData(processedData);
      }
    } catch (err) {
      toast.warning(
        err?.response?.data?.message || "Failed to load impact stories"
      );
    }
  };

  useEffect(() => {
    getImpactStories();
  }, []);

  return (
    <div className="w-full  rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-white bg-white/20 shadow-lg shadow-black/10 backdrop-blur-sm border-b border-white/30 border-b">
            <tr>
              <th className="py-4 px-6">Story ID</th>
              <th className="py-4 px-6">Title</th>
              <th className="py-4 px-6">Tags</th>
              <th className="py-4 px-6">Media</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentStories?.length ? (
              currentStories?.map((story, index) => (
                <tr
                  key={story.id}
                  className="bg-white/5 backdrop-blur-sm divide-y divide-white/20"
                >
                  <td className="py-4 px-6 text-white">{story?.id}</td>
                  <td className="py-4 px-6 font-medium text-white">
                    <span>{truncateText(story?.title, 30)}</span>
                  </td>
                  <td className="py-4 px-6 text-white">
                    {truncateText(formatArrayItems(story.tags), 25)}
                  </td>
                  <td className="py-4 px-6">
                    {story?.multi_media ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        {story?.multi_media.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                          <img
                            src={story?.multi_media}
                            alt={story?.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video
                            src={story?.multi_media}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">No media</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleView(story)}
                        className="p-2 text-green-600 hover:text-green-800"
                        aria-label="View story details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(story.id)}
                        className="p-2 text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setStoryToDelete(story.id)}
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
                  No impact stories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white/10 shadow-lg shadow-black/10 backdrop-blur-sm px-4 py-3 sm:px-6">
        <div className="flex flex-1 items-center justify-between">
          {/* <div>
            <p className="text-sm text-white">
              Rows per page: <span className="text-blue-500"> 10</span>
            </p>
          </div> */}
          <div>
            <p className="text-sm text-white">
              <span className="font-medium">
                {indexOfFirstStory + 1}-
                {Math.min(indexOfLastStory, storiesData.length)}
              </span>{" "}
              of <span className="font-medium">{storiesData.length}</span>
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

      {/* Impact Story Detail Modal */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-auto">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Impact Story Details
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              {/* Story Media */}
              {selectedStory.multi_media && (
                <div className="mb-6">
                  {selectedStory.multi_media.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                    <img
                      src={selectedStory.multi_media}
                      alt={selectedStory.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  ) : (
                    <video
                      src={selectedStory.multi_media}
                      controls
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  )}
                </div>
              )}

              {/* Story Details */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">{selectedStory.title}</h2>

                <div>
                  <h3 className="text-lg font-semibold">Tags</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedStory?.tags &&
                      selectedStory?.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
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
      {storyToDelete && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full overflow-auto">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Delete
              </h3>
              <button
                onClick={() => setStoryToDelete(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <p className="text-white mb-4">
                Are you sure you want to delete this impact story?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setStoryToDelete(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  No
                </button>
                <button
                  onClick={async () => {
                    await handleDelete(storyToDelete);
                    setStoryToDelete(null);
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

export default ImpactStoryViewSection;

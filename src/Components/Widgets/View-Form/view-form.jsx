import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
} from "lucide-react";

import { toast } from "react-toastify";
import axiosHttp from "../../../utils/httpConfig";

const FormViewSection = () => {
  const [queriesData, setQueriesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [loading, setLoading] = useState(false);
  const queriesPerPage = 10;

  // Get current queries
  const indexOfLastQuery = currentPage * queriesPerPage;
  const indexOfFirstQuery = indexOfLastQuery - queriesPerPage;
  const currentQueries = queriesData.slice(indexOfFirstQuery, indexOfLastQuery);

  // Change page
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () =>
    setCurrentPage(Math.ceil(queriesData.length / queriesPerPage));
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.ceil(queriesData.length / queriesPerPage))
    );

  // Truncate text to specific length
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // View query details
  const handleView = async (queryId) => {
    setLoading(true);
    try {
      const response = await axiosHttp.get(`/view-query/${queryId}`);
      if (response?.status === 200) {
        setSelectedQuery(response?.data?.data);
      }
    } catch (err) {
      toast.warning(
        err?.response?.data?.message || "Failed to fetch query details"
      );
    } finally {
      setLoading(false);
    }
  };

  // Close modal
  const closeModal = () => {
    setSelectedQuery(null);
  };

  const getQueries = async () => {
    try {
      const response = await axiosHttp.get("/queries");
      if (response?.status === 200) {
        setQueriesData(response?.data?.data);
      }
    } catch (err) {
      toast.warning(err?.response?.data?.message || "Failed to fetch queries");
    }
  };

  useEffect(() => {
    getQueries();
  }, []);

  return (
    <div className="w-full ">
      <div className="overflow-x-auto">
        {/* Header */}
        <div className=" px-6 py-4 border-b border-white/20 text-center">
          <h2 className="text-2xl font-bold text-white">Query Form</h2>
        </div>
        <table className="w-full text-sm text-left text-white">
          <thead className="bg-white/10 backdrop-blur-sm border-b border-white/20 text-gray-200">
            <tr>
              <th className="py-4 px-6">ID</th>
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Email</th>
              <th className="py-4 px-6">Mobile Number</th>
              <th className="py-4 px-6">Service</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {currentQueries?.length ? (
              currentQueries?.map((query) => (
                <tr key={query.id} className="hover:bg-white/5 transition">
                  <td className="py-4 px-6">{query?.id}</td>
                  <td className="py-4 px-6 font-medium">
                    <div className="flex items-center gap-3">
                      <span>{truncateText(query?.clientName, 30)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {truncateText(query?.clientEmail, 50)}
                  </td>
                  <td className="py-4 px-6">{query?.clientPhone}</td>
                  <td className="py-4 px-6">
                    {truncateText(query?.service, 30)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleView(query.id)}
                        className="p-2 text-green-300 hover:text-green-500"
                        disabled={loading}
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-300">
                  No Form Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-white/20 bg-white/10 backdrop-blur-sm px-4 py-3 sm:px-6 rounded-b-lg">
        <div className="flex flex-1 items-center justify-between">
          <div>
            <p className="text-sm text-gray-200">
              <span className="font-medium">
                {indexOfFirstQuery + 1}-
                {Math.min(indexOfLastQuery, queriesData.length)}
              </span>{" "}
              of <span className="font-medium">{queriesData.length}</span>
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={goToFirstPage}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-300 ring-1 ring-inset ring-white/20 hover:bg-white/10 backdrop-blur-sm focus:z-20"
              >
                <span className="sr-only">First</span>
                <ChevronsLeft className="h-5 w-5" />
              </button>
              <button
                onClick={goToPreviousPage}
                className="relative inline-flex items-center px-2 py-2 text-gray-300 ring-1 ring-inset ring-white/20 hover:bg-white/10 backdrop-blur-sm focus:z-20"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-white/20 backdrop-blur-sm">
                {currentPage}
              </span>
              <button
                onClick={goToNextPage}
                className="relative inline-flex items-center px-2 py-2 text-gray-300 ring-1 ring-inset ring-white/20 hover:bg-white/10 backdrop-blur-sm focus:z-20"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" />
              </button>
              <button
                onClick={goToLastPage}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-300 ring-1 ring-inset ring-white/20 hover:bg-white/10 backdrop-blur-sm focus:z-20"
              >
                <span className="sr-only">Last</span>
                <ChevronsRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Query Detail Modal */}
      {selectedQuery && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-auto">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Query Details
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              {/* Query Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedQuery?.clientName && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Client Name
                      </h3>
                      <p className="text-gray-700">
                        {selectedQuery.clientName}
                      </p>
                    </div>
                  )}
                  {selectedQuery?.clientEmail && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Client Email
                      </h3>
                      <p className="text-gray-700">
                        {selectedQuery.clientEmail}
                      </p>
                    </div>
                  )}
                  {selectedQuery?.clientPhone && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Client Phone
                      </h3>
                      <p className="text-gray-700">
                        {selectedQuery.clientPhone}
                      </p>
                    </div>
                  )}
                  {selectedQuery?.service && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Service
                      </h3>
                      <p className="text-gray-700">{selectedQuery.service}</p>
                    </div>
                  )}
                  {selectedQuery?.page && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Page
                      </h3>
                      <p className="text-gray-700">{selectedQuery.page}</p>
                    </div>
                  )}
                </div>

                {selectedQuery?.clientQuestion && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Client Question
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedQuery.clientQuestion}
                    </p>
                  </div>
                )}

                {selectedQuery?.created_at && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Submitted On
                    </h3>
                    <p className="text-gray-700">
                      {new Date(selectedQuery.created_at).toLocaleString()}
                    </p>
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

      {/* Loading Modal */}
      {loading && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="ml-2">Loading query details...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormViewSection;

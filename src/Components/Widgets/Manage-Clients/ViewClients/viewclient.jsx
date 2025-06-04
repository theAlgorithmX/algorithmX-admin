import React, { useState, useEffect } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import axiosHttp from "../../../../utils/httpConfig";

const ClientsTable = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Replace with your actual axiosHttp import
  // import axiosHttp from 'your-axios-config-file';

  // Fetch clients data
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await axiosHttp.get("/clients/");
      setClients(response.data.data || []);

      setError(null);
    } catch (err) {
      setError("Failed to fetch clients data");
      console.error("Error fetching clients:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (client) => {
    setSelectedClient(client);
    setIsViewModalOpen(true);
  };

  const handleEdit = (clientId) => {
    console.log("Edit client:", clientId);
    // Implement edit logic - maybe open edit form or navigate to edit page
    alert(`Editing client with ID: ${clientId}`);
  };

  const handleDelete = async (clientId) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        // Replace with your actual axiosHttp.delete call
        // await axiosHttp.delete(`/clients/${clientId}`);
        // Remove from local state
        setClients(clients.filter((client) => client.id !== clientId));
        alert("Client deleted successfully");
      } catch (err) {
        console.error("Error deleting client:", err);
        alert("Failed to delete client");
      }
    }
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedClient(null);
  };

  const parseJSONString = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      // Ensure we always return an array
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="text-red-800">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
        <button
          onClick={fetchClients}
          className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Clients Management</h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Logo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Industry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Services
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Eye size={24} className="text-gray-400" />
                      </div>
                      <p className="text-lg font-medium">No clients found</p>
                      <p className="text-sm">
                        No client data available at the moment.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr
                    key={client.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{client.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {client.brandLogoURL ? (
                          <img
                            src={client.brandLogoURL}
                            alt={`${client.brandName} logo`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium">
                          {client.brandName?.charAt(0)?.toUpperCase() || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {client.brandName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {client.productType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {client.brandIndustry}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {client.brandServices}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {client.brandType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          client.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {client.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleView(client)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(client.id)}
                          className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50 transition-colors"
                          title="Edit Client"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(client.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
                          title="Delete Client"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {clients.length > 0 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {clients.length} client{clients.length !== 1 ? "s" : ""}
              </div>
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">Client Details</h3>
                <button
                  onClick={closeViewModal}
                  className="text-white hover:text-gray-200 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Basic Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        ID
                      </label>
                      <p className="text-gray-900">#{selectedClient.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Brand Name
                      </label>
                      <p className="text-gray-900">
                        {selectedClient.brandName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Product Type
                      </label>
                      <p className="text-gray-900">
                        {selectedClient.productType}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Industry
                      </label>
                      <p className="text-gray-900">
                        {selectedClient.brandIndustry}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Services
                      </label>
                      <p className="text-gray-900">
                        {selectedClient.brandServices}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Brand Type
                      </label>
                      <p className="text-gray-900">
                        {selectedClient.brandType}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Brand RGB
                      </label>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: selectedClient.brandRGB }}
                        ></div>
                        <p className="text-gray-900">
                          {selectedClient.brandRGB}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Status
                      </label>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedClient.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedClient.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Media
                  </h4>
                  <div className="space-y-4">
                    {selectedClient.brandLogoURL && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Brand Logo
                        </label>
                        <img
                          src={selectedClient.brandLogoURL}
                          alt="Brand Logo"
                          className="mt-1 w-24 h-24 object-cover rounded border"
                        />
                      </div>
                    )}
                    {selectedClient.brandImageURL && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Brand Image
                        </label>
                        <img
                          src={selectedClient.brandImageURL}
                          alt="Brand Image"
                          className="mt-1 w-32 h-24 object-cover rounded border"
                        />
                      </div>
                    )}
                    {selectedClient.brandVideoURL && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Brand Video
                        </label>
                        <div className="mt-1">
                          <video
                            src={selectedClient.brandVideoURL}
                            controls
                            className="w-full max-w-xs h-32 rounded border"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Video Title */}
              {selectedClient.brandVideoTitle && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Video Title
                  </h4>
                  <p className="mt-2 text-gray-900">
                    {selectedClient.brandVideoTitle}
                  </p>
                </div>
              )}

              {/* About Description */}
              {selectedClient.brandAboutDesc && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    About Description
                  </h4>
                  <p className="mt-2 text-gray-700 leading-relaxed">
                    {selectedClient.brandAboutDesc}
                  </p>
                </div>
              )}

              {/* About Images */}
              {selectedClient.aboutImgURLs &&
                selectedClient.aboutImgURLs.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
                      About Images
                    </h4>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedClient.aboutImgURLs.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`About ${index + 1}`}
                          className="w-full h-24 object-cover rounded border"
                        />
                      ))}
                    </div>
                  </div>
                )}

              {/* Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Solution
                  </h4>
                  <div className="mt-2 space-y-3">
                    {selectedClient.solutionTitle && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Title
                        </label>
                        <p className="text-gray-900">
                          {selectedClient.solutionTitle}
                        </p>
                      </div>
                    )}
                    {selectedClient.solutionDesc && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Description
                        </label>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {selectedClient.solutionDesc}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {selectedClient.solutionImgURL && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Solution Image
                    </label>
                    <img
                      src={selectedClient.solutionImgURL}
                      alt="Solution"
                      className="mt-1 w-full h-32 object-cover rounded border"
                    />
                  </div>
                )}
              </div>

              {/* Client Testimonial */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Client Testimonial
                  </h4>
                  <div className="mt-2 space-y-3">
                    {selectedClient.clientName && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Client Name
                        </label>
                        <p className="text-gray-900">
                          {selectedClient.clientName}
                        </p>
                      </div>
                    )}
                    {selectedClient.clientDesignation && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Designation
                        </label>
                        <p className="text-gray-900">
                          {selectedClient.clientDesignation}
                        </p>
                      </div>
                    )}
                    {selectedClient.clientTestimonial && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Testimonial
                        </label>
                        <p className="text-gray-700 text-sm leading-relaxed italic bg-gray-50 p-3 rounded">
                          {selectedClient.clientTestimonial}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {selectedClient.clientImgURL && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Client Image
                    </label>
                    <img
                      src={selectedClient.clientImgURL}
                      alt="Client"
                      className="mt-1 w-32 h-32 object-cover rounded border"
                    />
                  </div>
                )}
              </div>

              {/* Tech Stack */}
              {selectedClient.techStackTitle && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Tech Stack
                  </h4>
                  <p className="mt-2 text-gray-700">
                    {selectedClient.techStackTitle}
                  </p>
                  {selectedClient.techStackURLs &&
                    selectedClient.techStackURLs.length > 0 && (
                      <div className="mt-3 grid grid-cols-3 md:grid-cols-6 gap-4">
                        {selectedClient.techStackURLs.map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            alt={`Tech ${index + 1}`}
                            className="w-full h-16 object-contain rounded border p-2"
                          />
                        ))}
                      </div>
                    )}
                </div>
              )}

              {/* Wireframes */}
              {selectedClient.wireFrameURLs &&
                selectedClient.wireFrameURLs.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
                      Wireframes
                    </h4>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedClient.wireFrameURLs.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Wireframe ${index + 1}`}
                          className="w-full h-32 object-cover rounded border"
                        />
                      ))}
                    </div>
                  </div>
                )}

              {/* Prototypes */}
              {selectedClient.prototypeURLs &&
                selectedClient.prototypeURLs.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
                      Prototypes
                    </h4>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedClient.prototypeURLs.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Prototype ${index + 1}`}
                          className="w-full h-32 object-cover rounded border"
                        />
                      ))}
                    </div>
                  </div>
                )}

              {/* Result Pointers */}
              {selectedClient.resultPointers && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Result Pointers
                  </h4>
                  {selectedClient.resultTitle && (
                    <p className="mt-2 text-gray-700 font-medium">
                      {selectedClient.resultTitle}
                    </p>
                  )}
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {parseJSONString(selectedClient.resultPointers).length >
                    0 ? (
                      parseJSONString(selectedClient.resultPointers).map(
                        (pointer, index) => (
                          <div
                            key={pointer.id || index}
                            className="bg-gray-50 p-4 rounded-lg"
                          >
                            {pointer.img && (
                              <img
                                src={pointer.img}
                                alt={`Result ${index + 1}`}
                                className="w-full h-32 object-cover rounded border mb-3"
                              />
                            )}
                            <h5 className="font-medium text-gray-900">
                              {pointer.title || "No Title"}
                            </h5>
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-gray-500 col-span-2">
                        No result pointers data available
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Optimization */}
              {selectedClient.optimizationPointers && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Optimization
                  </h4>
                  {selectedClient.optimizationTitle && (
                    <p className="mt-2 text-gray-700 font-medium">
                      {selectedClient.optimizationTitle}
                    </p>
                  )}
                  {selectedClient.optimizationDesc && (
                    <p className="mt-1 text-gray-600 text-sm">
                      {selectedClient.optimizationDesc}
                    </p>
                  )}
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {parseJSONString(selectedClient.optimizationPointers)
                      .length > 0 ? (
                      parseJSONString(selectedClient.optimizationPointers).map(
                        (optimization, index) => (
                          <div
                            key={optimization.id || index}
                            className="bg-gray-50 p-4 rounded-lg"
                          >
                            {optimization.img && (
                              <img
                                src={optimization.img}
                                alt={`Optimization ${index + 1}`}
                                className="w-full h-32 object-cover rounded border mb-3"
                              />
                            )}
                            <h5 className="font-medium text-gray-900">
                              {optimization.title || "No Title"}
                            </h5>
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-gray-500 col-span-3">
                        No optimization data available
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Business Process */}
              {selectedClient.businessProcess && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Business Process
                  </h4>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {parseJSONString(selectedClient.businessProcess).length >
                    0 ? (
                      parseJSONString(selectedClient.businessProcess).map(
                        (process, index) => (
                          <div
                            key={process.id || index}
                            className="bg-gray-50 p-4 rounded-lg"
                          >
                            <h5 className="font-medium text-gray-900">
                              {process.title || "No Title"}
                            </h5>
                            <p className="text-sm text-gray-600 mt-1">
                              {process.desc || "No Description"}
                            </p>
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-gray-500 col-span-2">
                        No business process data available
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Project Goals */}
              {selectedClient.projectGoals && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Project Goals
                  </h4>
                  <div className="mt-2 space-y-4">
                    {selectedClient.projectGoalImgURL && (
                      <img
                        src={selectedClient.projectGoalImgURL}
                        alt="Project Goals"
                        className="w-full max-w-md h-48 object-cover rounded border"
                      />
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {parseJSONString(selectedClient.projectGoals).length >
                      0 ? (
                        parseJSONString(selectedClient.projectGoals).map(
                          (goal, index) => (
                            <div
                              key={goal.id || index}
                              className="bg-gray-50 p-4 rounded-lg"
                            >
                              <h5 className="font-medium text-gray-900">
                                {goal.title || "No Title"}
                              </h5>
                              <p className="text-sm text-gray-600 mt-1">
                                {goal.desc || "No Description"}
                              </p>
                            </div>
                          )
                        )
                      ) : (
                        <p className="text-gray-500 col-span-2">
                          No project goals data available
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Metrics */}
              {selectedClient.metrices && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Metrics
                  </h4>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedClient.metrices.avgRatings}
                      </p>
                      <p className="text-sm text-gray-600">Avg Ratings</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {selectedClient.metrices.conversionRate}
                      </p>
                      <p className="text-sm text-gray-600">Conversion Rate</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {selectedClient.metrices.totalOrders}
                      </p>
                      <p className="text-sm text-gray-600">Total Orders</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-orange-600">
                        {selectedClient.metrices.repeatPurchases}
                      </p>
                      <p className="text-sm text-gray-600">Repeat Purchases</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-red-600">
                        {selectedClient.metrices.orderFulfilledPerDay}
                      </p>
                      <p className="text-sm text-gray-600">Orders/Day</p>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-indigo-600">
                        {selectedClient.metrices.sessionRevenueUplift}
                      </p>
                      <p className="text-sm text-gray-600">Revenue Uplift</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <label className="font-medium">Created At</label>
                    <p>{new Date(selectedClient.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="font-medium">Updated At</label>
                    <p>{new Date(selectedClient.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-lg">
              <div className="flex justify-end">
                <button
                  onClick={closeViewModal}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsTable;

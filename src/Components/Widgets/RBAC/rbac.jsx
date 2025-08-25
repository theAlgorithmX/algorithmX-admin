import React, { useState, useEffect } from "react";
import {
  User,
  Edit,
  Trash2,
  X,
  Check,
  Plus,
  Shield,
  AlertCircle,
  Eye,
} from "lucide-react";
import axiosHttp from "../../../utils/httpConfig";

const RBACPage = () => {
  const [newRoleName, setNewRoleName] = useState("");
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [viewingRole, setViewingRole] = useState(null); // NEW: For viewing role permissions
  const [loading, setLoading] = useState(true);

  // Available permissions
  const availablePermissions = [
    "User-management",
    "Onboarduser",
    "View form",
    "Blogs",
    "Glossary",
    "Brand Audits",
    "Product Audits",
    "Ebooks",
    "Clients",
    "Press Release",
    "Guides",
    "Impact Stories",
  ];

  // Initial roles state
  const [roles, setRoles] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Toast notification effect
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
  };

  const getRandomColor = () => {
    const colors = [
      "bg-purple-100 text-purple-800",
      "bg-green-100 text-green-800",
      "bg-yellow-100 text-yellow-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
    ];
    return colors[Math.floor(Math.random() * colors?.length)];
  };

  // Helpers: map permission labels <-> slugs expected by API
  const labelToSlug = (label) =>
    String(label || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

  const slugToLabel = (slug) => {
    const found = availablePermissions.find(
      (label) =>
        labelToSlug(label) ===
        String(slug || "")
          .trim()
          .toLowerCase()
    );
    if (found) return found;
    const humanized = String(slug || "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return humanized;
  };

  // API: Get all roles
  const getRoles = async (retryCount = 0) => {
    setLoading(true);
    try {
      const response = await axiosHttp.get("/roles");
      if (response?.status === 200) {
        setRoles(response?.data?.data ?? response?.data);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);

      // Retry logic for network errors
      if (
        retryCount < 3 &&
        (error.code === "NETWORK_ERROR" ||
          error.message.includes("Network Error"))
      ) {
        setTimeout(() => getRoles(retryCount + 1), 1000 * (retryCount + 1));
        return;
      }

      showToast(
        error.response?.data?.message || "Failed to fetch roles",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // API: Create new role
  const handleCreateRole = async () => {
    if (newRoleName.trim()) {
      const roleNameUpper = newRoleName.toUpperCase();

      // Check if role already exists
      const existingRole = roles.find((role) => role.name === roleNameUpper);
      if (existingRole) {
        showToast(`Role "${roleNameUpper}" already exists!`, "error");
        return;
      }

      // Validate role data
      const roleData = {
        name: roleNameUpper,
        permissions: [],
      };

      const validationErrors = validateRoleData(roleData);
      if (validationErrors?.length > 0) {
        showToast(validationErrors[0], "error");
        return;
      }

      try {
        const response = await axiosHttp.post("/role", roleData);

        if (response?.status === 201 || response?.status === 200) {
          await getRoles(); // Refresh the roles list
          setNewRoleName("");
          showToast(`Role "${roleNameUpper}" created successfully!`, "success");
        }
      } catch (error) {
        handleApiError(error, "creating role");
      }
    }
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    // Map any stored slugs to UI labels for selection display
    const uiPermissions = (role?.permissions ?? []).map(slugToLabel);
    setSelectedPermissions(uiPermissions);
    setShowPermissionsModal(true);
  };

  // API: Get single role by ID (if needed for detailed editing)
  // const getRoleById = async (roleId) => {
  //   try {
  //     const response = await axiosHttp.get(`/role/${roleId}`);
  //     if (response.status === 200) {
  //       return response.data.data || response.data;
  //     }
  //   } catch (error) {
  //     handleApiError(error, "fetching role details");
  //     return null;
  //   }
  // };

  // API: Bulk update roles (if needed for future features)
  // const bulkUpdateRoles = async (roleUpdates) => {
  //   try {
  //     const response = await axiosHttp.put("/roles/bulk-update", {
  //       roles: roleUpdates,
  //     });
  //     if (response.status === 200) {
  //       await getRoles(); // Refresh the roles list
  //       showToast("Roles updated successfully!", "success");
  //       return true;
  //     }
  //   } catch (error) {
  //     handleApiError(error, "bulk updating roles");
  //     return false;
  //   }
  // };

  // API: Search roles (if needed for future features)
  // const searchRoles = async (searchTerm) => {
  //   try {
  //     const response = await axiosHttp.get(
  //       `/roles/search?q=${encodeURIComponent(searchTerm)}`
  //     );
  //     if (response.status === 200) {
  //       return response.data.data || response.data;
  //     }
  //   } catch (error) {
  //     handleApiError(error, "searching roles");
  //     return [];
  //   }
  // };

  // API: Duplicate role (if needed for future features)
  // const duplicateRole = async (roleId) => {
  //   try {
  //     const response = await axiosHttp.post(`/roles/${roleId}/duplicate`);
  //     if (response.status === 201 || response.status === 200) {
  //       await getRoles(); // Refresh the roles list
  //       showToast("Role duplicated successfully!", "success");
  //       return true;
  //     }
  //   } catch (error) {
  //     handleApiError(error, "duplicating role");
  //     return false;
  //   }
  // };

  // API: Get role statistics (if needed for future features)
  // const getRoleStats = async () => {
  //   try {
  //     const response = await axiosHttp.get("/roles/stats");
  //     if (response.status === 200) {
  //       return response.data.data || response.data;
  //     }
  //   } catch (error) {
  //     handleApiError(error, "fetching role statistics");
  //     return null;
  //   }
  // };

  // API: Update role permissions
  const handleUpdateRole = async () => {
    if (editingRole) {
      try {
        // Send only the permissions field as slugs, per API contract
        const payload = {
          permissions: (selectedPermissions ?? []).map(labelToSlug),
        };

        const response = await axiosHttp.put(
          `/role/${editingRole?.id}`,
          payload
        );

        if (response?.status === 200 || response?.status === 201) {
          await getRoles(); // Refresh the roles list
          setShowPermissionsModal(false);
          setEditingRole(null);
          setSelectedPermissions([]);
          showToast("Role permissions updated successfully!", "success");
        }
      } catch (error) {
        handleApiError(error, "updating role");
      }
    }
  };

  // API: Delete role
  const handleDeleteRole = async (roleId, roleName) => {
    // Confirm deletion
    if (
      !window.confirm(
        `Are you sure you want to delete the role "${roleName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await axiosHttp.delete(`/role/${roleId}`);

      if (response?.status === 200 || response?.status === 204) {
        await getRoles(); // Refresh the roles list
        showToast(`Role "${roleName}" deleted successfully!`, "success");
      }
    } catch (error) {
      handleApiError(error, "deleting role");
    }
  };

  const handleViewRole = (role) => {
    setViewingRole(role);
  };

  const handlePermissionToggle = (permission) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const handleSelectAll = () => {
    setSelectedPermissions([...availablePermissions]);
  };

  const handleClearAll = () => {
    setSelectedPermissions([]);
  };

  const handleCancel = () => {
    setShowPermissionsModal(false);
    setEditingRole(null);
    setSelectedPermissions([]);
  };

  // Load roles on component mount
  useEffect(() => {
    getRoles();
  }, []);

  // Utility function to handle API errors consistently
  const handleApiError = (error, operation) => {
    console.error(`Error ${operation}:`, error);

    let errorMessage = "An unexpected error occurred";

    if (error.response) {
      // Server responded with error status
      errorMessage =
        error.response.data?.message ||
        `Server error: ${error.response.status}`;
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = "No response from server. Please check your connection.";
    } else {
      // Something else happened
      errorMessage = error.message || "Network error occurred";
    }

    showToast(errorMessage, "error");
  };

  // Utility function to validate role data before API calls
  const validateRoleData = (roleData) => {
    const errors = [];

    if (!roleData.name || !roleData.name.trim()) {
      errors.push("Role name is required");
    }

    return errors;
  };

  // Determine if a role can be deleted when API doesn't provide explicit flag
  const canDeleteRole = (role) => {
    if (typeof role?.isDeletable === "boolean") return role.isDeletable;
    const roleName = String(role?.name || "")
      .trim()
      .toUpperCase();
    return (
      roleName !== "ADMIN" &&
      roleName !== "SUPERADMIN" &&
      roleName !== "SUPER_ADMIN" &&
      roleName !== "SYSTEM"
    );
  };

  return (
    <div className="min-h-screen bg-black/10 shadow-lg shadow-black/10 backdrop-blur-sm">
      {/* Header */}
      <div className="">
        <div className=" ">
          <h1 className="text-2xl font-semibold text-white text-center pt-[10px]">
            Role Management
          </h1>
          <p className="text-white mt-1 text-center">
            Manage user roles and permissions for your application
          </p>
        </div>

        {/* Toast Notification */}
        {toast.show && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg max-w-sm ${
                toast.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              <div
                className={`p-1 rounded-full ${
                  toast.type === "success" ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {toast.type === "success" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
              </div>
              <p className="font-medium text-sm">{toast.message}</p>
              <button
                onClick={() => setToast({ show: false, message: "", type: "" })}
                className={`text-sm hover:opacity-70 transition-opacity ${
                  toast.type === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Create New Role */}
        <div className="bg-white/10 shadow-lg shadow-black/10 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Create New Role
          </h2>
          <p className="text-white text-sm mb-6">
            Roles allow you to collaborate with team members by granting them
            specific permissions to manage different parts of the application.
          </p>

          <div className="flex gap-4">
            {/* Input Box */}
            <div className="flex-1">
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-300" />
                <input
                  type="text"
                  placeholder="Enter role name (e.g., Manager, Editor)"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 
          rounded-xl border border-white/20
          bg-white/10 backdrop-blur-md
          focus:outline-none focus:ring-2 focus:ring-blue-400
          text-white placeholder-gray-300
          shadow-lg transition"
                  onKeyPress={(e) => e.key === "Enter" && handleCreateRole()}
                />
              </div>
            </div>

            {/* Button */}
            <button
              onClick={handleCreateRole}
              disabled={!newRoleName.trim()}
              className="px-6 py-3 
      rounded-xl font-medium flex items-center gap-2
      bg-white/10 backdrop-blur-md
      border border-white/20 shadow-lg
      text-white hover:bg-black/20
      disabled:bg-gray-400/30 disabled:text-gray-200
      disabled:cursor-not-allowed
      transition"
            >
              <Plus className="w-5 h-5" />
              Create Role
            </button>
          </div>
        </div>

        {/* Roles Management */}
        <div className="bg-white/10 shadow-lg shadow-black/10 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-white">Manage Roles</h2>
            <p className="text-white text-sm mt-1">
              View and edit existing roles. Admin role permissions can be
              modified but the role cannot be deleted.
            </p>
          </div>

          <div className="overflow-hidden">
            {/* Table Header */}
            <div className="bg-white/10 shadow-lg shadow-black/10 backdrop-blur-sm px-6 py-3 border-b border-gray-200">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-xs font-semibold text-white uppercase tracking-wide">
                  Role Name
                </div>
                <div className="text-xs font-semibold text-white uppercase tracking-wide">
                  Permissions
                </div>
                <div className="text-xs font-semibold text-white uppercase tracking-wide">
                  Status
                </div>
                <div className="text-xs font-semibold text-white uppercase tracking-wide">
                  Actions
                </div>
              </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-200">
              {loading ? (
                <div className="px-6 py-12 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                  <p className="mt-2 text-gray-500">Loading roles...</p>
                </div>
              ) : roles?.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  <Shield className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                  <p>No roles found. Create a new one to get started!</p>
                </div>
              ) : (
                roles.map((role) => (
                  <div
                    key={role.id}
                    className="px-6 py-4 hover:bg-black/10  transition-colors"
                  >
                    <div className="grid grid-cols-4 gap-4 items-center">
                      <div className="flex items-center gap-3">
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium ${role.color} text-white`}
                        >
                          {role.name}
                        </div>
                      </div>

                      <div className="text-white font-medium">
                        {role?.permissions?.length} permissions
                      </div>

                      <div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            canDeleteRole(role)
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {canDeleteRole(role) ? "Custom" : "System"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* View Button */}
                        <button
                          onClick={() => handleViewRole(role)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                          title="View permissions"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleEditRole(role)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit permissions"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        {canDeleteRole(role) && (
                          <button
                            onClick={() => handleDeleteRole(role.id, role.name)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete role"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-white">
              Showing {roles?.length} role{roles?.length !== 1 ? "s" : ""}
            </p>
          </div> */}
        </div>
      </div>

      {/* Permissions Modal - Edit */}
      {showPermissionsModal && editingRole && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${editingRole.color
                    ?.replace("text-", "bg-")
                    ?.replace("800", "100")}`}
                >
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Edit {editingRole.name} Permissions
                  </h3>
                  <p className="text-white text-sm">
                    Configure which parts of the application this role can
                    access
                  </p>
                </div>
              </div>
              <button
                onClick={handleCancel}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Selected Count */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">
                    {selectedPermissions?.length} of{" "}
                    {availablePermissions?.length} permissions selected
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleSelectAll}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
                >
                  Select All
                </button>
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors text-sm"
                >
                  Clear All
                </button>
              </div>

              {/* Permissions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availablePermissions.map((permission) => {
                  const isSelected = selectedPermissions.includes(permission);
                  return (
                    <div
                      key={permission}
                      onClick={() => handlePermissionToggle(permission)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? "bg-blue-50 border-blue-300 shadow-sm"
                          : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? "bg-blue-600 border-blue-600"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {isSelected && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span
                          className={`font-medium ${
                            isSelected ? "text-blue-900" : "text-gray-700"
                          }`}
                        >
                          {permission}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 bg-gray-50 border-t border-gray-200">
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-3 bg-white/10 shadow-lg shadow-black/10 backdrop-blur-sm border border-gray-300  text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRole}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Update Permissions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Permissions Modal */}
      {viewingRole && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                View {viewingRole.name} Permissions
              </h3>
              <button
                onClick={() => setViewingRole(null)}
                className="p-2 text-gray-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Permissions List */}
            <div className="p-6 space-y-2 max-h-[60vh] overflow-y-auto">
              {viewingRole?.permissions?.length > 0 ? (
                viewingRole?.permissions.map((p, idx) => (
                  <div key={idx} className="px-4 py-2 bg-gray-100 rounded-lg">
                    {slugToLabel(p)}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No permissions assigned</p>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50 flex justify-end">
              <button
                onClick={() => setViewingRole(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
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

export default RBACPage;

import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog } from "@headlessui/react";
import axiosHttp from "../../../utils/httpConfig";

export default function ViewUsers() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [onboardForm, setOnboardForm] = useState({
    email: "",
    roleID: 0,
  });
  const [submittingOnboard, setSubmittingOnboard] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosHttp.get("/users");
      setUsers(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axiosHttp.get("/roles");
      setRoles(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch roles");
    }
  };

  const handleDelete = async (user) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axiosHttp.delete(`/user/${user.id}`);
        setUsers(users.filter((u) => u.id !== user.id));
        toast.success("User deleted successfully!");
      } catch (error) {
        toast.error(error.response?.data?.message || "Error deleting user");
      }
    }
  };

  const handleOnboardUser = () => {
    setShowOnboardModal(true);
  };

  const closeOnboardModal = () => {
    setShowOnboardModal(false);
    setOnboardForm({
      email: "",
      roleID: 0,
    });
  };

  const handleOnboardSubmit = async (e) => {
    e.preventDefault();
    if (!onboardForm.email || !onboardForm.roleID || onboardForm.roleID === 0) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setSubmittingOnboard(true);
      const response = await axiosHttp.post("/onboard-user", onboardForm);
      toast.success(response.data.message);
      closeOnboardModal();
      fetchUsers();

      // Download credentials if present
      if (response.data.data?.email && response.data.data?.password) {
        const credentials = response.data.data;
        const selectedRoleName =
          roles.find((r) => r.id === onboardForm.roleID)?.name ||
          String(onboardForm.roleID);
        const content = `Email: ${credentials.email}\nPassword: ${credentials.password}\nRole: ${selectedRoleName}`;
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "user-credentials.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error onboarding user");
    } finally {
      setSubmittingOnboard(false);
    }
  };

  const handleOnboardFormChange = (e) => {
    const { name, value } = e.target;
    setOnboardForm((prev) => ({
      ...prev,
      [name]: name === "roleID" ? Number(value) : value,
    }));
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen  text-white p-6">
      <ToastContainer position="top-right" autoClose={2000} theme="dark" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold ">Users</h1>
          <button
            onClick={handleOnboardUser}
            className="bg-white/10 shadow-lg shadow-black/10 backdrop-blur-sm hover:bg-blue-700 px-6 py-2 rounded-lg font-medium"
          >
            Add User
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search Users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 bg-white/10 shadow-lg shadow-black/10 backdrop-blur-sm border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table */}
        <div className="bg-white/10 shadow-lg shadow-black/10 backdrop-blur-sm  rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/10 shadow-lg shadow-black/10 backdrop-blur-sm">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                  Role
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-black/10 shadow-lg shadow-black/10 backdrop-blur-sm divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-gray-400"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-gray-400"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4">{user.id}</td>
                    <td className="px-6 py-4">{user.email || "-"}</td>
                    <td className="px-6 py-4">{user.role?.name || "-"}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(user)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard User Modal */}
      <Dialog
        open={showOnboardModal}
        onClose={closeOnboardModal}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <Dialog.Panel className="relative bg-gray-800 rounded-lg max-w-md w-full mx-auto p-6 z-50">
            {/* Close */}
            <button
              type="button"
              onClick={closeOnboardModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
            >
              ×
            </button>

            {/* Header */}
            <div className="mb-5">
              <Dialog.Title className="text-lg font-semibold text-white mb-1">
                Add New User
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-400 mb-2">
                Add a new user to the system.
              </Dialog.Description>
            </div>

            <form onSubmit={handleOnboardSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={onboardForm.email}
                  onChange={handleOnboardFormChange}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  placeholder="Enter email"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Role</label>
                <select
                  name="roleID"
                  value={onboardForm.roleID}
                  onChange={handleOnboardFormChange}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                >
                  <option value={0}>Select a role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-center space-x-3 pt-3">
                <button
                  type="submit"
                  disabled={submittingOnboard}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                >
                  {submittingOnboard ? "..." : "CONFIRM"}
                </button>
                <button
                  type="button"
                  onClick={closeOnboardModal}
                  className="px-6 py-2 border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white rounded"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

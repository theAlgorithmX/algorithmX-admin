import React, { useState, useEffect } from 'react';
import { User, Edit, Trash2, X, Check, Plus, Shield, AlertCircle, Eye } from 'lucide-react';

const RBACPage = () => {
  const [newRoleName, setNewRoleName] = useState('');
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [viewingRole, setViewingRole] = useState(null); // NEW: For viewing role permissions

  // Available permissions
  const availablePermissions = [
    'Blogs',
    'Glossary', 
    'Brand Audits',
    'Product Audits',
    'Ebooks',
    'Clients',
    'Press Release',
    'Guides',
    'Impact Stories',
    
  ];

  // Initial roles state
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'ADMIN',
      permissions: [],
      isDeletable: false,
      color: 'bg-red-100 text-red-800'
    },
    {
      id: 2,
      name: 'SALES',
      permissions: ['Blogs', 'Guides', 'Impact Stories', 'Ebooks', 'Product Audits'],
      isDeletable: true,
      color: 'bg-blue-100 text-blue-800'
    }
  ]);

  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Toast notification effect
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
  };

  const getRandomColor = () => {
    const colors = [
      'bg-purple-100 text-purple-800',
      'bg-green-100 text-green-800',
      'bg-yellow-100 text-yellow-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleCreateRole = () => {
    if (newRoleName.trim()) {
      const roleNameUpper = newRoleName.toUpperCase();
      
      // Check if role already exists
      const existingRole = roles.find(role => role.name === roleNameUpper);
      if (existingRole) {
        showToast(`Role "${roleNameUpper}" already exists!`, 'error');
        return;
      }

      const newRole = {
        id: Date.now(),
        name: roleNameUpper,
        permissions: [],
        isDeletable: true,
        color: getRandomColor()
      };
      setRoles([...roles, newRole]);
      setNewRoleName('');
      showToast(`Role "${roleNameUpper}" created successfully!`, 'success');
    }
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setSelectedPermissions([...role.permissions]);
    setShowPermissionsModal(true);
  };

  const handleDeleteRole = (roleId) => {
    setRoles(roles.filter(role => role.id !== roleId));
  };

  const handleViewRole = (role) => {
    setViewingRole(role);
  };

  const handlePermissionToggle = (permission) => {
    setSelectedPermissions(prev => 
      prev.includes(permission) 
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const handleSelectAll = () => {
    setSelectedPermissions([...availablePermissions]);
  };

  const handleClearAll = () => {
    setSelectedPermissions([]);
  };

  const handleUpdateRole = () => {
    if (editingRole) {
      setRoles(roles.map(role => 
        role.id === editingRole.id 
          ? { ...role, permissions: [...selectedPermissions] }
          : role
      ));
      setShowPermissionsModal(false);
      setEditingRole(null);
      setSelectedPermissions([]);
    }
  };

  const handleCancel = () => {
    setShowPermissionsModal(false);
    setEditingRole(null);
    setSelectedPermissions([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Role Management</h1>
          <p className="text-gray-600 mt-1">Manage user roles and permissions for your application</p>
        </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg max-w-sm ${
            toast.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className={`p-1 rounded-full ${
              toast.type === 'success' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {toast.type === 'success' ? (
                <Check className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
            </div>
            <p className="font-medium text-sm">{toast.message}</p>
            <button
              onClick={() => setToast({ show: false, message: '', type: '' })}
              className={`text-sm hover:opacity-70 transition-opacity ${
                toast.type === 'success' ? 'text-green-600' : 'text-red-600'
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Role</h2>
          <p className="text-gray-600 text-sm mb-6">Roles allow you to collaborate with team members by granting them specific permissions to manage different parts of the application.</p>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter role name (e.g., Manager, Editor)"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateRole()}
                />
              </div>
            </div>
            <button
              onClick={handleCreateRole}
              disabled={!newRoleName.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Role
            </button>
          </div>
        </div>

        {/* Roles Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Manage Roles</h2>
            <p className="text-gray-600 text-sm mt-1">View and edit existing roles. Admin role permissions can be modified but the role cannot be deleted.</p>
          </div>

          <div className="overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Role Name</div>
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Permissions</div>
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</div>
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Actions</div>
              </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-200">
              {roles.map((role) => (
                <div key={role.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${role.color}`}>
                        {role.name}
                      </div>
                    </div>
                    
                    <div className="text-gray-900 font-medium">
                      {role.permissions.length} permissions
                    </div>
                    
                    <div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        role.isDeletable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {role.isDeletable ? 'Custom' : 'System'}
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
                      {role.isDeletable && (
                        <button
                          onClick={() => handleDeleteRole(role.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete role"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {roles.length} role{roles.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Permissions Modal - Edit */}
      {showPermissionsModal && editingRole && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${editingRole.color.replace('text-', 'bg-').replace('800', '100')}`}>
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Edit {editingRole.name} Permissions</h3>
                  <p className="text-gray-600 text-sm">Configure which parts of the application this role can access</p>
                </div>
              </div>
              <button
                onClick={handleCancel}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
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
                    {selectedPermissions.length} of {availablePermissions.length} permissions selected
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
                          ? 'bg-blue-50 border-blue-300 shadow-sm'
                          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          isSelected 
                            ? 'bg-blue-600 border-blue-600' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
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
                className="flex-1 px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
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
              <h3 className="text-lg font-semibold">View {viewingRole.name} Permissions</h3>
              <button
                onClick={() => setViewingRole(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Permissions List */}
            <div className="p-6 space-y-2 max-h-[60vh] overflow-y-auto">
              {viewingRole.permissions.length > 0 ? (
                viewingRole.permissions.map((p, idx) => (
                  <div key={idx} className="px-4 py-2 bg-gray-100 rounded-lg">
                    {p}
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

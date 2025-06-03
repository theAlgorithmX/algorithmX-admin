import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, AlertTriangle, X, Check } from 'lucide-react';
import axiosHttp from '../../../utils/httpConfig';

const MangeCategory = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [toast, setToast] = useState(null);

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000);
  };

  // Add new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      showToast('Category name is required', 'error');
      return;
    }

    try {
      const response = await axiosHttp.post('/blog-categories/', {
        title : newCategoryName.trim()
      });
      console.log("response",response);

      if ( response.status === 201) {

          await getCategories();
          setNewCategoryName('');
          showToast(response.data.message);
        }
      
    } catch (error) {
      console.error('Error adding category:', error);
      showToast(error.response.data.message);
    }
  };

  // Start editing category
  const startEdit = (category) => {
    setEditingId(category.id);
    setEditingName(category.title);
  };

  // Save edited category
  const saveEdit = async () => {
    if (!editingName.trim()) {
      showToast('Category name is required', 'error');
      return;
    }

    try {
      const response = await axiosHttp.put(`/blog-categories/${editingId}`, {
        title: editingName.trim()
      });

      if (response.status === 200 || response.status === 201) {
        setCategories(prev => prev.map(cat => 
          cat.id === editingId 
            ? { ...cat, title: editingName.trim() }
            : cat
        ));
        
        setEditingId(null);
        setEditingName('');
        showToast('Category updated successfully!');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      showToast('Failed to update category. Please try again.', 'error');
      setEditingId(null);
      setEditingName('');
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  // Delete category
  const deleteCategory = async (id, categoryName) => {
    try {
      const response = await axiosHttp.delete(`/blog-categories/${id}`);
      
      if (response.status === 200 || response.status === 204) {
        setCategories(prev => prev.filter(cat => cat.id !== id));
        showToast(`"${categoryName}" category deleted successfully!`);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      showToast('Failed to delete category. Please try again.', 'error');
    }
  };

  // Handle Enter key press for adding
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddCategory(e);
    }
  };

  // Handle Enter key press for editing
  const handleEditKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  // Get categories from API
  const getCategories = async () => {
    try {
      const response = await axiosHttp.get('/blog-categories');
      if (response.status === 200) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      showToast('Failed to fetch categories', 'error');
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Category Management</h1>
        <p className="text-gray-600">Manage your categories with ease</p>
      </div>

      {/* Add Category Input */}
      <div className="mb-6">
        <form onSubmit={handleAddCategory} className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter category name and press Enter"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </button>
        </form>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                    No categories found. Add a category to get started.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{category.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === category.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyPress={handleEditKeyPress}
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={saveEdit}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-sm font-medium text-gray-900">{category.title}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEdit(category)}
                          className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors duration-200"
                        >
                          <Edit2 className="w-3 h-3 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => deleteCategory(category.id, category.title)}
                          className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-200"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
          <div className={`flex items-center px-4 py-3 rounded-lg shadow-lg max-w-sm ${
            toast.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
            ) : (
              <AlertTriangle className="w-5 h-5 mr-3 text-red-500" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="ml-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MangeCategory;
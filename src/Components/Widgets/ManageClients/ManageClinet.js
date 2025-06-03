import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Plus, Edit2, Trash2, Upload, CheckCircle, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import axiosHttp from "../../../utils/httpConfig";

const ManageClients = () => {
  const [clients, setClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      brandName: '',
      regions: '',
      industries: '',
      categories: '',
      image: null,
      imageAltText: '',
    }
  });

  // Watch for current image changes
  const currentImage = watch("image") || "";
  const watchedImage = watch('image');

  // Fetch clients on component mount
  useEffect(() => {
    fetchClients();
  }, []);

  // Fetch clients from API
  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await axiosHttp.get("/clients/");
      console.log('API Response:', response.data);
      // Handle different response structures
      const clientsData = Array.isArray(response.data) ? response.data : 
                         (response.data && Array.isArray(response.data.data)) ? response.data.data : [];
      setClients(clientsData);
    } catch (error) {
      console.error('Error fetching clients:', error);
      showToast('Failed to fetch clients', 'error');
      setClients([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      // Process image data according to the exact logic required
      let imageFile = null;
      if (typeof data?.image === "string") {
        imageFile = data?.image;  // Existing image URL from API
      } else {
        if (data.image && data.image.length > 0) {
          imageFile = data.image[0];  // New file upload (FileList)
        }
      }

      const clientData = {
        title: data.title,
        brandName: data.brandName,
        brandRegion: data.regions,
        brandRequirement: data.industries,
        brandCategory: data.categories,
        brandLogo: imageFile,
        imageAltText: data.imageAltText || '',
      };

      console.log('Submitting client data:', clientData);

      if (editingClient) {
        // Update existing client
        const response = await axiosHttp.put(`/clients/${editingClient.id}`, clientData);
        console.log('Update response:', response.data);
        showToast('Client updated successfully!');
      } else {
        // Add new client
        const response = await axiosHttp.post('/clients/', clientData);
        console.log('Add response:', response.data);
        showToast('Client added successfully!');
      }

      // Refresh the clients list
      await fetchClients();
      closeModal();
    } catch (error) {
      console.error('Error saving client:', error);
      console.error('Error details:', error.response?.data);
      showToast(error.response?.data?.message || 'Failed to save client', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Open modal for adding new client
  const openAddModal = () => {
    setEditingClient(null);
    setIsEditMode(false);
    setImagePreview(null);
    reset({
      title: '',
      brandName: '',
      regions: '',
      industries: '',
      categories: '',
      image: null,
      imageAltText: '',
    });
    setIsModalOpen(true);
  };

  // Open modal for editing client
  const openEditModal = (client) => {
    setEditingClient(client);
    setIsEditMode(true);
    
    // Set form values with proper image handling
    setValue('title', client.title || '');
    setValue('brandName', client.brandName || '');
    setValue('regions', client.brandRegion || '');
    setValue('industries', client.brandRequirement || '');
    setValue('categories', client.brandCategory || '');
    setValue('image', client.brandLogo || client.image_url || client.image || null);
    setValue('imageAltText', client.imageAltText || client.image_alt || client.alt_text || '');
    
    // Set image preview for existing images
    const existingImage = client.brandLogo || client.image_url || client.image;
    if (existingImage && typeof existingImage === 'string') {
      setImagePreview(existingImage);
    } else {
      setImagePreview(null);
    }
    
    setIsModalOpen(true);
  };

  // Close modal and reset form
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
    setIsEditMode(false);
    setImagePreview(null);
    reset({
      title: '',
      brandName: '',
      regions: '',
      industries: '',
      categories: '',
      image: null,
      imageAltText: '',
    });
  };

  // Delete client
  const deleteClient = async (id, clientTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${clientTitle}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await axiosHttp.patch(`/clients/${id}`);
      showToast(`"${clientTitle}" client deleted successfully!`, 'success');
      // Refresh the clients list
      await fetchClients();
    } catch (error) {
      console.error('Error deleting client:', error);
      showToast('Failed to delete client', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle image preview for new uploads
  useEffect(() => {
    if (watchedImage && watchedImage instanceof FileList && watchedImage[0]) {
      const file = watchedImage[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file', 'error');
        return;
      }
      
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof watchedImage === 'string' && watchedImage) {
      // Handle existing image URLs
      setImagePreview(watchedImage);
    } else if (!watchedImage) {
      // Clear preview when no image
      setImagePreview(null);
    }
  }, [watchedImage]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Management</h1>
        <p className="text-gray-600">Manage your clients with ease</p>
      </div>

      {/* Add Client Button */}
      <div className="mb-6">
        <button
          onClick={openAddModal}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm disabled:opacity-50"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </button>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand Logo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Regions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requirements</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categories</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    Loading clients...
                  </td>
                </tr>
              ) : !Array.isArray(clients) || clients.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    No clients found. Click "Add Client" to get started.
                  </td>
                </tr>
              ) : (
                clients.filter(client => client && typeof client === 'object').map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{client.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{client.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{client.brandName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(client.brandLogo || client.image_url || client.image) ? (
                        <img 
                          src={client.brandLogo || client.image_url || client.image} 
                          alt={client.imageAltText || client.image_alt || client.brandName || 'Brand logo'}
                          className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200" 
                           style={{ display: (client.brandLogo || client.image_url || client.image) ? 'none' : 'flex' }}>
                        <ImageIcon className="w-5 h-5 text-gray-400" />
                        <span className="text-xs text-gray-400 ml-1">No logo</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{client.brandRegion}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{client.brandRequirement}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{client.brandCategory}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(client)}
                          disabled={loading}
                          className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors duration-200 disabled:opacity-50"
                        >
                          <Edit2 className="w-3 h-3 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => deleteClient(client.id, client.title)}
                          disabled={loading}
                          className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-200 disabled:opacity-50"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingClient ? 'Edit Client' : 'Add New Client'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Title Field */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    {...register('title', { 
                      required: 'Title is required',
                      minLength: { value: 2, message: 'Title must be at least 2 characters' }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter client title"
                    disabled={loading}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                {/* Brand Name Field */}
                <div>
                  <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    id="brandName"
                    {...register('brandName', { 
                      required: 'Brand name is required',
                      minLength: { value: 2, message: 'Brand name must be at least 2 characters' }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter brand name"
                    disabled={loading}
                  />
                  {errors.brandName && (
                    <p className="mt-1 text-sm text-red-600">{errors.brandName.message}</p>
                  )}
                </div>

                {/* Categories Field */}
                <div>
                  <label htmlFor="categories" className="block text-sm font-medium text-gray-700 mb-2">
                    Categories *
                  </label>
                  <input
                    type="text"
                    id="categories"
                    {...register('categories', { 
                      required: 'Categories are required'
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter categories (e.g., Technology, Finance)"
                    disabled={loading}
                  />
                  {errors.categories && (
                    <p className="mt-1 text-sm text-red-600">{errors.categories.message}</p>
                  )}
                </div>

                {/* Regions Field */}
                <div>
                  <label htmlFor="regions" className="block text-sm font-medium text-gray-700 mb-2">
                    Regions *
                  </label>
                  <input
                    type="text"
                    id="regions"
                    {...register('regions', { 
                      required: 'Regions are required'
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter regions (e.g., North America, Europe)"
                    disabled={loading}
                  />
                  {errors.regions && (
                    <p className="mt-1 text-sm text-red-600">{errors.regions.message}</p>
                  )}
                </div>

                {/* Industries/Requirements Field */}
                <div>
                  <label htmlFor="industries" className="block text-sm font-medium text-gray-700 mb-2">
                    Requirements *
                  </label>
                  <input
                    type="text"
                    id="industries"
                    {...register('industries', { 
                      required: 'Requirements are required'
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter requirements (e.g., UX Design, Development)"
                    disabled={loading}
                  />
                  {errors.industries && (
                    <p className="mt-1 text-sm text-red-600">{errors.industries.message}</p>
                  )}
                </div>

                {/* Image Upload Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isEditMode ? 'Replace Image' : 'Upload Image'} {!isEditMode && '*'}
                  </label>
                  <div className="space-y-3">
                    <label className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200 transition-colors duration-200">
                      <Upload className="w-4 h-4 mr-2" />
                      {isEditMode ? 'Choose New Image' : 'Choose Image'}
                      <input
                        type="file"
                        {...register('image', { 
                          required: isEditMode ? false : 'Image is required',
                          validate: {
                            fileType: (fileList) => {
                              if (!fileList || fileList.length === 0) return true;
                              const file = fileList[0];
                              if (!file.type.startsWith('image/')) {
                                return 'Only image files are allowed';
                              }
                              return true;
                            }
                          }
                        })}
                        accept="image/*"
                        className="hidden"
                        disabled={loading}
                      />
                    </label>
                    
                    {/* Helper Text */}
                    <p className="text-xs text-gray-500">
                      {isEditMode ? '(Leave empty to keep current image)' : '(Only image files are allowed)'}
                    </p>
                    
                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mt-3">
                        <div className="relative inline-block">
                          <img 
                            src={imagePreview} 
                            alt="Image preview" 
                            className="h-24 w-24 object-cover rounded-lg border border-gray-200"
                            style={{ minWidth: '100px', minHeight: '100px' }}
                          />
                          {isEditMode && typeof watchedImage === 'string' && (
                            <div className="absolute -top-2 -right-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Current
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Image Placeholder when no preview */}
                    {!imagePreview && (
                      <div className="h-24 w-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <div className="text-center">
                          <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                          <span className="text-xs text-gray-400">No image</span>
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.image && (
                    <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
                  )}
                </div>

                {/* Image Alt Text Field */}
                <div>
                  <label htmlFor="imageAltText" className="block text-sm font-medium text-gray-700 mb-2">
                    Image Alt Text
                  </label>
                  <input
                    type="text"
                    id="imageAltText"
                    {...register('imageAltText')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the image for accessibility"
                    disabled={loading}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Optional: Provide alternative text for screen readers and accessibility
                  </p>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={loading}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingClient ? 'Update Client' : 'Add Client')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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

export default ManageClients;
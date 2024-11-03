import React, { useState, useEffect } from 'react';
import {
  getInfographics,
  createInfographic,
  updateInfographic,
  deleteInfographic,
} from '../../services/AdminService';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

const ManageInfographics = () => {
  const [infographicList, setInfographicList] = useState([]);
  const [form, setForm] = useState({ id: null, title: '', image: null, description: '' });
  const [imagePreview, setImagePreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadInfographics();
  }, []);

  const loadInfographics = async () => {
    const data = await getInfographics();
    setInfographicList(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.id) {
      await updateInfographic(form.id, form);
    } else {
      await createInfographic(form);
    }
    resetForm();
    loadInfographics();
    closeModal();
  };

  const resetForm = () => {
    setForm({ id: null, title: '', image: null, description: '' });
    setImagePreview(null);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (item) => {
    setForm(item);
    setImagePreview(`data:image/jpeg;base64,${item.image}`);
    openModal();
  };

  const handleDelete = async (id) => {
    await deleteInfographic(id);
    loadInfographics();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Infographics</h1>
      <div className="text-right mb-4">
        <button
          onClick={openModal}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New
        </button>
      </div>
      <ul className="space-y-4">
        {infographicList.map((item) => (
          <li key={item.id} className="p-4 border border-gray-300 rounded-lg flex items-start bg-white shadow-md">
            <div className="flex-shrink-0 mr-4">
              <img
                src={`data:image/jpeg;base64,${item.image}`}
                alt={item.title}
                className="w-32 h-32 object-cover rounded-lg"
              />
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mb-2">{item.description}</p>
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-xl font-semibold mb-4">
          {form.id ? 'Update Infographic' : 'Create Infographic'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              required={!form.id}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-4 w-32 h-32 object-cover rounded-lg"
              />
            )}
          </div>
          <div className="mb-4">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              {form.id ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageInfographics;

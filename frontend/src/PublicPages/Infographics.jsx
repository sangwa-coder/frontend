import React, { useState, useEffect } from 'react';
import { getAllInfographics } from '../services/PublicServices';
import Modal from 'react-modal';

const Infographics = () => {
  const [infographicsList, setInfographicsList] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    loadInfographics();
  }, []);

  const loadInfographics = async () => {
    const data = await getAllInfographics();
    setInfographicsList(data);
  };

  const openModal = (image) => {
    setSelectedImage(image);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Infographics</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {infographicsList.map((item) => (
          <div
            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition hover:scale-105"
            key={item.id}
            onClick={() => openModal(`data:image/jpeg;base64,${item.image}`)}
          >
            <img
              className="w-full h-48 object-cover cursor-pointer"
              src={`data:image/jpeg;base64,${item.image}`}
              alt={item.title}
            />
            <div className="p-4">
              <h2 className="text-2xl font-semibold mb-2">{item.title}</h2>
              <p className="text-gray-700">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      {selectedImage && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Zoomed Image"
          className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-75"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-white rounded-lg overflow-hidden max-w-3xl mx-auto">
            <img src={selectedImage} alt="Zoomed Infographic" className="w-full h-auto" />
            <button onClick={closeModal} className="p-2 bg-red-500 text-white rounded mt-4">
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Infographics;

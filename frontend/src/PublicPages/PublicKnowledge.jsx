import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPublicKnowledge } from '../services/PublicServices';

const PublicKnowledge = () => {
  const [publicKnowledgeList, setPublicKnowledgeList] = useState([]);

  useEffect(() => {
    loadPublicKnowledge();
  }, []);

  const loadPublicKnowledge = async () => {
    try {
      const data = await getAllPublicKnowledge();
      setPublicKnowledgeList(data);
    } catch (error) {
      console.error('Error loading public knowledge:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Public Knowledge</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {publicKnowledgeList && publicKnowledgeList.length > 0 ? (
          publicKnowledgeList.map((item) => (
            <div
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition hover:scale-105"
              key={item.id}
            >
              <img
                className="w-full h-48 object-cover"
                src={`data:image/jpeg;base64,${item.image}`}
                alt={item.title}
              />
              <div className="p-4">
                <h2 className="text-2xl font-semibold mb-2">{item.title}</h2>
                <p className="text-gray-700 mb-2">
                  {item.content.length > 100 ? item.content.substring(0, 100) + '...' : item.content}
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  {new Date(item.datePublished).toLocaleDateString()}
                </p>
                <Link to={`/public-knowledge/${item.id}`} className="text-blue-500 hover:underline">
                  Read More
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>No public knowledge articles available.</p>
        )}
      </div>
    </div>
  );
};

export default PublicKnowledge;

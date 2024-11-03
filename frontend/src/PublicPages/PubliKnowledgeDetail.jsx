import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicKnowledgeById } from '../services/PublicServices';

// Importing Google Fonts
const loadGoogleFonts = () => {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};

const PublicKnowledgeDetail = () => {
  const { id } = useParams();
  const [publicKnowledge, setPublicKnowledge] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    loadGoogleFonts();
    const fetchPublicKnowledge = async () => {
      try {
        const data = await getPublicKnowledgeById(id);
        setPublicKnowledge(data);
      } catch (error) {
        console.error('Error fetching public knowledge details:', error);
      }
    };
    fetchPublicKnowledge();
    loadComments();
  }, [id]);

  const loadComments = () => {
    const storedComments = JSON.parse(localStorage.getItem(`comments-${id}`)) || [];
    setComments(storedComments);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    const newComment = {
      id: Date.now(),
      content: comment,
      date: new Date().toISOString(),
    };
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    localStorage.setItem(`comments-${id}`, JSON.stringify(updatedComments));
    setComment('');
  };

  if (!publicKnowledge) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center font-roboto">{publicKnowledge.title}</h1>
        <img
          className="w-full h-96 object-cover mb-4 rounded-lg"
          src={`data:image/jpeg;base64,${publicKnowledge.image}`}
          alt={publicKnowledge.title}
        />
        <p className="text-lg mb-4 font-roboto">{publicKnowledge.content}</p>
        <p className="text-gray-500 text-sm mb-4 text-center font-roboto">
          Published on: {new Date(publicKnowledge.datePublished).toLocaleDateString()}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mt-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-center font-roboto">Comments</h2>
        {comments.map((comment) => (
          <div key={comment.id} className="mb-4 p-4 border rounded-lg bg-gray-100">
            <p className="text-gray-700 font-roboto">{comment.content}</p>
            <p className="text-gray-500 text-sm font-roboto">
              {new Date(comment.date).toLocaleDateString()} at {new Date(comment.date).toLocaleTimeString()}
            </p>
          </div>
        ))}
        <form onSubmit={handleCommentSubmit} className="mt-4">
          <textarea
            value={comment}
            onChange={handleCommentChange}
            placeholder="Write a comment..."
            required
            className="w-full p-2 border border-gray-300 rounded mb-4 font-roboto"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-roboto"
          >
            Submit Comment
          </button>
        </form>
      </div>
    </div>
  );
};

export default PublicKnowledgeDetail;

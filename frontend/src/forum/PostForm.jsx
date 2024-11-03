import React, { useState } from 'react';
import '../index.css';

const PostForm = ({ onNewPost }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onNewPost(content);
    setContent('');
  };

  return (
    <form className="post-form mt-4 flex flex-col space-y-4" onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your message"
        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        rows="4"
      />
      <button
        type="submit"
        className="self-end bg-green-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-200"
      >
        Post
      </button>
    </form>
  );
};

export default PostForm;

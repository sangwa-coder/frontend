import React, { useState } from 'react';
import '../App.css';

const ThreadForm = ({ onNewThread }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onNewThread(title);
    setTitle('');
  };

  return (
    <form className="thread-form flex flex-col space-y-4" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Thread title"
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="self-end bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
      >
        Create Thread
      </button>
    </form>
  );
};

export default ThreadForm;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ManageMyResearch = () => {
  const [research, setResearch] = useState([]);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      axios.get(`/api/research/user/${userId}`)
        .then(response => {
          setResearch(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the research!', error);
        });
    } else {
      navigate('/login');
    }
  }, [userId, navigate]);

  return (
    <div>
      <h2>My Research</h2>
      <ul>
        {research.map((item) => (
          <li key={item.researchID}>
            <h3>{item.title}</h3>
            <p>{item.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageMyResearch;

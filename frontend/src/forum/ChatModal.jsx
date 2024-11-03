import React, { useState } from 'react';
import { Box, Modal, Typography, Button, TextField } from '@mui/material';
import { sendMessage } from '../services/WebSocketService';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ChatModal = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSendMessage = () => {
    sendMessage(message);
    setMessages([...messages, message]);
    setMessage('');
  };

  return (
    <Modal
      open
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Chat
        </Typography>
        <Box id="modal-modal-description" sx={{ mt: 2 }}>
          {messages.map((msg, index) => (
            <Typography key={index}>{msg}</Typography>
          ))}
          <TextField
            fullWidth
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message"
          />
          <Button onClick={handleSendMessage} sx={{ mt: 2 }} variant="contained">
            Send
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ChatModal;

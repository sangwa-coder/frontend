import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';

const UserCard = ({ user }) => {
  return (
    <Card sx={{ display: 'flex', mb: 2 }}>
      <Avatar sx={{ bgcolor: 'primary.main', m: 2 }}>{user.name.charAt(0)}</Avatar>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent>
          <Typography variant="h6">{user.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.role}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.phone}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.address}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
};

export default UserCard;

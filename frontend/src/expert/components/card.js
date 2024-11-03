import React from 'react';
import { Box, Typography } from '@mui/material';

export const Card = ({ children, sx, ...props }) => {
  return (
    <Box sx={{ borderRadius: 1, boxShadow: 3, overflow: 'hidden', ...sx }} {...props}>
      {children}
    </Box>
  );
};

export const CardHeader = ({ children, ...props }) => (
  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }} {...props}>
    {children}
  </Box>
);

export const CardTitle = ({ children, ...props }) => (
  <Typography variant="h6" component="div" {...props}>
    {children}
  </Typography>
);

export const CardDescription = ({ children, ...props }) => (
  <Typography variant="body2" color="textSecondary" {...props}>
    {children}
  </Typography>
);

export const CardContent = ({ children, ...props }) => (
  <Box sx={{ p: 2 }} {...props}>
    {children}
  </Box>
);

export const CardFooter = ({ children, ...props }) => (
  <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }} {...props}>
    {children}
  </Box>
);

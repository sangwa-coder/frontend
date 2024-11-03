import React from 'react';
import { Box, Typography } from '@mui/material';

export const ChartContainer = ({ config, children, ...props }) => {
  // Example: Passing styles based on config (customize as needed)
  const chartStyles = {
    desktop: {
      fill: config.desktop.color,
    },
    mobile: {
      fill: config.mobile.color,
    },
  };

  return (
    <Box {...props}>
      {children}
    </Box>
  );
};

export const ChartTooltip = ({ content, ...props }) => {
  return <div {...props}>{content}</div>;
};

export const ChartTooltipContent = ({ indicator, ...props }) => {
  // Customize the tooltip content as needed
  return (
    <div {...props}>
      <Typography variant="body2">
        {/* Display additional details here */}
        Tooltip content with indicator: {indicator}
      </Typography>
    </div>
  );
};

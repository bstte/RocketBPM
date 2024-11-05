import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const CustomHeader = ({ title }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
   

<AppBar>
<Toolbar>
  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
  <IconButton edge="start" color="inherit" aria-label="back" onClick={handleBack}>
          <ArrowBackIcon  fontSize="large"/> 
        </IconButton>
    <Typography variant="h6" sx={{ marginLeft: 'auto' }}>
      {title}
    </Typography>
  </Box>
</Toolbar>
</AppBar>
  );
};

export default CustomHeader;

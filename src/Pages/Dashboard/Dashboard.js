import React from 'react';
import CustomDrawer from '../../components/CustomDrawer';
import { Box } from '@mui/material';

const Dashboard = () => {
  return (
    <div>
      <CustomDrawer title="Dashboard" />
      
      {/* Add padding to the top to account for the height of the AppBar */}
      <Box sx={{ padding: '20px', marginTop: '64px', flex: 1 }}>
        <h1>Welcome to the Dashboard</h1>
        {/* Dashboard content here */}
      </Box>
    </div>
  );
};

export default Dashboard;

import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, AppBar, Toolbar, Typography, IconButton, Box, Avatar, Grid } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/userSlice';

const CustomDrawer = ({ title }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const dispatch = useDispatch();

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    const isConfirmed = window.confirm('Are you sure you want to logout?');
    if (isConfirmed) {
      dispatch(logoutUser());
      navigate('/login');
    }
  };

  return (
    <div style={{marginBottom:"50px"}}>
      {/* AppBar */}
      <AppBar>
        <Toolbar>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ marginLeft: 'auto' }}>
              {title}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer open={drawerOpen} onClose={() => toggleDrawer(false)}>
        <Box sx={{ width: 250, display: 'flex', flexDirection: 'column', height: '100%' }} role="presentation">
          {/* User Info */}
          <Box sx={{ backgroundColor: '#f0f0f0', padding: '20px' }}>
            <Grid container alignItems="center">
              <Grid item xs={8}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {user.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {user.email}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: '#3f51b5',
                    marginLeft: 'auto',
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
              </Grid>
            </Grid>
          </Box>

          {/* Menu Items */}
          <Box sx={{ flexGrow: 1 }}>
            <List>
              <ListItem 
                button 
                onClick={() => navigate('/dashboard')} 
                selected={location.pathname === '/dashboard'} // Highlight if active
                sx={{ backgroundColor: location.pathname === '/dashboard' ? '#e0e0e0' : 'transparent', mb: 1 }}
              >
                <ListItemText primary="Dashboard" />
              </ListItem>
              <ListItem 
                button 
                onClick={() => navigate('/profile')} 
                selected={location.pathname === '/profile'} // Highlight if active
                sx={{ backgroundColor: location.pathname === '/profile' ? '#e0e0e0' : 'transparent', mb: 1 }}
              >
                <ListItemText primary="Profile" />
              </ListItem>
              <ListItem 
                button 
                onClick={() => navigate('/List-process-title')} 
                selected={location.pathname === '/List-process-title'} // Highlight if active
                sx={{ backgroundColor: location.pathname === '/List-process-title' ? '#e0e0e0' : 'transparent', mb: 1 }}
              >
                <ListItemText primary="Process" />
              </ListItem>
            </List>
          </Box>

          {/* Logout Button */}
          <Box sx={{ backgroundColor: '#3f51b5', color: "white" }}>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </Box>
        </Box>
      </Drawer>
    </div>
  );
};

export default CustomDrawer;

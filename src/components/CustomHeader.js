import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { ImageBaseUrl } from '../API/api';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/userSlice';

const CustomHeader = ({ title }) => {
  const user = useSelector((state) => state.user.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };
 const handleLogout = () => {
    const isConfirmed = window.confirm("Are you sure you want to logout?");
    if (isConfirmed) {
      dispatch(logoutUser());
      navigate("/login");
    }
  };
  return (


    <AppBar>
      <div className="ss_logo_hed_sec">
        <div className="ss_logo_lft_div">
          <img src="https://newprocesslab.com/wp-content/uploads/2021/12/cropped-Logo_NewProcessLab_60x523-1-1.png" alt=''/>
        </div>

        <div className="ss_profile_rit_div"  style={{flexDirection:"row"}}>
          { user?.Profile_image ? (
            <img src={`${ImageBaseUrl}uploads/profile_images/${user?.Profile_image}`} alt="Profile" className="profile-image" onClick={()=>navigate('/Account')} />
          ) : (
            <img src="../../../img/user.png" alt="" onClick={()=>navigate('/Account')}/>
          )}
        <div >
              <div>{`Hi, ${user?.first_name || ""}`}</div>
              <span
                onClick={handleLogout}
                style={{
                  cursor: "pointer",
                  color: "blue",
                  textDecoration: "underline",
                }}
              >
                Logout?
              </span>
            </div>
        </div>
      </div>
      <Toolbar>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <IconButton edge="start" color="inherit" aria-label="back" onClick={handleBack}>
            <ArrowBackIcon fontSize="large" />
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

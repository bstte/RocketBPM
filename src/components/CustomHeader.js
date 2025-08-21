import React, { useState, useRef, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ImageBaseUrl } from '../API/api';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/userSlice';
import { useTranslation } from '../hooks/useTranslation';

const CustomHeader = ({ title }) => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
 const t = useTranslation();
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

  // Handle dropdown toggle
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <AppBar>
      <div className="ss_logo_hed_sec">
        <div className="ss_logo_lft_div">
          <img src="../../img/RocketBPM_rocket_logo.png" alt='logo' onClick={() => navigate("/dashboard")} />
        </div>

        <div className="ss_profile_rit_div" style={{ flexDirection: "row" }}>
         

          {/* Dropdown Button */}
          <div className='ss_header_new_right' ref={dropdownRef} style={{ position: "relative" }}>
            <div id="dropdownBtn" onClick={toggleDropdown}> 
            { user?.Profile_image ? (
            <img src={
              user?.Profile_image.startsWith('http')
                ? user.Profile_image // ✅ Google ka full URL
                : `${ImageBaseUrl}uploads/profile_images/${user.Profile_image}` // ✅ Local image
            } alt="Profile" className="profile-image"  />
          ) : (
            <img src="../../../img/user-circle-solid.svg" alt="" />
          )} 
            </div>
            {dropdownOpen && (
            <div className="dropdown-content">
            <button onClick={() => navigate('/Account')} className="dropdown-link">{t('Edit_Profile')}</button>
            <button onClick={() => handleLogout()} className="dropdown-link">{t("Log_out")}</button>
          </div>
          
            )}
          </div>
        </div>
      </div>
      <Toolbar  className='boxHead' >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <IconButton edge="start" color="inherit" aria-label="back" onClick={handleBack}>
            {/* <ArrowBackIcon fontSize="large" /> */}
            {/* <div className="ss_dash_3dots_sec"><img src="../../img/more-3dots.png" alt=''/></div> */}
          </IconButton>

          <Typography variant="h6" sx={{ marginLeft: 'auto' }}>
            <div className="ss_process_title"><img src="../../img/globe-solid.svg" alt='' /> {title}</div> 
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};




export default CustomHeader;

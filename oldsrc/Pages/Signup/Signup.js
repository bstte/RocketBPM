import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import './Signup.css'; 

import CustomAlert from '../../components/CustomAlert';
import { signup } from '../../API/api';

const Signup = () => {
  const location = useLocation();
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: ''
  });

  const getQueryParams = useCallback(() => {
    const searchParams = new URLSearchParams(location.search);
    return {
      firstName: searchParams.get('first_name') || '',
      lastName: searchParams.get('last_name') || '',
      email: searchParams.get('email') || '',
      role: searchParams.get('role') || ''
    };
  }, [location.search]);
  
  useEffect(() => {
    setFormData(getQueryParams());
  }, [getQueryParams]);
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName) {
      CustomAlert.error("Required Field", "First Name is required!");
      return;
    }
    if (!formData.lastName) {
      CustomAlert.error("Required Field", "Last Name is required!");
      return;
    }
    if (!formData.password) {
      CustomAlert.error("Required Field", "Password is required!");
      return;
    }

    try {
      // Yahan aap API call kar sakte hain signup ke liye
    
      const response = await signup({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
     
      });
      CustomAlert.success("Success", response.message);
    
      navigate('/login',{ replace: true }); 
   
    } catch (error) {
      CustomAlert.error("Error", error.response.data.message);
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-image">
          <img 
            src="https://sp-ao.shortpixel.ai/client/to_auto,q_glossy,ret_img/https://newprocesslab.com/wp-content/uploads/2021/12/cropped-Logo_NewProcessLab_60x523-1-1.png" 
            alt="Logo" 
            className="login-logo"
          />
        </div>
        <h2>Join RocketBPM.com</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="login-input"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="login-input"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="login-input"
            disabled // Email change na ho
          />
           <input
            type="text"
           
            value={formData.role}
          
            className="login-input"
            disabled // Email change na ho
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="login-input"
          />
          <button type="submit" className="login-button">SIGN UP</button>
          <p>Already a member?<button className="btn_form" type='button' onClick={()=> navigate('/login')}>Sign in</button></p>
        </form>
      </div>
    </div>
  );
};

export default Signup;

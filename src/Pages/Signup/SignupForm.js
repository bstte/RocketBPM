import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';

import './Signup.css'; 

import CustomAlert from '../../components/CustomAlert';
import { submitSignupForm } from '../../API/api';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // 👁️ Import eye icons

const SignupForm = () => {
  const navigate = useNavigate();
const [showPassword, setShowPassword] = useState(false); // 👁️ toggle for password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 👁️ toggle for confirm password

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '', 
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validations
    if (!formData.firstName) {
      CustomAlert.error("Required Field", "First Name is required!");
      return;
    }
    if (!formData.lastName) {
      CustomAlert.error("Required Field", "Last Name is required!");
      return;
    }
    if (!formData.email) {
      CustomAlert.error("Required Field", "Email is required!");
      return;
    }
    if (!formData.password) {
      CustomAlert.error("Required Field", "Password is required!");
      return;
    }
    if (!formData.confirmPassword) {
      CustomAlert.error("Required Field", "Confirm Password is required!");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      CustomAlert.error("Password Mismatch", "Passwords do not match!");
      return;
    }

    try {
      const response = await submitSignupForm({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      CustomAlert.success("Success", response.message);
      navigate('/login', { replace: true });

    } catch (error) {
      CustomAlert.error("Error", error?.response?.data?.message || "Signup failed.");
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-image">
        <img src="/img/RocketBPM_rocket_logo.png" alt='' style={{ width: "15vw"}}/>
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
          />
         {/* 👁️ Password input with eye toggle */}
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="login-input password-input"
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* 👁️ Confirm Password input with eye toggle */}
          <div className="password-container">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="login-input password-input"
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button type="submit" className="login-button">SIGN UP</button>
          <p>Already a member?
            <button className="btn_form" type='button' onClick={() => navigate('/login')}>Sign in</button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;

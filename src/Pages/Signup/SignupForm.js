import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './Signup.css';

import CustomAlert from '../../components/CustomAlert';
import { submitSignupForm } from '../../API/api';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // 👁️ Import eye icons
import { useTranslation } from '../../hooks/useTranslation';

const SignupForm = () => {
  const navigate = useNavigate();
  const t = useTranslation();
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
      CustomAlert.error(t('required_field'), t('first_name_is_required'));
      return;
    }
    if (!formData.lastName) {
      CustomAlert.error(t('required_field'), t('last_name_is_required'));
      return;
    }
    if (!formData.email) {
      CustomAlert.error(t('required_field'), t('email_is_required'));
      return;
    }
    if (!formData.password) {
      CustomAlert.error(t('required_field'), t('password_is_required'));
      return;
    }
    if (!formData.confirmPassword) {
      CustomAlert.error(t('required_field'), t('confirm_password_is_required'));
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      CustomAlert.error(t('required_field'), t('passwords_do_not_match'));
      return;
    }

    try {
      const response = await submitSignupForm({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      console.log("reposdf", response)
      CustomAlert.success(t('signup_success'), response.message);
      navigate('/login', { replace: true });

    } catch (error) {
      CustomAlert.error("Error", error?.response?.data?.message || t('signup_failed'));
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-image">
          <img src="/img/RocketBPM_rocket_logo.png" alt='' style={{ width: "15vw" }} />
        </div>
        <h2>{t('join_rocketbpmcom')}</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder={t('First_Name')}
            className="login-input"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder={t('Last_Name')}
            className="login-input"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t('Email')}
            className="login-input"
          />
          {/* 👁️ Password input with eye toggle */}
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t('password')}
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
              placeholder={t('confirm_password')}
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

          <button type="submit" className="login-button">{t('sign_up')}</button>
          <p>{t('already_a_member')}
            <button className="btn_form" type='button' onClick={() => navigate('/login')}>{t('sign_in')}</button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;

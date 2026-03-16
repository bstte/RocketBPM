import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import './Signup.css';

import CustomAlert from '../../components/CustomAlert';
import { CurrentUser, signup } from '../../API/api';
import { setUser } from '../../redux/userSlice';
import { useDispatch } from 'react-redux';
import { useTranslation } from '../../hooks/useTranslation';

const Signup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const t = useTranslation();


  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '', // ✅ Add this
    role: ''
  });

  const dispatch = useDispatch();

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
      CustomAlert.error(t('required_field'), t('first_name_is_required'));
      return;
    }
    if (!formData.lastName) {
      CustomAlert.error(t('required_field'), t('last_name_is_required'));
      return;
    }
    if (!formData.password) {
      CustomAlert.error(t('required_field'), t('password_is_required'));
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      CustomAlert.error(t('required_field'), t('passwords_do_not_match'));
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
      // CustomAlert.success("Success", response.message);

      // navigate('/login',{ replace: true }); 

      // ✅ Store token in localStorage
      localStorage.setItem('token', response.access_token);

      // ✅ Get current user
      const userResponse = await CurrentUser(response.access_token);
      dispatch(setUser(userResponse)); // store in redux

      // ✅ Success
      CustomAlert.success(t('success'), response.message);

      // ✅ Go to dashboard directly
      navigate('/dashboard', { replace: true });

    } catch (error) {
      CustomAlert.error("Error", error.response?.data?.message || t('signup_failed'));
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
            disabled // Email change na ho
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={t('password')}
            className="login-input"
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder={t('confirm_password')}
            className="login-input"
          />

          <button type="submit" className="login-button">{t('sign_up')}</button>
          <p>{t('already_a_member')}<button className="btn_form" type='button' onClick={() => navigate('/login')}>{t('sign_in')}</button></p>
        </form>
      </div>
    </div>
  );
};

export default Signup;

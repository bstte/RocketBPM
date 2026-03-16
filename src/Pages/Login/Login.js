import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file for styling
import { loginUser, setTranslations, setTranslationsTemp, setUser, completeLoginTransition } from '../../redux/userSlice';
import { CurrentUser, googleOAuth, microsoftOAuth } from '../../API/api';
import { GoogleLogin } from '@react-oauth/google';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../../hooks/msalConfig';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // 👁️ Import eye icons
import { useTranslation } from '../../hooks/useTranslation';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👁️ password toggle state

  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { instance } = useMsal();
  const t = useTranslation();

  const from = location.state?.from?.pathname
    ? location.state.from.pathname + (location.state.from.search || '')
    : '/dashboard';


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }


  }, []);
  const handleMicrosoftLogin = async () => {
    try {
      const loginResponse = await instance.loginPopup(loginRequest);
      const account = loginResponse.account;

      // Acquire token silently
      const tokenResponse = await instance.acquireTokenSilent({
        ...loginRequest,
        account: account
      });

      const accessToken = tokenResponse.accessToken;

      // Send token to backend
      const response = await microsoftOAuth(accessToken); // API call
      localStorage.setItem('token', response.access_token);
      dispatch(setUser(response.user));
      if (response.translations) {
        dispatch(setTranslationsTemp(response.translations));
      }
      navigate(from, { replace: true });
      dispatch(completeLoginTransition());

    } catch (error) {
      console.error("Microsoft login failed", error);
      setError("Microsoft Sign-In Failed");
    }
  };


  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const tokenId = credentialResponse.credential;
      const data = await googleOAuth(tokenId);
      localStorage.setItem('token', data.access_token);
      dispatch(setUser(data.user));
      if (data.translations) {
        dispatch(setTranslationsTemp(data.translations));
      }
      navigate(from, { replace: true });
      dispatch(completeLoginTransition());
    } catch (err) {
      console.error(err);
      setError(err.message || 'Google Sign-In Failed');
    }
  };






  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({ email, password })).unwrap();

      const token = localStorage.getItem('token');
      if (!token) throw new Error("Token not found");

      // Fetch current user details
      const response = await CurrentUser(token);
      dispatch(setUser(response)); // Store user in Redux

      // Navigate to dashboard after setting user
      setTimeout(() => {
        navigate(from, { replace: true }); // ⬅️ Go to original path
        dispatch(completeLoginTransition()); // 🔄 Now safe to switch language
      }, 500);


    } catch (err) {
      console.error("lgon error", err)
      setError(t('invalid_credentials'));
    }
  };

  return (
    <div className="login-container">
      {/* Add the logo image here */}
      <div className="login-wrapper">
        <div className="login-image">
          <img
            src="../../img/RocketBPM_rocket_logo.png"
            alt="Logo"
            className="login-logo"
          />
        </div>
        <h2>{t('log_in_to_your_account')}</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('Email')}
            className="login-input"
          />
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">{t('sign_in')}</button>
          <p>{t('not_a_member')}<button className="btn_form" type='button' onClick={() => navigate('/signup-form')}>{t('sign_up')}</button></p>
          <button className="btn_form" type='button' onClick={() => navigate('/forgot-password')}>{t('forgot_your_password')}</button>
        </form>

        <div className="or-separator">
          <span className="line"></span>
          <span className="or-text">{t('or')}</span>
          <span className="line"></span>
        </div>

        <div className="google-login">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => {
              setError('Google Sign-In Failed');
            }}
          />
          {/* <p>Continue with Google</p> */}
        </div>

        <div className="microsoft-login">
          <button className="btn_form" type="button" onClick={handleMicrosoftLogin}>
            {t('continue_with_microsoft_365')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file for styling
import { loginUser, setUser } from '../../redux/userSlice';
import { CurrentUser, googleOAuth, microsoftOAuth } from '../../API/api';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname
  ? location.state.from.pathname + (location.state.from.search || '')
  : '/dashboard';
  

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }

    const code = params.get('code');
    if (code) {
      handleMicrosoftCallback(code);
    }

  }, []);
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const tokenId = credentialResponse.credential;

      const data = await googleOAuth(tokenId);
      console.log('response data', data);

      localStorage.setItem('token', data.access_token);
      dispatch(setUser(data.user));
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Google Sign-In Failed');
    }
  };

  



  const handleMicrosoftLogin = () => {
    const clientId = '9d104391-9870-4054-bf64-0edad7f38566';
    const tenantId = 'd2b5a349-bb86-4820-a3a5-41da5261d2b5';
    const redirectUri = window.location.origin; // http://localhost:3000 OR your live domain

    const authUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&response_mode=query&scope=openid profile email offline_access`;

    window.location.href = authUrl; // Redirect user to Microsoft login
  };

  const handleMicrosoftCallback = async (code) => {
    try {
      const data = await microsoftOAuth(code);
      localStorage.setItem('token', data.access_token);
      dispatch(setUser(data.user));
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError('Microsoft Sign-In Failed');
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
    }, 500);


    } catch (err) {
      setError('Invalid credentials');
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
      <h2>Log in to your account</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="login-input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="login-input"
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-button">SIGN IN</button>
        <p>Not a member?<button className="btn_form" type='button' onClick={()=> navigate('/SignupForm')}>Sign up</button></p>
        <button className="btn_form" type='button' onClick={()=> navigate('/forgotpassword')}>Forgot your password?</button>
      </form>
    
      <div className="or-separator">
          <span className="line"></span>
          <span className="or-text">OR</span>
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
            Continue with Microsoft 365
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

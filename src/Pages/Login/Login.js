import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file for styling
import { loginUser, setUser } from '../../redux/userSlice';
import { CurrentUser } from '../../API/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      navigate('/dashboard', { replace: true });
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
      </div>
    </div>
  );
};

export default Login;

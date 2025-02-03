import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Signup.css'; // Import the CSS file for styling
import { loginUser } from '../../redux/userSlice';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      navigate('/List-process-title'); // Redirect to home after successful login
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
        src="https://sp-ao.shortpixel.ai/client/to_auto,q_glossy,ret_img/https://newprocesslab.com/wp-content/uploads/2021/12/cropped-Logo_NewProcessLab_60x523-1-1.png" 
        alt="Logo" 
        className="login-logo"
      />
      </div>
      <h2>Join RocketBPM.com</h2>
      <form onSubmit={handleLogin} className="login-form">
      <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="First Name"
          className="login-input"
        />
         <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Last Name"
          className="login-input"
        />
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
        <p>Already a member?<button className="btn_form" type='button' onClick={()=> navigate('/login')}>Sign in</button></p>
      </form>
      </div>
    </div>
  );
};

export default Signup;

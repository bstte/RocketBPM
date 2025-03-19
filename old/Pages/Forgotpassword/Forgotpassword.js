import React from 'react';

import { useNavigate } from 'react-router-dom';
import './Forgotpassword.css'; // Import the CSS file for styling

const Forgotpassword = () => {
  const navigate = useNavigate();

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
      <h2>Forgot your password?</h2>
      <form className="login-form">  
        <input
          type="email"
          placeholder="Email"
          className="login-input"
        />
        <button type="submit" className="login-button">RESET</button>
        {/* <p>Not a member?<button className="btn_form" type='button' onClick={()=> navigate('/Account')}> Sign up</button></p> */}
        <p>Already a member?<button className="btn_form" type='button' onClick={()=> navigate('/login')}> Sign in</button></p>
      </form>
      </div>
    </div>
  );
};

export default Forgotpassword;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Forgotpassword.css';
import { forgotPassword } from '../../API/api';
import CustomAlert from '../../components/CustomAlert';
import { useTranslation } from '../../hooks/useTranslation';

const Forgotpassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const t = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const res = await forgotPassword(email);
      CustomAlert.success(t('success'), res.message);

    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-image">
          <img src="../../img/RocketBPM_rocket_logo.png" alt="Logo" className="login-logo" />
        </div>
        <h2>{t('forgot_your_password')}</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('Email')}
            className="login-input"
          />
          {message && <p style={{ color: 'green' }}>{message}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button type="submit" className="login-button">{t('reset')}</button>
          <p>
            {t('already_a_member')}
            <button className="btn_form" type="button" onClick={() => navigate('/login')}>
              {t('sign_in')}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Forgotpassword;

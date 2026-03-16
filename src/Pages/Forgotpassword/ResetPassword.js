import { FaEye, FaEyeSlash } from 'react-icons/fa'; // 👁️ Import eye icons
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { resetPassword } from '../../API/api';
import CustomAlert from '../../components/CustomAlert';
import { useTranslation } from '../../hooks/useTranslation';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const t = useTranslation();

  const token = new URLSearchParams(location.search).get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      CustomAlert.error("Error", t('all_fields_required'));
      return;
    }
    if (password !== confirmPassword) {
      CustomAlert.error("Error", t('passwords_do_not_match'));
      return;
    }

    try {
      const res = await resetPassword(token, password, confirmPassword);

      CustomAlert.success(t('success'), res.message);
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (err) {
      setError(err.message || t('something_went_wrong'));
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-image">
          <img src="../../img/RocketBPM_rocket_logo.png" alt="Logo" className="login-logo" />
        </div>
        <h2>{t('reset_password')}</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={t('new_password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="password-field">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder={t('confirm_password')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="login-input"
            />
            <span
              className="eye-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" className="login-button">{t('update_password')}</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

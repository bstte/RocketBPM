import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { checkEmail, saveAssingUserData } from '../../API/api';
import CustomAlert from '../../components/CustomAlert';
import CustomHeader from '../../components/CustomHeader';
import { useSelector } from 'react-redux';
import { useTranslation } from '../../hooks/useTranslation';

const AddUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { process } = location.state || {};

  const user = useSelector((state) => state.user.user); // Assuming user contains 'name', 'email', and 'type'
  const loggedInEmail = user?.email || '';

  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [assignId, setAssignId] = useState(null);
  const [isSelfEmail, setIsSelfEmail] = useState(false);
 const t = useTranslation();
  const typingTimeoutRef = useRef(null);

  const handlePermissionChange = (value) => {
    setPermission(value);
  };

  const checkEmailExistence = async (enteredEmail) => {
    // Self email check
    if (enteredEmail.toLowerCase() === loggedInEmail.toLowerCase()) {
      setEmailStatus('⚠️ You are logged in with this email. You cannot assign yourself.');
      setIsSelfEmail(true);
      setIsEmailValid(false);
      setAssignId(null);
      return;
    } else {
      setIsSelfEmail(false);
    }

    try {
      const response = await checkEmail(enteredEmail);
      if (response && response.exists !== undefined) {
        if (response.exists) {
          setEmailStatus('✅ Email Exists');
          setIsEmailValid(true);
          setAssignId(response.id);
        } else {
       setEmailStatus('❌ Email does not exist');
          setIsEmailValid(false);
          setAssignId(null);
        }
      } else {
       setEmailStatus('❌ Invalid response from server');
      }
    } catch (error) {
      console.error('Error checking email:', error);
      setEmailStatus('Error checking email');
    }
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newEmail) {
      setEmailStatus('');
      setIsEmailValid(false);
      setAssignId(null);
      return;
    }
    if (!emailRegex.test(newEmail)) {
      setEmailStatus('Email is invalid ❌');
      setIsEmailValid(false);
      setAssignId(null);
      return;
    }

    // Debounce logic
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      checkEmailExistence(newEmail);
    }, 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert('Please enter an email.');
      return;
    }
    if (!isEmailValid && emailStatus === 'Email does not exist ❌') {
      if (!firstName.trim() || !lastName.trim()) {
        alert('Please enter both first and last names.');
        return;
      }
    }
    if (!permission) {
      alert('Please select a permission.');
      return;
    }

    const newUserObject = {
      email,
      process_id: process?.id || null,
      user_id: process?.user_id || null,
      Role: permission,
      assign_id: assignId,
      first_name: isEmailValid ? null : firstName,
      last_name: isEmailValid ? null : lastName,
    };

    try {
      const response = await saveAssingUserData(newUserObject);
      CustomAlert.success('User Added', response.message);
      navigate(-1);
    } catch (error) {
      console.error('assign time error:', error);
    }
  };

  return (
    <div>
      <div className="ss_title_bar">
        <CustomHeader title={t('Add_User')} />
      </div>

      <div className="ss_body_div">
        <div className="ss_add_user_bx">
          <form onSubmit={handleSubmit}>
            <h3>{t('Add_User')}</h3>

            {/* Email Input */}
            <div style={{ marginBottom: '15px' }}>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder={t('enter_email')}
                required
                className="ss_add_eml_in"
              />
              {emailStatus && (
                <div style={{
                color: isSelfEmail ? 'orange' : isEmailValid ? '#002060' : '#ff364a',
                  marginTop: '5px'
                }}>
                  {emailStatus}
                </div>
              )}
            </div>

            {/* First & Last Name */}
            {!isEmailValid && emailStatus === '❌ Email does not exist' && (
              <>
                <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                  <label>{t('First_Name')}:</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder={t('enter_first_name')}
                    className="ss_add_eml_in"
                  />
                </div>
                <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                  <label>{t('Last_Name')}:</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder={t('enter_last_name')}
                    className="ss_add_eml_in"
                  />
                </div>
              </>
            )}

            {/* Permissions Dropdown */}
            <div style={{ marginBottom: '15px', textAlign: 'left' }}>
              <label>{t('permission')}:</label>
              <select
                id="permission"
                value={permission}
                onChange={(e) => handlePermissionChange(e.target.value)}
                className="ss_add_eml_in"
              >
                <option value="">-- {t('select_permission')} --</option>
                <option value="0">  {t('user')}</option>
                <option value="1">  {t('modeler')}</option>
                <option value="2">  {t('administrator')}</option>
              </select>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: "center" }}>
              <button
                type="button"
                className="ss_add_use_btn"
                onClick={() => navigate(-1)}
                style={{ backgroundColor: '#002060', cursor: 'pointer' }}
              >
               {t('Cancel')}
              </button>
              <button
                type="submit"
                className="ss_add_use_btn"
                disabled={isSelfEmail}
              >
               {t('Add_User')}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;

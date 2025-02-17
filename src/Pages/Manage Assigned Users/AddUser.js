import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { checkEmail, saveAssingUserData } from '../../API/api';
import CustomAlert from '../../components/CustomAlert';
import CustomHeader from '../../components/CustomHeader';

const AddUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { process } = location.state || {};

  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [assignId, setAssignId] = useState(null); // State to hold the user ID

  const handlePermissionChange = (value) => {
    setPermission(value);
  };

  const checkEmailExistence = async (email) => {
    try {
        const response = await checkEmail(email);
        console.log("response", response); // Check what the response actually is
        if (response && response.exists !== undefined) { // Ensure response is defined and has 'exists'
            if (response.exists) {
                setEmailStatus('Email exists ✔️');
                setIsEmailValid(true);
                setAssignId(response.id); // Save the user ID if the email exists
            } else {
                setEmailStatus('Email does not exist ❌');
                setIsEmailValid(false);
                setAssignId(null); // Reset ID if the email does not exist
            }
        } else {
            setEmailStatus('Invalid response from server ❌');
        }
    } catch (error) {
        console.error('Error checking email:', error);
        setEmailStatus('Error checking email');
    }
};


  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newEmail) {
      setEmailStatus('');
      setIsEmailValid(false);
      setAssignId(null);
    } else if (!emailRegex.test(newEmail)) {
      setEmailStatus('Email is invalid ❌');
      setIsEmailValid(false);
      setAssignId(null);
    } else {
      setEmailStatus(''); // Clear status message for valid format
      checkEmailExistence(newEmail); // Call API to check existence
    }
  };

  const handleSubmit = async(e) => {
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

    // Create object
    const newUserObject = {
      email:email,
      process_id: process?.id || null,
      user_id: process?.user_id || null,
      Role: permission,
      assign_id: assignId,
      first_name: isEmailValid ? null : firstName,
      last_name: isEmailValid ? null : lastName,
     
    };

    console.log('New User Object:', newUserObject);
    try{
        const response=await saveAssingUserData(newUserObject)
       
        CustomAlert.success("User Added", response.message);
        navigate(-1);

    }catch(error){
        console.error("assign time error:",error)
    }
  
  };

  return (
    <div>
            {/* header */}

          <div className="ss_title_bar"> <CustomHeader title="Add user" /></div>
{/* header */}

    <div className="ss_body_div">
      <div className="ss_add_user_bx">
      <div className="ss_add_user_img_dv1"><img src="https://newprocesslab.com/wp-content/uploads/2021/12/cropped-Logo_NewProcessLab_60x523-1-1.png" alt='no img'/></div>
      <form onSubmit={handleSubmit}>
        {/* Email Input */}
        <h3>Add User</h3>
        <div style={{ marginBottom: '15px' }}>
          {/* <label>Email:</label> */}
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter email"
            required className="ss_add_eml_in"
          />
          {emailStatus && (
            <div style={{ color: isEmailValid ? 'blue' : 'red', marginTop: '5px' }}>
              {emailStatus}
            </div>
          )}
        </div>

        {/* First Name Input (Enabled if email does not exist) */}
        {!isEmailValid && emailStatus === 'Email does not exist ❌' && (
          <div style={{ marginBottom: '15px' }}>
            <label>First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter first name"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
        )}

        {/* Last Name Input (Enabled if email does not exist) */}
        {!isEmailValid && emailStatus === 'Email does not exist ❌' && (
          <div style={{ marginBottom: '15px' }}>
            <label>Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter last name"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
        )}

        {/* Permissions Checkboxes */}
        <div className="ss_permision_mn_dv" style={{ marginBottom: '15px' }}>
          <label>Permission:</label>
          <div className="ss_label_per">
            {['User', 'Modeler'].map((role) => (
              <label key={role} style={{ display: 'block', marginTop: '5px' }}>
                <input
                  type="checkbox"
                  checked={permission === role}
                  onChange={() => handlePermissionChange(role)}
                />
                {role}
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit" className="ss_add_use_btn"
        >
          Submit
        </button>
      </form>
    </div>
    </div>
    </div>
  );
};

export default AddUser;

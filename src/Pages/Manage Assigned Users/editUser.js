import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomAlert from '../../components/CustomAlert';
import CustomHeader from '../../components/CustomHeader';
import { updateAssignedUserData } from '../../API/api';

const EditUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { assignedUsers } = location.state || {};

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [permission, setPermission] = useState('');

  useEffect(() => {
    if (assignedUsers) {
      console.log("assignedUsers",assignedUsers)
      setEmail(assignedUsers?.assigned_user?.email || '');
      setStatus(assignedUsers?.status || '');
      setPermission(assignedUsers?.Role || '');
    }
  }, [assignedUsers]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !status || !permission) {
      alert('Please fill in all fields.');
      return;
    }

    const updatedUser = {
      ProcessId: assignedUsers?.id,
      status: status,
      Role: permission,
    };

    console.log("updatedUser",updatedUser)
    try {
      const response = await updateAssignedUserData(updatedUser);
      CustomAlert.success("User Updated", response.message || "User details updated successfully.");
      navigate(-1);
    } catch (error) {
      console.error("Error updating user:", error);
      CustomAlert.error("Update Failed", "Something went wrong.");
    }
  };

  const handlePermissionChange = (value) => {
    setPermission(value);
  };

  return (
    <div>
      <div className="ss_title_bar">
        <CustomHeader title="Edit User" />
      </div>

      <div className="ss_body_div">
        <div className="ss_add_user_bx">
          <div className="ss_add_user_img_dv1">
            <img src="/img/RocketBPM_rocket_logo.png" alt="no img" style={{ width: "15vw" }} />
          </div>

          <form onSubmit={handleSubmit}>
            <h3>Edit User</h3>

            {/* Email */}
            <div style={{ marginBottom: '15px' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                readOnly
                className="ss_add_eml_in"
              />
            </div>

            {/* Status Dropdown */}
            <div style={{ marginBottom: '15px' }}>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option value="">Select status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Permission Checkboxes */}
            <div style={{ marginBottom: '15px', textAlign: 'left' }}>
              <label>Permission:</label>
              <select
                id="permission"
                value={permission}
                onChange={(e) => handlePermissionChange(e.target.value)}
                className="ss_add_eml_in"
              >
                <option value="">-- Select Permission --</option>
                <option value="User">User</option>
                <option value="Modeler">Modeler</option>
                <option value="Administrator">Administrator</option>
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
                CANCEL
              </button>
            <button type="submit" className="ss_add_use_btn">
              Update User
            </button>
             
            </div>
           
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;

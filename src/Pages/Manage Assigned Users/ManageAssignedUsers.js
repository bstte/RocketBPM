import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getProcessAssignUsers } from '../../API/api';
import CustomHeader from '../../components/CustomHeader';
import "./Manageuser.css"; 
const ManageAssignedUsers = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { process } = location.state || {};
  const [assignedUsers, setAssignedUsers] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getProcessAssignUsersData = async () => {
      try {
        // setIsLoading(true);
        const user_id = process?.user_id;
        const process_id = process?.id;
        const response = await getProcessAssignUsers(user_id, process_id);
        setAssignedUsers(response.assigned_users || []);
        console.log("response", response)
      } catch (error) {
        console.error('Something went wrong', error);
      } finally {
        // setTimeout(() => setIsLoading(false), 1500); // Animation ke liye thoda delay
      }
    };
    getProcessAssignUsersData();
  }, [process]);

  return (
    <div>
        {/* header */}
          <div className="ss_title_bar"> <CustomHeader title="User Management" /></div>
{/* header */}
      <div className="ss_mang_user_mn_dv">

        <button className="ss_add_user_btn" onClick={() => navigate("/Add-User", { state: { process: process } })}
        >
          Add User
        </button>

        <table border="1" cellPadding="10" cellSpacing="0" width="100%">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {assignedUsers.length > 0 ? (
              assignedUsers.map((user, index) => (
                <tr key={index}>
                  <td>{user.assigned_user?.first_name || 'N/A'}</td>
                  <td>{user.assigned_user?.last_name || 'N/A'}</td>
                  <td>{user.assigned_user?.email || 'N/A'}</td>
                  <td>{user?.Role || 'N/A'}</td>
                  <td>{user.assigned_user?.status || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '10px' }}>No Assigned Users Found</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="ss_table_btm_btn">
          <ul>
           <li> <button className="ss_add_user_btn">Cancel</button></li>
            <li><button className="ss_add_user_btn">Save</button></li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default ManageAssignedUsers;

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getProcessAssignUsers } from '../../API/api';
import CustomHeader from '../../components/CustomHeader';
import { FaEdit } from "react-icons/fa";

import "./Manageuser.css";
import { useTranslation } from '../../hooks/useTranslation';
const ManageAssignedUsers = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { process } = location.state || {};
  const [assignedUsers, setAssignedUsers] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  const t = useTranslation();

  
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
      <div className="ss_title_bar"> <CustomHeader title={t("User_Management")} /></div>
      {/* header */}
      <div className="ss_mang_user_mn_dv">

        <div className="ss_table_header">
          <h3></h3>
          <button className="ss_add_user_btn" onClick={() => navigate("/Add-User", { state: { process: process } })}>
            {t("Add_User")}
          </button>
        </div>

        <div className="ss_table_scroll">


          <table border="1" cellPadding="10" cellSpacing="0" width="100%">
            <thead style={{ position: "sticky", top: 0, background: "#fff",}}>
              <tr>
                <th>{t("First_Name")}</th>
                <th>{t("Last_Name")}</th>
                <th>{t("Email")}</th>
                <th>{t("Role")}</th>
                {/* <th>Status</th> */}

                <th>{t("User_Status")}</th>
                <th>{t("Process_Status")}</th>

                <th>{t("Action")}</th>

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
                    <td>{user?.status || 'N/A'}</td>

                    <td>

                      <button className="ss_add_user_btn" onClick={() => navigate("/edit-User", { state: { assignedUsers: user } })}
                      >
                        <FaEdit />

                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '10px' }}>{t("No_assigned_user_msg")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="ss_table_btm_btn">
          <ul>
            <li> <button className="ss_add_user_btn" onClick={() => navigate(-1)}>{t("CLOSE")}</button></li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default ManageAssignedUsers;

import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {  getProcessTitles } from '../../API/api';
// import {FaEdit } from 'react-icons/fa';
import CustomDrawer from '../../components/CustomDrawer';
import { useSelector } from 'react-redux';
// import Select from 'react-select';
import { BreadcrumbsContext } from '../../context/BreadcrumbsContext';

const ListProcessTitle = () => {
  const [processTitles, setProcessTitles] = useState([]);
  // const [AllTypeUsers, setAllTypeUsers] = useState([]);
  // const [selectedUsersMap, setSelectedUsersMap] = useState({});
  const [processAssignments, setProcessAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  const { addBreadcrumb, resetBreadcrumbs } = useContext(BreadcrumbsContext);

  useEffect(() => {

    // const addHomeBreadCrums = () => {
    //   const label = "Home"
    //   const path = '/List-process-title'

    //   const state = {

    //   };
    //   resetBreadcrumbs()

    //   addBreadcrumb(label, path, state);
    // }
    // Agar data pehle se loaded hai, toh loading ko true mat kijiye
    const fetchProcessTitles = async () => {
      try {
        if (processTitles.length === 0) setLoading(true); // Sirf pehli baar loading dikhaye

        const user_id = user && user.id;
        const response = await getProcessTitles(user_id);
        // setAllTypeUsers(response.UsersdData);
        setProcessTitles(response.data);
        setProcessAssignments(response.ProcessAssign);

        // const assignedUsersPromises = response.data.map(process =>
        //   fetchAssignedUsers(process.id)
        // );

        // const assignedUsersResponses = await Promise.all(assignedUsersPromises);
        // const assignmentsMap = assignedUsersResponses.reduce((acc, assignedUsers, index) => {
        //   const processId = response.data[index].id;
        //   acc[processId] = assignedUsers.map(user => user.assign_id);
        //   return acc;
        // }, {});

        // setSelectedUsersMap(assignmentsMap);
      } catch (error) {
        console.error('Error fetching process titles:', error);
        alert('Failed to fetch process titles.');
      } finally {
        setLoading(false);
      }
    };

    fetchProcessTitles();
    // addHomeBreadCrums();
  }, [user, resetBreadcrumbs, addBreadcrumb, processTitles.length]);


  const combineProcesses = () => {
    const combined = [];
    processTitles.forEach(process => {
      combined.push({
        ...process,
        assignedBy: null,
        assignment_user: null,
      });
    });

    processAssignments.forEach(assignment => {
      combined.push({
        ...assignment.process,
        assignedBy: assignment.user.email,
        assignment_user: assignment.user
      });
    });

    return combined;
  };

  // const handleUserSelect = async (processId, selectedOptions) => {
  //   const selectedUserIds = selectedOptions.map(option => option.value);
  //   setSelectedUsersMap(prevSelectedUsers => ({
  //     ...prevSelectedUsers,
  //     [processId]: selectedUserIds,
  //   }));

  //   try {
  //     await ProcessAssign(user.id, processId, selectedUserIds);
  //   } catch (error) {
  //     console.error('Error saving user assignments:', error);
  //   }
  // };

  // const userOptions = AllTypeUsers.map((user) => ({
  //   value: user.id,
  //   label: `${user.first_name} (${user.type})`,
  // }));

  return (
    <div style={styles.container}>
      <CustomDrawer title="List of All Process" />
      <div style={styles.content}>
        <div style={styles.header}>
          {user && user.type !== "User" ? (
            <button style={styles.addButton} onClick={() => navigate('/processes/create')}>
              Add Process
            </button>
          ) : null}
        </div>


        <div style={styles.tableContainer}>
          {loading && processTitles.length === 0 ? (
            <p>Loading...</p>
          ) : processTitles.length > 0 || processAssignments.length > 0 ? (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Process Title</th>
                  <th style={styles.th}>Created At</th>
                  <th style={styles.th}>Assigned By</th>
                  <th style={styles.th}></th>
                  {/* {user && user.type !== "User" ? (
                    <th style={styles.th}>Assign</th>
                  ) : null} */}
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {combineProcesses().map((process, index) => {
                  const currentUser = process.assignment_user ? process.assignment_user : user;
                  return (
                    <tr key={process.id} style={styles.tr}>
                      <td style={styles.td}>{index + 1}</td>
                      <td style={styles.td}>{process.process_title}</td>
                      <td style={styles.td}>{new Date(process.created_at).toLocaleString()}</td>
                      <td style={styles.td}>{process.assignedBy || 'Self'}</td>
                      <td style={styles.td}>
                        <button onClick={()=>navigate("/users",{state:{process:process}})}>
                          Managed users
                        </button>

                      </td>
                      {/* {user && user.type !== "User" ? (
                        <td style={styles.td}>
                          {!process.assignedBy && (
                            <Select
                              isMulti
                              options={userOptions}
                              value={userOptions.filter(option =>
                                (selectedUsersMap[process.id] || []).includes(option.value)
                              )}
                              onChange={(selectedOptions) => handleUserSelect(process.id, selectedOptions)}
                              placeholder="Select Users"
                              closeMenuOnSelect={false}
                            />
                          )}
                        </td>
                      ) : null} */}
                      <td style={styles.td}>

                        {user && user.type !== "User" ? (
                          <button onClick={() => navigate("/Map-level", { state: { id: process.id, title: process.process_title, user: currentUser } })} style={styles.PublishactionButton}>
                            Draft
                          </button>
                        ) : null}

                        <button onClick={() => navigate("/published-map-level", { state: { id: process.id, title: process.process_title, user: currentUser } })} style={styles.PublishactionButton}>

                          Published
                        </button>


                        <button onClick={() => navigate("/draft-process-view", { state: { id: process.id, title: process.process_title, user: currentUser } })} style={styles.PublishactionButton}>

                          View Draft
                        </button>


                        {/* <button onClick={() => navigate("/Testdraganddrop", { state: { id: process.id, title: process.process_title, user: currentUser } })} style={styles.PublishactionButton}>
                   
testdrag                     </button> */}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p>No process available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#f4f4f4',
    height: '100vh',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: '20px',
    marginTop: '50px',
  },
  title: {
    margin: 0,
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  tableContainer: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '15px',
    fontWeight: 'bold',
    borderBottom: '2px solid #ccc',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
  },
  tr: {
    borderBottom: '1px solid #ccc',
  },
  td: {
    padding: '15px',
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    marginRight: '10px',
  },
  PublishactionButton: {
    backgroundColor: '#4CAF50',  // Green background color
    color: 'white',              // White text
    border: 'none',              // No border
    borderRadius: '5px',         // Rounded corners
    padding: '10px 20px',        // Adequate padding
    fontSize: '16px',            // Slightly larger text for better readability
    fontWeight: 'bold',          // Make the text bold
    cursor: 'pointer',          // Pointer cursor on hover
    transition: 'background-color 0.3s, transform 0.2s', // Smooth transition for hover
    marginRight: '10px',
  },
  icon: {
    fontSize: '18px',
    color: '#007bff',
  },
};

export default ListProcessTitle;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { defaultApi, getProcessTitles, ProcessAssign } from '../../API/api';
import { FaEye, FaEdit } from 'react-icons/fa';
import CustomDrawer from '../../components/CustomDrawer';
import { useSelector } from 'react-redux';
import Select from 'react-select';

const ListProcessTitle = () => {
  const [processTitles, setProcessTitles] = useState([]);
  const [AllTypeUsers, setAllTypeUsers] = useState([]);
  const [selectedUsersMap, setSelectedUsersMap] = useState({});
  const [processAssignments, setProcessAssignments] = useState([]);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchProcessTitles = async () => {
      try {
        const user_id = user && user.id;
        const response = await getProcessTitles(user_id);
        console.log("before",response)
        setAllTypeUsers(response.UsersdData);
        setProcessTitles(response.data);
        setProcessAssignments(response.ProcessAssign);

        const assignedUsersPromises = response.data.map(process =>
          fetchAssignedUsers(process.id)
        );
       

        const assignedUsersResponses = await Promise.all(assignedUsersPromises);
        const assignmentsMap = assignedUsersResponses.reduce((acc, assignedUsers, index) => {
          const processId = response.data[index].id;
          acc[processId] = assignedUsers.map(user => user.assign_id);
          return acc;
        }, {});

        setSelectedUsersMap(assignmentsMap);
      } catch (error) {
        console.error('Error fetching process titles:', error);
        alert('Failed to fetch process titles.');
      }
    };

    fetchProcessTitles();
  }, [user]);

  const fetchAssignedUsers = async (processId) => {
    try {
      const response = await defaultApi.post('/get-assigned-users', { process_id: processId });
      console.log("after",response.data)
      return response.data.assigned_users;
    } catch (error) {
      console.error('Error fetching assigned users:', error);
      return []; // Return empty if error
    }
  };

  const combineProcesses = () => {
    const combined = [];

    processTitles.forEach(process => {
      combined.push({
        ...process,
        assignedBy: null, // No one assigned if self-created
      });
    });

    processAssignments.forEach(assignment => {
      combined.push({
        ...assignment.process,
        assignedBy: assignment.user.email, // Assigning user's name
      });
    });

    return combined;
  };

  const handleUserSelect = async (processId, selectedOptions) => {
    const selectedUserIds = selectedOptions.map(option => option.value);

    setSelectedUsersMap(prevSelectedUsers => ({
      ...prevSelectedUsers,
      [processId]: selectedUserIds,
    }));

    try {
      await ProcessAssign(user.id, processId, selectedUserIds);
    } catch (error) {
      console.error('Error saving user assignments:', error);
    }
  };

  const userOptions = AllTypeUsers.map((user) => ({
    value: user.id,
    label: `${user.name} (${user.type})`,
  }));

  return (
    <div style={styles.container}>
      <CustomDrawer title="List of All Process" />
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}></h1>
          <button style={styles.addButton} onClick={() => navigate('/Add-process-title')}>
            Add Process
          </button>
        </div>

        <div style={styles.tableContainer}>
          {processTitles.length > 0 || processAssignments.length > 0 ? (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Process Title</th>
                  <th style={styles.th}>Created At</th>
                  <th style={styles.th}>Assigned By</th> {/* New column for Assigned By */}
                  <th style={styles.th}>Assign</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {combineProcesses().map((process, index) => (
                  <tr key={process.id} style={styles.tr}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>{process.process_title}</td>
                    <td style={styles.td}>{new Date(process.created_at).toLocaleString()}</td>
                    <td style={styles.td}>{process.assignedBy || 'Self'}</td> {/* Show assigned user or 'Self' */}
                    <td style={styles.td}>
                      {!(process.assignedBy) ? ( // Check if assignedBy is 'Self'
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
                      ) : null} {/* Render dropdown only if assignedBy is 'Self' */}
                    </td>
                    <td style={styles.td}>
                      <button onClick={() => navigate("/Map_level", { state: { id: process.id, title: process.process_title, Editable: false } })} style={styles.actionButton}>
                        <FaEye style={styles.icon} />
                      </button>
                      <button onClick={() => navigate("/Map_level", { state: { id: process.id, title: process.process_title, Editable: true } })} style={styles.actionButton}>
                        <FaEdit style={styles.icon} />
                      </button>
                    </td>
                  </tr>
                ))}
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
    justifyContent: 'space-between',
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
  icon: {
    fontSize: '18px',
    color: '#007bff',
  },
};

export default ListProcessTitle;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProcessTitle } from '../../API/api';
import CustomHeader from '../../components/CustomHeader';
import { useSelector } from 'react-redux';

const ProcessTitle = () => {
  const [title, setTitle] = useState(''); // State to hold process title
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);


 

  const handleNext = async () => {
    if (title.trim()) {
      try {
        // Call API to save process title
       const user_id=user && user.id;
       const response= await saveProcessTitle(title,user_id);
      
       navigate("/Map_level",{ state: {id:response.data.id,title:response.data.process_title,Editable:true }})
       

 
      } catch (error) {
        alert('Error saving process title');
      }
    } else {
      alert('Please enter a process title');
    }
  };

  return (
    <div style={styles.container}>
            <CustomHeader title="Add Process Title" />
      <h1 style={styles.heading}>Process Title</h1>
      
      {/* Input for process title */}
      <input
        type="text"
        placeholder="Type process title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={styles.input}
      />

      {/* Next button */}
      <button onClick={handleNext} style={styles.button}>
        Next
      </button>
    </div>
  );
};

// Simple inline styles for the page
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f4'
  },
  heading: {
    marginBottom: '20px',
    fontSize: '24px'
  },
  input: {
    padding: '10px',
    width: '300px',
    marginBottom: '20px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  }
};

export default ProcessTitle;

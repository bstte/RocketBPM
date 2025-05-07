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
     
       const user_id=user && user.id;
       const response= await saveProcessTitle(title,user_id);
      
       navigate("/Map-level",{replace: true,state: {id:response.data.id,title:response.data.process_title,user:user }})
       

 
      } catch (error) {
        alert('Error saving process title');
      }
    } else {
      alert('Please enter a process title');
    }
  };

  return (
    <div>
              <div className="ss_title_bar"> <CustomHeader title="Add Process Title" /></div>

              <div className="ss_body_div ss_add_title">
      <div className="ss_add_user_bx">
      <div className="ss_add_user_img_dv1"><img src="/img/RocketBPM_rocket_logo.png" alt=''/></div>
     
      <h1>Process Title</h1>

      <input
        type="text"
        placeholder="Type process title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={styles.input}
      />

      {/* Next button */}
      <button onClick={handleNext}>
        Next
      </button>
      </div>
      </div>
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
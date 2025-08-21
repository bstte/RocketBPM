import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProcessTitle } from '../../API/api';
import CustomHeader from '../../components/CustomHeader';
import { useSelector } from 'react-redux';
import { useTranslation } from "../../hooks/useTranslation";

const ProcessTitle = () => {
  const [title, setTitle] = useState(''); // State to hold process title
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const t = useTranslation();




  const handleNext = async () => {
    if (title.trim()) {
      try {

        const user_id = user && user.id;
        const response = await saveProcessTitle(title, user_id);
        navigate(
          `/map-level/${response.data.id}?title=${encodeURIComponent(response.data.process_title || "")}&user=${encodeURIComponent(JSON.stringify(user))}`,
          { replace: true }
        );

      } catch (error) {
        alert('Error saving process title');
      }
    } else {
      alert('Please enter a process title');
    }
  };

  return (
    <div>
      <div className="ss_title_bar"> <CustomHeader title={t('Add_process_world')} /></div>

      <div className="ss_body_div ss_add_title">
        <div className="ss_add_user_bx">
          <div className="ss_add_user_img_dv1"><img src="/img/RocketBPM_rocket_logo.png" alt='' /></div>

          <h1>  {t('name_of_new_process_world	')}</h1>

          <input
            type="text"
            placeholder={t('type_process_world_name')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />

          {/* Next button */}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: "center" }}>
            <button
              onClick={handleNext}
              className="ss_add_use_btn"

            >
              {t('add')}
            </button>
            <button
              type="button"
              className="ss_add_use_btn"
              onClick={() => navigate(-1)}
              style={{ backgroundColor: '#002060', cursor: 'pointer' }}
            >
              {t('Cancel')}

            </button>
          </div>

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
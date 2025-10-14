import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProcessTitle } from '../../API/api';
import CustomHeader from '../../components/CustomHeader';
import { useSelector } from 'react-redux';
import { useTranslation } from "../../hooks/useTranslation";
import { useLanguages } from '../../hooks/useLanguages';

const ProcessTitle = () => {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const t = useTranslation();
  const { languages } = useLanguages();

  // New states
  const [supportedLanguages, setSupportedLanguages] = useState([]); // multiple
  const [defaultLanguage, setDefaultLanguage] = useState('');

  const handleLanguageToggle = (langId) => {
    setSupportedLanguages((prev) =>
      prev.includes(langId)
        ? prev.filter((id) => id !== langId)
        : [...prev, langId]
    );
  };

  const handleNext = async () => {
    if (!title.trim()) {
      alert('Please enter a process title');
      return;
    }

    if (supportedLanguages.length === 0) {
      alert('Please select at least one supported language');
      return;
    }

    if (!defaultLanguage) {
      alert('Please select a default language');
      return;
    }

    try {
      const user_id = user && user.id;
      const response = await saveProcessTitle(title, user_id, defaultLanguage, supportedLanguages);

      navigate(`/map-level/${response.data.id}`, { replace: true });
    } catch (error) {
      alert('Error saving process title');
    }
  };

  return (
    <div>
      <div className="ss_title_bar">
        <CustomHeader title={t('Add_process_world')} />
      </div>

      <div className="ss_body_div ss_add_title">
        <div className="ss_add_user_bx">
          <div className="ss_add_user_img_dv1">
            <img
              src="/img/RocketBPM_rocket_logo.png"
              alt=""
              style={{ width: '15vw' }}
            />
          </div>

          <h1>{t('name_of_new_process_world')}</h1>

          {/* Process Title */}
          <input
            type="text"
            placeholder={t('type_process_world_name')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />

          {/* Supported Languages */}
          <div style={styles.sectionBox}>
             <h1>{t('Supported_Languages')}</h1>
            <h3 style={styles.sectionTitle}></h3>
            <div style={styles.languageList}>
              {languages &&
                languages.map((lang) => (
                  <label key={lang.id} style={styles.languageItem}>
                    <input
                      type="checkbox"
                      checked={supportedLanguages.includes(lang.id)}
                      onChange={() => handleLanguageToggle(lang.id)}
                    />
                    <span style={{ marginLeft: 8 }}>{lang.name}</span>
                  </label>
                ))}
            </div>
          </div>

          {/* Default Language */}
          <div style={styles.sectionBox}>
                  <h1>{t('Default_Language')}</h1>
            <h3 style={styles.sectionTitle}></h3>
            <select
              className="login-input"
              value={defaultLanguage}
              onChange={(e) => setDefaultLanguage(e.target.value)}
              style={styles.selectBox}
              disabled={supportedLanguages.length === 0}
            >
              <option value="">Select Default Language</option>
              {languages &&
                languages
                  .filter((lang) => supportedLanguages.includes(lang.id))
                  .map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.name}
                    </option>
                  ))}
            </select>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              type="button"
              className="ss_add_use_btn"
              onClick={() => navigate(-1)}
              style={{ backgroundColor: '#002060', cursor: 'pointer' }}
            >
              {t('Cancel')}
            </button>
            <button onClick={handleNext} className="ss_add_use_btn">
              {t('add')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const styles = {
  input: {
    padding: '10px',
    width: '300px',
    marginBottom: '25px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  sectionBox: {
    marginBottom: '25px',
    borderRadius: '10px',
    padding: '15px 20px',
    width: '350px',
    textAlign: 'left',
  },
  sectionTitle: {
    marginBottom: '10px',
    color: '#002060',
  },
  languageList: {
    display: 'flex',
    flexDirection: 'row',
    gap: '8px',
  },
  languageItem: {
    display: 'flex',
    alignItems: 'center',
  },
  selectBox: {
    width: '100%',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '15px',
  },
};

export default ProcessTitle;

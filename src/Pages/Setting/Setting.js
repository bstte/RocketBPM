import { useEffect, useRef, useState } from "react";
import CustomHeader from "../../components/CustomHeader";
import "./Setting.css";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getProcessTitleById,
  updateProcess,
  ImageBaseUrl,
  deleteProcess,
  removeProcessImage,
} from "../../API/api";
import CustomAlert from "../../components/CustomAlert";
import { useTranslation } from "../../hooks/useTranslation";
import { useLanguages } from "../../hooks/useLanguages";
import TranslationPopup from "../../hooks/TranslationPopup";
import { useLangMap } from "../../hooks/useLangMap";

const Setting = () => {
  const location = useLocation();
  const { ProcessId } = location.state || {};
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const t = useTranslation();
  const { languages } = useLanguages();
  const [showTranslationPopup, setShowTranslationPopup] = useState(false);
  const [translationDefaults, setTranslationDefaults] = useState();
  const langMap = useLangMap();
  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const [defaultLanguage, setDefaultLanguage] = useState("");

  const [processData, setProcessData] = useState({
    process_title: "",
    Process_img: null,
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch process data by ID
  useEffect(() => {
    const fetchProcessData = async () => {
      if (!ProcessId) return;
      try {
        setLoading(true);

        const response = await getProcessTitleById(ProcessId);
        if (response.data) {
          setSupportedLanguages(response.data.supportedLanguages);
          setDefaultLanguage(response.data.language_id || "");
          setTranslationDefaults(response.data.translations || "");

          setProcessData(response.data);
        }
      } catch (error) {
        console.error("Error fetching process data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProcessData();
  }, [ProcessId]);
 
  // Handle image selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        setSelectedImage(img.src);
      };
    }
  };

  // Delete Process Function
  const handleDeleteProcess = async () => {
    const confirmDelete = window.confirm(
      "Are you sure? This process will be removed from all assigned locations."
    );

    if (!confirmDelete) return;

    try {
      await deleteProcess(ProcessId);
      alert("Process deleted successfully!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Error deleting process:", error);
      alert("Failed to delete the process. Please try again.");
    }
  };

  const updateProcessdata = async () => {
    const formData = new FormData();
    formData.append("process_title", processData.process_title);
    formData.append("language_id", defaultLanguage);
    formData.append("supportedLanguages", JSON.stringify(supportedLanguages));
    formData.append(
      "translations",
      JSON.stringify(processData.translations || {})
    );

    if (selectedImage) {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      formData.append(
        "Process_img",
        new File([blob], "profile.jpg", { type: "image/jpeg" })
      );
    }


    try {
      await updateProcess(ProcessId, formData); // Pass ProcessId as a parameter
      alert("Process updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating process:", error);
      alert("Failed to update the process. Please try again.");
    }
  };

  const handleRemoveImage = async () => {
    CustomAlert.confirm(
      "Remove Profile Image",
      "Are you sure you want to remove your profile image?",
      async () => {
        if (selectedImage) {
          setSelectedImage(null);
        } else {
          const token = localStorage.getItem("token");
          if (!token) {
            alert("User not authenticated! Please login.");
            return;
          }

          try {
            const response = await removeProcessImage(token, ProcessId);
            const data = response.data; // Fix here

            if (response.status === 200) {
              // Check status code
              alert("Process image removed successfully!");
              setProcessData((prev) => ({ ...prev, Process_img: null }));
            } else {
              alert(data.message || "Failed to remove Process image.");
            }
          } catch (error) {
            console.error("Error removing Process image:", error);
            alert("Something went wrong. Please try again.");
          }
        }
      }
    );
  };
  const handleOpenTranslation = () => {
    // Generate translation defaults for all supported languages
    const defaults = supportedLanguages.reduce((acc, langId) => {
      const langKey = langMap[langId] || `lang_${langId}`;
      acc[langKey] =
        processData.translations?.[langKey] ||
        (langId === parseInt(defaultLanguage) ? processData.process_title : "");
      return acc;
    }, {});

    setTranslationDefaults(defaults);
    setShowTranslationPopup(true);
  };

  return (
    <div>
      <div className="ss_title_bar">
        <CustomHeader title={t("Settings")} />
      </div>

      <div className="ss_sett_page_mn_div">
        <div className="ss_sett_lft_div">
          <h4>{t("Edit_Properties")}</h4>
          <div className="ss_logo_lft_div">
            {loading ? (
              <p>Loading...</p>
            ) : selectedImage ? (
              <img
                src={selectedImage}
                alt="Selected"
                className="profile-image"
              />
            ) : processData.Process_img ? (
              <img
                src={`${ImageBaseUrl}/${processData.Process_img}`}
                alt="Process"
                className="profile-image"
              />
            ) : (
              <label>{t("No_Image")}</label>
            )}
          </div>

          <div className="ss_recheigh">
            <p>{t("Recommended_height")}</p>
            <ul>
              <li>
                <button onClick={() => fileInputRef.current.click()}>
                  {t("UPDATE")}
                </button>
              </li>
              <li>
                <button onClick={handleRemoveImage}>{t("REMOVE")}</button>
              </li>
            </ul>
          </div>

          <div className="ss_sett_input_sec">
            <ul>
              <li>
                <input
                  type="text"
                  name="process_title"
                  placeholder="Name of Process World"
                  value={processData.process_title}
                  onChange={(e) => {
                    const newTitle = e.target.value;

                    setProcessData((prev) => {
                      // Determine default language key
                      const langKey =
                        langMap[prev.language_id || defaultLanguage] || "en";

                      // Copy existing translations or empty object
                      const updatedTranslations = {
                        ...(prev.translations || {}),
                      };

                      // Update the default language translation
                      updatedTranslations[langKey] = newTitle;

                      return {
                        ...prev,
                        process_title: newTitle,
                        translations: updatedTranslations,
                      };
                    });
                  }}
                />
              </li>
              <li>
                <button
                  type="button"
                  className="ss_add_user_btn"
                  style={{ backgroundColor: "#4CAF50", padding: "6px 12px" }}
                  onClick={() => handleOpenTranslation()}
                >
                  {t("translation")}
                </button>
              </li>
              <li>{t("Max_35_characters")}</li>
            </ul>
          </div>
          {/* Supported Languages */}
          <div style={styles.sectionBox}>
            <h4>{t("Supported_Languages")}</h4>
            <div style={styles.languageList} className="mt-1">
              {languages &&
                languages.map((lang) => (
                  <label key={lang.id} style={styles.languageItem}>
                    <input
                      type="checkbox"
                      checked={supportedLanguages.includes(lang.id)}
                      onChange={() =>
                        setSupportedLanguages((prev) =>
                          prev.includes(lang.id)
                            ? prev.filter((id) => id !== lang.id)
                            : [...prev, lang.id]
                        )
                      }
                    />
                    <span style={{ marginLeft: 8 }}>{lang.name}</span>
                  </label>
                ))}
            </div>
          </div>

          {/* Default Language */}
          <div style={styles.sectionBox}>
            <h4>{t("Default_Language")}</h4>
            <select
              value={defaultLanguage}
              onChange={(e) => setDefaultLanguage(e.target.value)}
              className="select_field"
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
        </div>

        <div className="ss_sett_delete">
          <h4>{t("Delete_Process_World")}</h4>
          <p>{t("Be_careful_delete_msg")}</p>
          <button onClick={handleDeleteProcess}>{t("Delete")}</button>
        </div>

        <div className="ss_table_btm_btn">
          <ul>
            <li>
              <button className="ss_add_user_btn" onClick={() => navigate(-1)}>
                {t("Cancel")}
              </button>
            </li>
            <li>
              <button className="ss_add_user_btn" onClick={updateProcessdata}>
                {t("Save")}
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleImageChange}
        accept="image/*"
      />

      <TranslationPopup
        isOpen={showTranslationPopup}
        onClose={() => setShowTranslationPopup(false)}
        defaultValues={translationDefaults}
        onSubmit={(values) => {
          // console.log("Updated Translations:", values);

          // Update local state with translated values
          setProcessData((prev) => ({
            ...prev,
            translations: values,
          }));

          setShowTranslationPopup(false);
        }}
        supportedLanguages={supportedLanguages}
        defaultLanguage={defaultLanguage}
      />
    </div>
  );
};

export default Setting;

const styles = {
  sectionBox: {
    // padding: '15px 20px',
  },
  languageList: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "10px",
  },
  languageItem: {
    display: "flex",
    alignItems: "center",
  },
  selectBox: {
    width: "100%",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "15px",
    marginTop: "10px",
  },
};

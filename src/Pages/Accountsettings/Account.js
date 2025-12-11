import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Account.css";
import CustomHeader from "../../components/CustomHeader";
import {
  deactivateUser,
  getLanguages,
  ImageBaseUrl,
  removeProfileImgage,
  updateprofile,
} from "../../API/api";
import CustomAlert from "../../components/CustomAlert";
import { useNavigate } from "react-router-dom";
import { setTranslations, setUser } from "../../redux/userSlice";
import { useTranslation } from "../../hooks/useTranslation";
import { useLanguages } from "../../hooks/useLanguages";

const Account = () => {
  const user = useSelector((state) => state.user.user);
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const { languages } = useLanguages(); // 👈 Custom hook use
  const [selectedLanguageId, setSelectedLanguageId] = useState(
    user?.language_id || ""
  );

  const [Profile_link, setProfile_link] = useState(user?.Profile_link || "");
  const dispatch = useDispatch();
  const t = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);

  // Password State 🆕
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");

  const navigate = useNavigate();

  // Reference for file input
  const fileInputRef = useRef(null);

  // Function to handle image selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        // if (img.width === 300 && img.height === 300) {
        setSelectedImage(img.src);
        // } else {
        // alert("Image must be 300 x 300 pixels");
        // }
      };
    }
  };

  // Function to remove selected image

  const deactivateUserFunction = async () => {
    CustomAlert.confirm(
      "Deactivate Account",
      "Are you sure you want to deactivate your account?",
      async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Token not found! Please login again.");
          return;
        }
        try {
          const response = await deactivateUser(token);
          alert("Your account has been deactivated.");
          localStorage.removeItem("token"); // Clear invalid token
          navigate("/login"); // Redirect to login page
        } catch (error) {
          console.log("Deactivate user error:", error);
          alert("Failed to deactivate account. Please try again.");
        }
      }
    );
  };

  const updateProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("User not authenticated! Please login.");
      return;
    }
    if (currentPassword && newPassword && currentPassword === newPassword) {
      CustomAlert.warning(
        "Warning",
        "New password cannot be the same as current password."
      );
      return;
    }

    if (newPassword && newPassword !== repeatNewPassword) {
      CustomAlert.warning("Warning", "New passwords do not match.");
      return;
    }

    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("Profile_link", Profile_link);
    formData.append("language_id", selectedLanguageId);

    formData.append("email", email);

    if (currentPassword) {
      formData.append("current_password", currentPassword);
      formData.append("new_password", newPassword);
      formData.append("confirmed", repeatNewPassword);
    }

    if (selectedImage) {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      formData.append(
        "profile_image",
        new File([blob], "profile.jpg", { type: "image/jpeg" })
      );
    }

    try {
      const response = await updateprofile(token, formData); // ✅ Pass formData
      // alert("Profile updated successfully!");
      CustomAlert.success("Success", "Profile updated successfully!");

      dispatch(setUser(response.user));
      dispatch(setTranslations(response.translations)); // ✅ agar helper bana ho toh

      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);

      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.data?.message ||
        "Failed to update profile. Please try again.";

      CustomAlert.warning("Warning", backendMessage);
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
            const response = await removeProfileImgage(token);
            const data = response.data; // Fix here

            if (response.status === 200) {
              // Check status code
              alert("Profile image removed successfully!");
              setSelectedImage(null); // Update UI
              dispatch(setUser({ ...user, Profile_image: null })); // Update Redux state
            } else {
              alert(data.message || "Failed to remove profile image.");
            }
          } catch (error) {
            console.error("Error removing profile image:", error);
            alert("Something went wrong. Please try again.");
          }
        }
      }
    );
  };

  return (
    <div>
      <div className="ss_title_bar">
        {" "}
        <CustomHeader title={t("account_setting")} />
      </div>

      <div className="account-container" style={{ marginTop: "50px" }}>
        <div className="account_header">
          <div className="account_main_wrapper">
            <div className="account_Edit_heading">
              <h2>{t("Edit_Profile")}</h2>

              <div className="account_Edit_user">
                <div className="account_Edit_user_wrapper">
                  <div className="account_Edit_user_icon">
                    {selectedImage ? (
                      <img
                        src={selectedImage}
                        alt="Profile"
                        className="profile-image"
                      />
                    ) : user?.profile_image ? (
                      <img
                        src={
                          user?.profile_image.startsWith("http")
                            ? user.profile_image // ✅ Google ka full URL
                            : `${ImageBaseUrl}uploads/profile_images/${user.profile_image}` // ✅ Local image
                        }
                        alt="Profile"
                        className="profile-image"
                      />
                    ) : (
                      <img src="/img/user-circle-solid.svg" alt="User" />
                    )}
                  </div>

                  <div className="account_Edit_detail">
                    <h2>{t("Recommended_size")}</h2>
                    <div className="account_Edit_buttons">
                      <button
                        type="button"
                        className="button_account"
                        onClick={() => fileInputRef.current.click()}
                      >
                        {t("UPDATE")}
                      </button>
                      <button
                        type="button"
                        className="button_account"
                        onClick={handleRemoveImage}
                      >
                        {t("REMOVE")}
                      </button>
                    </div>
                  </div>
                </div>
                <form className="login-form">
                  <div className="first_and_last">
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name"
                      className="login-input"
                    />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name"
                      className="login-input"
                    />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="login-input"
                  />

                  <select
                    className="login-input"
                    value={selectedLanguageId}
                    onChange={(e) => setSelectedLanguageId(e.target.value)}
                  >
                    <option value="">{t("select_language")}</option>
                    {languages &&
                      languages.map((lang) => (
                        <option key={lang.id} value={lang.id}>
                          {lang.name}
                        </option>
                      ))}
                  </select>
                  <input
                    type="text"
                    value={Profile_link}
                    onChange={(e) => setProfile_link(e.target.value)}
                    placeholder="Link to LinkedIn Profile"
                    className="login-input"
                  />
                </form>
              </div>
            </div>

            <div className="account_header_right">
              <h2>{t("change_password")}</h2>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder={t("current_password")}
                className="login-input current_password"
              />
              <div className="account_change_pass">
                <input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type="password"
                  placeholder={t("new_password")}
                  className="login-input"
                />

                <input
                  value={repeatNewPassword}
                  onChange={(e) => setRepeatNewPassword(e.target.value)}
                  type="password"
                  placeholder={t("repeat_new_password")}
                  className="login-input"
                />
              </div>
              <div className="account_pass_change">
                <h2>{t("deactivate_account")}</h2>
                <p>
                  {t(
                    "be_careful_deactivating_your_account_might_lead_to_losing_access_to_processes_if_no_other_admin_is_defined"
                  )}
                </p>
                <button
                  type="button"
                  className="account_pass_deactivate"
                  onClick={deactivateUserFunction}
                >
                  {t("deactivate")}
                </button>
              </div>
            </div>
          </div>

          <div className="account_Edit_buttons_CANCEL">
            <button
              type="button"
              className="button_account"
              onClick={() => navigate(-1)}
            >
              {t("Cancel")}
            </button>
            <button
              type="button"
              className="button_account"
              onClick={updateProfile}
            >
              {t("Save")}
            </button>
          </div>
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
    </div>
  );
};

export default Account;

import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Account.css';
import CustomHeader from '../../components/CustomHeader';
import { deactivateUser, ImageBaseUrl, updateprofile } from '../../API/api'
import CustomAlert from '../../components/CustomAlert';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../redux/userSlice';

const Account = () => {
    const user = useSelector((state) => state.user.user);
    const [firstName, setFirstName] = useState(user?.first_name || "");
    const [lastName, setLastName] = useState(user?.last_name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [Profile_link, setProfile_link] = useState(user?.Profile_link || "");
    const dispatch = useDispatch();

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
                if (img.width === 300 && img.height === 300) {
                    setSelectedImage(img.src);
                } else {
                    alert("Image must be 300 x 300 pixels");
                }
            };
        }
    };


    // Function to remove selected image
    const handleRemoveImage = () => {
        setSelectedImage(null);
        
    };

    const deactivateUserFunction = async () => {
        CustomAlert.confirm(
            "Deactivate Account",
            "Are you sure you want to deactivate your account?",
            async () => {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert("Token not found! Please login again.");
                    return;
                }
                try {
                    console.log(token)
                    const response = await deactivateUser(token);
                    console.log("Response:", response);
                    alert("Your account has been deactivated.");
                    localStorage.removeItem('token'); // Clear invalid token
                    navigate('/login'); // Redirect to login page

                } catch (error) {
                    console.log("Deactivate user error:", error);
                    alert("Failed to deactivate account. Please try again.");
                }
            }
        );
    };

    const updateProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("User not authenticated! Please login.");
            return;
        }

        if (newPassword && newPassword !== repeatNewPassword) {
            alert("New passwords do not match.");
            return;
        }

        const formData = new FormData();
        formData.append("first_name", firstName);
        formData.append("last_name", lastName);
        formData.append("Profile_link", Profile_link);
        formData.append("email", email);

        if (currentPassword) {
            formData.append("current_password", currentPassword);
            formData.append("new_password", newPassword);
            formData.append("confirmed", repeatNewPassword);
        }

        if (selectedImage) {
            const response = await fetch(selectedImage);
            const blob = await response.blob();
            formData.append("profile_image", new File([blob], "profile.jpg", { type: "image/jpeg" }));
        }

        try {
            const response = await updateprofile(token, formData); // ✅ Pass formData
            console.log("Profile updated:", response);
            alert("Profile updated successfully!");
            dispatch(setUser(response.user));

        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        }
    };


    return (
        <div>
            <div className="ss_title_bar"> <CustomHeader title="Account Setting" /></div>

            <div className="account-container" style={{ marginTop: "50px" }}>
               

                <div className="account_header">
                    <div className="account_main_wrapper">
                        <div className="account_Edit_heading">
                            <h2>Edit Profile</h2>

                            <div className="account_Edit_user">
                                <div className="account_Edit_user_wrapper">
                                    <div className="account_Edit_user_icon" onClick={() => fileInputRef.current.click()}>
                                        {selectedImage ? (
                                            <img src={selectedImage} alt="Profile" className="profile-image" />
                                        ) : user?.Profile_image ? (
                                            <img src={`${ImageBaseUrl}uploads/profile_images/${user?.Profile_image}`} alt="Profile" className="profile-image" />
                                        ) : (
                                            <svg className="login-logo" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                                                <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Z" />
                                            </svg>
                                        )}

                                    </div>

                                    <div className="account_Edit_detail">
                                        <h2>Recommended size: 300 x 300 pixels</h2>
                                        <div className="account_Edit_buttons">
                                            <button type="button" className="button_account">UPDATE</button>
                                            <button type="button" className="button_account" onClick={handleRemoveImage}>REMOVE</button>
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
                            <h2>Change Password</h2>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Current Password"
                                className="login-input current_password"

                            />
                            <div className="account_change_pass">
                                <input
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    type="password" placeholder="New Password" className="login-input" />


                                <input
                                    value={repeatNewPassword}
                                    onChange={(e) => setRepeatNewPassword(e.target.value)}
                                    type="password" placeholder="Repeat New Password" className="login-input" />
                            </div>
                            <div className="account_pass_change">
                                <h2>Deactivate Account</h2>
                                <p>Be careful. Deactivating your account might lead to losing access to processes, if no other admin is defined.</p>
                                <button type="button" className="account_pass_deactivate" onClick={deactivateUserFunction}>DEACTIVATE</button>
                            </div>
                        </div>
                    </div>

                    <div className="account_Edit_buttons_CANCEL">
                        <button type="button" className="button_account" onClick={() => window.location.reload()}>CANCEL</button>
                        <button type="button" className="button_account" onClick={updateProfile}>SAVE</button>
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

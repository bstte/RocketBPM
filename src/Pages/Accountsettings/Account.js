import React from 'react';

import './Account.css';
const Account = () => {

    // const dispatch = useDispatch();
    // const navigate = useNavigate();



    return (

        <div className="account-container">
            <div className="account_wrapper">
                <svg className="login-logo" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="undefined"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" /></svg>
                <h2>Account Settings</h2>
            </div>
            <div class="account_header">
                <div className="account_main_wrapper">
                    <div className="account_Edit_heading">
                        <h2>Edit Profile</h2>

                        <div className="account_Edit_user">
                            <div className="account_Edit_user_wrapper">
                                <div className="account_Edit_user_icon">
                                    <svg className="login-logo" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="undefined"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" /></svg>
                                </div>
                                <div className="account_Edit_detail">
                                    <h2>Recommended size: 300 x 300 pixel</h2>
                                    <div className="account_Edit_buttons">
                                        <button type='button' className="button_account">UPDATE</button>
                                        <button type='button' className="button_account">REMOVE</button>
                                    </div>
                                </div>
                            </div>
                            <form className="login-form">
                                <div class="first_and_last">
                                    <input
                                        type="text"
                                        value=""
                                        placeholder="First Name"
                                        className="login-input"
                                    />
                                    <input
                                        type="text"
                                        value=""
                                        placeholder="Last Name"
                                        className="login-input"
                                    />
                                </div>
                                <input
                                    type="email"
                                    value=""
                                    placeholder="Email"
                                    className="login-input"
                                />
                                <input
                                    type="text"
                                    value=""
                                    placeholder="Link to LinkedIn Profile"
                                    className="login-input"
                                />
                            </form>
                        </div>
                    </div>

                    <div class="account_header_right">
                        <h2>Change Password</h2>
                        <input
                            type="password"
                            value=""
                            placeholder="Current Password"
                            className="login-input current_password"
                        />
                        <div class="account_change_pass">
                            <input
                                type="password"
                                value=""
                                placeholder="New Password"
                                className="login-input"
                            />
                            <input
                                type="password"
                                value=""
                                placeholder="Repeat New Password"
                                className="login-input"
                            />
                        </div>
                        <div class="account_pass_change">
                            <h2>Deactivate Account</h2>
                            <p>Be careful. Deactivating your account might lead to loosing access to
                                processes, if no other admin is defined.</p>
                            <button type='button' class="account_pass_deactivate">DEACTIVATE</button>
                        </div>
                    </div>

                </div>
                <div className="account_Edit_buttons_CANCEL">
                    <button type='button' className="button_account">CANCEL</button>
                    <button type='button' className="button_account">SAVE</button>
                </div>
            </div>
        </div>

    );
};

export default Account;

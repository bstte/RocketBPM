import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import DateTimePickerModal from "./DateTimePickerModal";
import { toLocalISO } from "../helpers/dateHelper";
import { ImageBaseUrl } from "../API/api";
import { DefaultemailIcon, DefaultUserIcon } from "./Icon";
import { useTranslation } from "../hooks/useTranslation";

const ContentChangePopup = ({
    isOpen,
    onBack,
    onStartApproval,
    revisionresponse,
    type
}) => {
    const [selectedDate, setSelectedDate] = useState("");
    const [tempDate, setTempDate] = useState("");
    const [showCalendar, setShowCalendar] = useState(false);

    const [ccRoles, setCcRoles] = useState({
        architect: false,
        manager: false,
    });

    const [personalMessage, setPersonalMessage] = useState("");

    const t = useTranslation();
    // ==========================
    // DEFAULT DATE = NEXT MONTH 1st, 08:00
    // ==========================
    useEffect(() => {
        const now = new Date();
        const defaultDate = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            1,
            8,
            0
        );

        const iso = toLocalISO(defaultDate);
        setSelectedDate(iso);
        setTempDate(iso);
    }, []);

    if (!isOpen) return null;

    // Format date for UI
    const formattedDisplay = (() => {
        if (!selectedDate) return "";
        const d = new Date(selectedDate);
        const month = d.toLocaleString("default", { month: "long" });
        const day = d.getDate();
        const time = d.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
        return `${month} ${day} : ${time}`;
    })();
    const findUserById = (userId, assignedUsers) => {
        if (!userId || !assignedUsers) return null;

        const match = assignedUsers.find(
            (item) => item?.user?.id === userId
        );

        if (!match) return null;

        return {
            id: match.user.id,
            first_name: match.user.first_name,
            last_name: match.user.last_name,
            email: match.user.email,
            image: match.user.image,
        };
    };


    // MATCH actual user  from assigned_users
    const processOwnerId =
        revisionresponse?.contact_info?.domain_owner?.[0] ||
        revisionresponse?.contact_info?.owner?.[0] ||
        null;

    const processOwner = findUserById(processOwnerId, revisionresponse?.assigned_users);


    return (
        <Modal modalStyle={{ width: "550px" }}>

            <h2 style={styles.heading}>{t("publish_process")}</h2>
            <hr />

            <h3 style={styles.subheading}> {t("request_process_approval")}</h3>
            <hr />

            <p>{t("please_review_details_and_add_personal_message")}.</p>

            {/* =======================
          PROCESS OWNER DISPLAY
      ========================== */}
            <div style={{ marginTop: "10px" }}>
                <label style={styles.label}>Process Owner / Process Domain Owner:</label>


                <div className="owner_details_list">
                    <div className="owner_details">
                        <div className="owner-pic">
                            {processOwner?.image ? (
                                <img
                                    src={
                                        processOwner?.image.startsWith("http")
                                            ? processOwner?.image // ✅ Google ka full URL
                                            : `${ImageBaseUrl}uploads/profile_images/${processOwner?.image}` // ✅ Local image
                                    }
                                    alt="Profile"
                                />

                            ) : (
                                <DefaultUserIcon />
                            )}

                        </div>
                        <div className="owner-desc">
                            <span className="owner-name">
                                {processOwner
                                    ? `${processOwner.first_name} ${processOwner.last_name || ""}`
                                    : "—"}
                            </span>


                            <div className="owner-email">
                                <a
                                    href={`mailto:${processOwner.email}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <DefaultemailIcon />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>



            </div>


            <h3 style={styles.subheading}> {t("inform_cc_the_following_roles")}:</h3>

            {/* Process Architect(s) */}
            {revisionresponse?.contact_info?.architecture?.length > 0 && (
                <label style={styles.checkbox}>
                    <input
                        type="checkbox"
                        checked={ccRoles.architect}
                        onChange={() =>
                            setCcRoles({ ...ccRoles, architect: !ccRoles.architect })
                        }
                    />
                    Process Architect(s)
                </label>
            )}

            {/* Process Manager(s) */}
            {revisionresponse?.contact_info?.manager?.length > 0 && (
                <label style={styles.checkbox}>
                    <input
                        type="checkbox"
                        checked={ccRoles.manager}
                        onChange={() =>
                            setCcRoles({ ...ccRoles, manager: !ccRoles.manager })
                        }
                    />
                    Process Manager(s)
                </label>
            )}

            {/* =======================
          PLANNED PUBLISHING DATE
      ========================== */}
            <h3 style={styles.subheading}>  {t("planned_publishing_date")}:</h3>

            <div>
                {formattedDisplay}
                <button
                    style={styles.inlineEditBtn}
                    onClick={(e) => {
                        e.preventDefault();
                        setTempDate(selectedDate);
                        setShowCalendar(true);
                    }}
                >
                    {t("edit")}
                </button>
            </div>

            <DateTimePickerModal
                isOpen={showCalendar}
                onClose={() => setShowCalendar(false)}
                minDate={new Date()}
                onSave={(value) => {
                    const iso = toLocalISO(value);
                    setSelectedDate(iso);
                    setTempDate(iso);
                    setShowCalendar(false);
                }}
            />

            {/* =======================
          PERSONAL MESSAGE
      ========================== */}
            <h3 style={styles.subheading}>
                {t("personal_message_to_recipients_optional")}:
            </h3>

            <textarea
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                placeholder="Write a message..."
                style={styles.textarea}
            />

            {/* =======================
           FOOTER BUTTONS
      ========================== */}
            <div style={styles.footer}>
                <button className="popup-button cancel" onClick={onBack}>
                    ← {t("back")}
                </button>

                <button
                    className="popup-button save"
                    style={{ background: "#007bff" }}
                    onClick={() =>
                        onStartApproval({
                            date: selectedDate,
                            ccRoles,
                            personalMessage,
                            owner: processOwner,
                        })
                    }
                >
                    {t("start_approval")} →
                </button>
            </div>
        </Modal>
    );
};

const styles = {
    heading: { fontSize: "22px", fontWeight: "600" },
    subheading: { fontSize: "18px", marginTop: "15px" },
    label: { fontWeight: "600" },



    userImg: {
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        objectFit: "cover",
    },

    checkbox: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginTop: "8px",
    },

    inlineEditBtn: {
        marginLeft: "10px",
        padding: "3px 8px",
        background: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "12px",
    },

    textarea: {
        width: "100%",
        height: "100px",
        marginTop: "10px",
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
    },

    footer: {
        marginTop: "25px",
        display: "flex",
        justifyContent: "space-between",
    },
};

export default ContentChangePopup;

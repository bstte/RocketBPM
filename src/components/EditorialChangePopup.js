import React, { useState, useEffect } from "react";
import DateTimePickerModal from "./DateTimePickerModal";

// 👉 IMPORTANT helper
import { toLocalISO } from "../helpers/dateHelper";
import Modal from "./Modal";

const EditorialChangePopup = ({ isOpen, onBack, onPublish }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [tempDate, setTempDate] = useState("");
    const [showCalendar, setShowCalendar] = useState(false);

    // 👉 Default = Next month 1st date at 08:00 (no timezone issue)
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

    // 👉 Display formatted date
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

    const handleSaveDateTime = (value) => {
        const iso = toLocalISO(value); // ✨ fixed timezone
        setSelectedDate(iso);
        setTempDate(iso);
        setShowCalendar(false);
    };

    return (
        <Modal modalStyle={{width:"500px"}}>
            <h2 style={styles.heading}>Publish Process</h2>
            <hr />

            <h3 style={styles.subheading}>Schedule Publishing</h3>
            <hr />

            {/* Immediately */}
            <label style={styles.optionRow}>
                <input
                    type="radio"
                    name="schedule"
                    value="immediately"
                    checked={selectedOption === "immediately"}
                    onChange={() => {
                        setSelectedOption("immediately");
                        setShowCalendar(false);
                    }}
                />
                <span>Immediately</span>
            </label>

            {/* Custom date time */}
            <label style={styles.optionRow}>
                <input
                    type="radio"
                    name="schedule"
                    value="custom"
                    checked={selectedOption === "custom"}
                    onChange={() => setSelectedOption("custom")}
                />
                <span style={{ marginLeft: "8px" }}>
                    {formattedDisplay}
                    <button
                        style={styles.inlineEditBtn}
                        onClick={(e) => {
                            e.preventDefault();
                            setTempDate(selectedDate);
                            setShowCalendar(true);
                        }}
                    >
                        Edit
                    </button>
                </span>
            </label>

            {/* Calendar Modal */}
            <DateTimePickerModal
                isOpen={showCalendar}
                onClose={() => setShowCalendar(false)}
                onSave={handleSaveDateTime}
            />

            <div style={styles.footer}>
                <button className="popup-button cancel" onClick={onBack}>
                    ← Back
                </button>

                <button
                    className="popup-button save"
                    style={{
                        background: selectedOption ? "#28a745" : "#c4c4c4",
                        cursor: selectedOption ? "pointer" : "not-allowed",
                    }}
                    disabled={!selectedOption}
                    onClick={() =>
                        onPublish({
                            scheduleType: selectedOption,
                            date:
                                selectedOption === "custom"
                                    ? selectedDate
                                    : null,
                        })
                    }
                >
                    Publish
                </button>
            </div>
        </Modal>
    );
};

const styles = {


    heading: { fontSize: "22px", fontWeight: "600" },
    subheading: { fontSize: "18px", marginTop: "10px" },

    optionRow: {
        display: "flex",
        alignItems: "center",
        marginTop: "12px",
        gap: "6px",
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

    footer: {
        marginTop: "25px",
        display: "flex",
        justifyContent: "space-between",
    },
};

export default EditorialChangePopup;

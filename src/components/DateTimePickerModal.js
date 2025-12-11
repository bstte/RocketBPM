import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Modal from "./Modal";

const DateTimePickerModal = ({ isOpen, onClose, onSave }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState("12:00");

    if (!isOpen) return null;

    const handleSave = () => {
        const [hours, minutes] = selectedTime.split(":").map(Number);
        const finalDate = new Date(selectedDate);
        finalDate.setHours(hours);
        finalDate.setMinutes(minutes);
        onSave(finalDate);
    };

    return (
        <Modal modalStyle={{width:"350px"}}>

            {/* Close Button (Top-Right) */}
            <button onClick={onClose} style={styles.closeBtn}>✖</button>

            <h3 style={styles.title}>Select Date & Time</h3>

            <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
            />

            {/* Time Section */}
            <div style={styles.timeRow}>
                <label style={styles.timeLabel}>Select Time:</label>
                <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    style={styles.timeInput}
                />
            </div>

            {/* Save Button */}
            <button onClick={handleSave} style={styles.saveBtn}>Save</button>

        </Modal>
    );
};

const styles = {
    // overlay: {
    //     position: "fixed",
    //     top: 0, left: 0,
    //     width: "100vw",
    //     height: "100vh",
    //     background: "rgba(0,0,0,0.5)",
    //     display: "flex",
    //     justifyContent: "center",
    //     alignItems: "center",
    //     zIndex: "9999",
    // },
    // modal: {
    //     position: "relative",
    //     background: "#fff",
    //     padding: "20px 20px 25px",
    //     borderRadius: "12px",
    //     width: "360px",
    //     textAlign: "center",
    //     boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    // },
    closeBtn: {
        position: "absolute",
        top: "10px",
        right: "10px",
        background: "transparent",
        border: "none",
        fontSize: "18px",
        cursor: "pointer",
    },
    title: {
        marginBottom: "10px",
    },
    timeRow: {
        marginTop: "15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 10px",
    },
    timeLabel: {
        fontSize: "14px",
        fontWeight: "500",
    },
    timeInput: {
        padding: "6px",
        width: "50%",
    },
    saveBtn: {
        marginTop: "20px",
        padding: "10px 20px",
        background: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        width: "100%",
        fontSize: "16px",
    },
};

export default DateTimePickerModal;

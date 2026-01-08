import React, { useState } from "react";
import Modal from "react-modal";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import "./EditScheduledPublishingModal.css"; // Ensure you create this or use inline styles

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        width: "600px",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        border: "1px solid #002060",
    },
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
    },
};

const EditScheduledPublishingModal = ({
    isOpen,
    onClose,
    currentDate,
    onCancelPublishing,
    onReschedulePublishing,
}) => {
    const [isEditingDate, setIsEditingDate] = useState(false);
    const [newDate, setNewDate] = useState(currentDate);


    // Update newDate when currentDate prop changes or modal opens
    React.useEffect(() => {
        console.log("currentDate", currentDate);

        if (currentDate) {
            setNewDate(currentDate);
        }
    }, [currentDate, isOpen]);


    const handleDateChange = (date) => {
        setNewDate(date[0]);
    };

    const handleRescheduleClick = () => {
        if (newDate) {
            // Format date for MySQL: YYYY-MM-DD HH:MM:SS
            const isoDate = new Date(newDate);
            const formatted = isoDate.getFullYear() + "-" +
                String(isoDate.getMonth() + 1).padStart(2, '0') + "-" +
                String(isoDate.getDate()).padStart(2, '0') + " " +
                String(isoDate.getHours()).padStart(2, '0') + ":" +
                String(isoDate.getMinutes()).padStart(2, '0') + ":00";
            onReschedulePublishing(formatted);
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles}>
            <div className="esp-modal-header">
                <h3 style={{ color: '#002060', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Edit scheduled publishing</h3>
            </div>
            <div className="esp-modal-body" style={{ padding: '20px 0' }}>
                <div className="esp-field">
                    <label>Publishing date:</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                        {isEditingDate ? (
                            <Flatpickr
                                data-enable-time
                                value={newDate}
                                options={{ minDate: "today", dateFormat: "Y-m-d H:i" }}
                                onChange={handleDateChange}
                                className="date-picker-input"
                            />
                        ) : (
                            <span>{newDate ? new Date(newDate).toLocaleString() : 'Not scheduled'}</span>
                        )}
                        <button
                            className="esp-btn-small"
                            style={{ backgroundColor: '#002060', color: 'white', border: 'none', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer' }}
                            onClick={() => setIsEditingDate(!isEditingDate)}
                        >
                            EDIT
                        </button>
                    </div>
                </div>

                <div className="esp-field" style={{ marginTop: '20px' }}>
                    <p style={{ fontSize: '0.9em', color: '#666' }}>
                        Be careful: Cancelling the publishing will prevent the model from being published
                        and you will have to restart the approval of the model.
                    </p>
                    <button
                        onClick={onCancelPublishing}
                        style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        CANCEL PUBLISHING
                    </button>
                </div>
            </div>
            <div className="esp-modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #ddd', paddingTop: '15px' }}>
                <button
                    onClick={onClose}
                    style={{ backgroundColor: '#002060', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '5px', cursor: 'pointer' }}
                >
                    EXIT
                </button>
                <button
                    onClick={handleRescheduleClick}
                    style={{ backgroundColor: '#002060', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '5px', cursor: 'pointer' }}
                >
                    RE-SCHEDULE
                </button>
            </div>
        </Modal>
    );
};

export default EditScheduledPublishingModal;

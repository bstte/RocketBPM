import React, { useState } from "react";
import Modal from "./Modal";
import DateTimePickerModal from "./DateTimePickerModal";
import "./EditScheduledPublishingModal.css"; // Ensure you create this or use inline styles

const EditScheduledPublishingModal = ({
    isOpen,
    onClose,
    currentDate,
    onCancelPublishing,
    onReschedulePublishing,
}) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [newDate, setNewDate] = useState(currentDate);

    // Update newDate when currentDate prop changes or modal opens
    React.useEffect(() => {
        console.log("currentDate", currentDate);

        if (currentDate) {
            setNewDate(currentDate);
        }
    }, [currentDate, isOpen]);


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

    if (!isOpen) return null;

    return (
        <Modal modalStyle={{
            width: "600px",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            border: "1px solid #002060"
        }}>
            <div className="esp-modal-header">
                <h3 style={{ color: '#002060', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Edit scheduled publishing</h3>
            </div>
            <div className="esp-modal-body" style={{ padding: '20px 0' }}>
                <div className="esp-field">
                    <label>Publishing date:</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                        <span>{newDate ? new Date(newDate).toLocaleString() : 'Not scheduled'}</span>
                        <button
                            className="esp-btn-small"
                            style={{ marginLeft: "10px", padding: "3px 8px", background: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                            onClick={() => setIsCalendarOpen(true)}
                        >
                            EDIT
                        </button>
                    </div>
                </div>

                <DateTimePickerModal
                    isOpen={isCalendarOpen}
                    onClose={() => setIsCalendarOpen(false)}
                    onSave={(value) => {
                        setNewDate(value);
                        setIsCalendarOpen(false);
                    }}
                />

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

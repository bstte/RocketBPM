import React, { useState, useTransition } from "react";
import Modal from "react-modal";
import { useTranslation } from "../hooks/useTranslation";

const RequestChangeModal = ({ isOpen, onClose, onSubmit }) => {
    const [comment, setComment] = useState("");
    const t = useTranslation();
    const handleSubmit = () => {
        onSubmit(comment);
        setComment("");
        onClose();
    };

    const handleClose = () => {
        setComment("");
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            style={customStyles}
            contentLabel="Request Change Modal"
            ariaHideApp={false}
        >
            <div style={styles.container}>
                <div style={styles.header}>
                    <h2 style={styles.title}>{t("request_change")}</h2>
                </div>

                <div style={styles.body}>
                    <p style={styles.description}>
                        {t("describe_the_requested_process_change_to_be_send_to_the_process_modeler")}:
                    </p>

                    <textarea
                        style={styles.textarea}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={t("the_user_can_add_a_message_to_the_process_modeler")}
                    />
                </div>

                <div style={styles.footer}>
                    <button style={styles.cancelButton} onClick={handleClose}>
                        {t("cancel")}
                    </button>
                    <button style={styles.submitButton} onClick={handleSubmit}>
                        {t("request_change")}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

const customStyles = {
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        display: "flex", // Ensure flexbox is used for centering
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        position: "relative", // Reset position to relative
        top: "auto",
        left: "auto",
        right: "auto",
        bottom: "auto",
        width: "40%", // More reasonable width
        minWidth: "500px",
        maxWidth: "800px",
        padding: "0", // Remove padding to let container handle it
        border: "1px solid #ccc",
        borderRadius: "4px", // Slight radius
        background: "#fff",
        overflow: "visible", // Allow content to dictate size
        inset: "auto", // Remove inset
    },
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "20px",
    },
    header: {
        borderBottom: "none",
        paddingBottom: "10px",
        marginBottom: "10px",
    },
    title: {
        margin: 0,
        color: "#002060", // Deep blue
        fontSize: "18px",
        fontWeight: "600",
    },
    body: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
    },
    description: {
        color: "#002060", // Deep blue
        fontSize: "14px",
        fontWeight: "500",
        marginBottom: "15px",
    },
    textarea: {
        width: "100%",
        minHeight: "200px",
        padding: "10px",
        fontSize: "14px",
        border: "1px solid #ccc",
        borderRadius: "0", // Sharp edges as per screenshot
        resize: "vertical",
        outline: "none",
        boxSizing: 'border-box',
        borderLeft: "4px solid #002060", // Thick blue bar on the left as per screenshot
    },
    footer: {
        marginTop: "20px",
        display: "flex",
        justifyContent: "space-between",
        borderTop: "1px solid #eee",
        paddingTop: "15px",
    },
    cancelButton: {
        backgroundColor: "#002060", // Dark blue/black as per screenshot
        color: "#fff",
        border: "none",
        padding: "10px 20px",
        fontSize: "14px",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    submitButton: {
        backgroundColor: "#002060", // Same blue for consistency or match specific blue
        color: "#fff",
        border: "none",
        padding: "10px 20px",
        fontSize: "14px",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
    },
};

export default RequestChangeModal;

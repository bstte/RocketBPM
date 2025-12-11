import React from "react";

const Modal = ({

    children,
    overlayStyle = {},
    modalStyle = {},

}) => {
 

    return (
        <div style={{ ...styles.overlay, ...overlayStyle }}>
            <div style={{ ...styles.modal, ...modalStyle }}>
                
                {children}
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
    },
    modal: {
        background: "#fff",
        padding: "25px",
        borderRadius: "10px",
        position: "relative",
    },
    closeBtn: {
        position: "absolute",
        top: "10px",
        right: "10px",
        background: "transparent",
        border: "none",
        fontSize: "20px",
        cursor: "pointer",
    },
};

export default Modal;

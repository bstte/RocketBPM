import Swal from "sweetalert2";

const CustomAlert = {
  success: (title, text) => {
    return Swal.fire({
      icon: "success",
      title: title || "Success",
      text: text || "Operation completed successfully!",
    });
  },

  error: (title, text) => {
    Swal.fire({
      icon: "error",
      title: title || "Error",
      text: text || "Something went wrong!",
    });
  },

  warning: (title, text) => {
    Swal.fire({
      icon: "warning",
      title: title || "Warning",
      text: text || "Be careful with this action!",
    });
  },

  info: (title, text) => {
    Swal.fire({
      icon: "info",
      title: title || "Information",
      text: text || "Here is some important information!",
    });
  },

  confirm: (title, text, confirmCallback, cancelCallback, confirmButtonText, cancelButtonText) => {
    Swal.fire({
      icon: "warning",
      title: title || "Are you sure?",
      text: text || "You won’t be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: confirmButtonText || "Yes, confirm!",
      cancelButtonText: cancelButtonText || "Cancel",
    }).then((result) => {
      if (result.isConfirmed && confirmCallback) {
        confirmCallback();
      } else if (
        result.dismiss === Swal.DismissReason.cancel &&
        cancelCallback
      ) {
        cancelCallback();
      }
    });
  },

  confirmAction: ({ title, text, confirmBtnText, cancelBtnText, confirmCallback, cancelCallback }) => {
    Swal.fire({
      icon: "question",
      title: title || "Confirmation",
      text: text || "Are you sure?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: confirmBtnText || "Yes",
      cancelButtonText: cancelBtnText || "No",
    }).then((result) => {
      if (result.isConfirmed && confirmCallback) {
        confirmCallback();
      } else if (
        result.dismiss === Swal.DismissReason.cancel &&
        cancelCallback
      ) {
        cancelCallback();
      }
    });
  },

  confirmExit: (saveCallback, exitWithoutSaveCallback, cancelCallback, texts = {}) => {
    if (!document.getElementById('sweetalert-custom-exit-styles')) {
      const style = document.createElement('style');
      style.id = 'sweetalert-custom-exit-styles';
      style.innerHTML = `
        .swal-exit-popup.swal2-popup {
          border: 1px solid #002060 !important;
          border-radius: 2px !important;
          padding: 24px 30px !important;
          width: 550px !important;
          background-color: #fff !important;
        }
        .swal-exit-title.swal2-title {
          text-align: left !important;
          color: #002060 !important;
          font-family: 'Poppins', sans-serif !important;
          font-size: 20px !important;
          font-weight: 500 !important;
          padding: 0 !important;
          margin: 0 0 15px 0 !important;
        }
        .swal-exit-content.swal2-html-container {
          text-align: left !important;
          color: #002060 !important;
          font-family: 'Poppins', sans-serif !important;
          font-size: 16px !important;
          margin: 0 0 30px 0 !important;
          padding: 0 !important;
        }
        .swal-exit-actions.swal2-actions {
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          justify-content: flex-end !important;
          display: flex !important;
        }
        .swal-exit-cancel {
          margin-right: auto !important;
          order: 1 !important;
          background-color: #002060 !important;
          color: #fff !important;
          font-family: 'Poppins', sans-serif !important;
          border-radius: 4px !important;
        }
        .swal-exit-deny {
          order: 2 !important;
          margin: 0 10px 0 0 !important;
          background-color: #ee4f55 !important;
          color: #fff !important;
          font-family: 'Poppins', sans-serif !important;
          border-radius: 4px !important;
        }
        .swal-exit-confirm {
          order: 3 !important;
          background-color: #002060 !important;
          margin: 0 !important;
          color: #fff !important;
          font-family: 'Poppins', sans-serif !important;
          border-radius: 4px !important;
        }
      `;
      document.head.appendChild(style);
    }

    Swal.fire({
      title: texts.title || "You have unsaved changes",
      text: texts.text || "Do you want to save before exiting?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: texts.confirmButtonText || "Save & Exit",
      denyButtonText: texts.denyButtonText || "Exit without saving",
      cancelButtonText: texts.cancelButtonText || "Cancel",
      confirmButtonColor: "#002060",
      denyButtonColor: "#ee4f55",
      cancelButtonColor: "#002060",
      customClass: {
        popup: 'swal-exit-popup',
        title: 'swal-exit-title',
        htmlContainer: 'swal-exit-content',
        actions: 'swal-exit-actions',
        cancelButton: 'swal-exit-cancel',
        denyButton: 'swal-exit-deny',
        confirmButton: 'swal-exit-confirm'
      }
    }).then((result) => {
      if (result.isConfirmed && saveCallback) {
        saveCallback(); // Save & Exit
      } else if (result.isDenied && exitWithoutSaveCallback) {
        exitWithoutSaveCallback(); // Exit without saving
      } else if (result.isDismissed && cancelCallback) {
        if (cancelCallback) cancelCallback(); // Just stay on the page
      }
    });
  },


  confirmLanguageSwitch: (saveCallback, dontSaveCallback, texts = {}) => {
    Swal.fire({
      icon: "question",
      title: texts.title || "Save changes before switching language?",
      showCancelButton: true,
      confirmButtonText: texts.confirmButtonText || "Yes, save & switch",
      cancelButtonText: texts.cancelButtonText || "No, discard changes",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed && saveCallback) {
        saveCallback(); // User chose to save first
      } else if (result.dismiss === Swal.DismissReason.cancel && dontSaveCallback) {
        dontSaveCallback(); // User chose not to save
      }
    });
  },

  toast: (title, icon = "success") => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      // didOpen: (toast) => {
      //   toast.onmouseenter = Swal.stopTimer;
      //   toast.onmouseleave = Swal.resumeTimer;
      // }
    });
    Toast.fire({
      icon: icon,
      title: title
    });
  },

};

export default CustomAlert;

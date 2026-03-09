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

  confirm: (title, text, confirmCallback, cancelCallback) => {
    Swal.fire({
      icon: "warning",
      title: title || "Are you sure?",
      text: text || "You won’t be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm!",
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
    Swal.fire({
      icon: "warning",
      title: texts.title || "You have unsaved changes",
      text: texts.text || "Do you want to save before exiting?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: texts.confirmButtonText || "Exit (Save & Exit)",
      denyButtonText: texts.denyButtonText || "Exit without saving",
      cancelButtonText: texts.cancelButtonText || "Cancel",
      confirmButtonColor: "#3085d6",
      denyButtonColor: "#f39c12",
      cancelButtonColor: "#aaa",
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

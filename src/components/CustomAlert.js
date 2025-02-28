
import Swal from "sweetalert2";

const CustomAlert = {
  success: (title, text) => {
    Swal.fire({
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
      } else if (result.dismiss === Swal.DismissReason.cancel && cancelCallback) {
        cancelCallback();
      }
    });
  },
};

export default CustomAlert;
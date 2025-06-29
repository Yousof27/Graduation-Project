import { toast } from "react-toastify";

export const loginMessage = (message) => {
  toast.success(message, {
    position: "bottom-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  });
};

export const successMessage = (message) => {
  toast.success(message, {
    position: "bottom-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const errorMessage = (message) => {
  toast.error(message, {
    position: "bottom-right",
    autoClose: 1500,
  });
};

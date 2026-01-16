import { toast, type ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ---------------------------------- */
/* TOAST OPTIONS */
/* ---------------------------------- */

const toastOptions: ToastOptions = {
  position: "top-right",
  autoClose: 1000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: 0,
  hideProgressBar: false,
  theme: "light",
};

/* ---------------------------------- */
/* TOASTER CLASS */
/* ---------------------------------- */

class Toaster {
  warning(message: string): void {
    toast.warn(message, {
      ...toastOptions,
    });
  }
  success(message: string): void {
    toast.success(message, {
      ...toastOptions,
    });
  }

  error(message: string): void {
    toast.error(message, {
      ...toastOptions,
    });
  }

  warn(message: string): void {
    toast.warn(message, {
      ...toastOptions,
    });
  }

  info(message: string): void {
    toast.info(message, {
      ...toastOptions,
    });
  }
}

/* ---------------------------------- */
/* EXPORT SINGLETON */
/* ---------------------------------- */

export const toasts = new Toaster();

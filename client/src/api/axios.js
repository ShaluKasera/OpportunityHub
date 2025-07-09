import axios from "axios";
import { toast } from "react-hot-toast";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

instance.interceptors.response.use(
  (res) => {
    if (res?.data?.success === false) {
      const message = res.data.message || "Something went wrong";
      const pathname = window.location.pathname;

      toast.error(message, { id: `error-${pathname}` });
      return Promise.reject(res.data);
    }
    return res;
  },
  (err) => {
    const status = err.response?.status;
    const pathname = window.location.pathname;

    // Suppress toast for 401 errors
    if (status === 401) {
      // Optional: handle redirect to login or silent logout logic
      return Promise.reject(err);
    }

    const errorMessage = err.response?.data?.message || "Server error";
    toast.error(errorMessage, {
      id: `err-error-${pathname}`,
    });

    return Promise.reject(err);
  }
);


export default instance;

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
    console.log("error: ", err);
    const pathname = window.location.pathname;
    const errorMessage = err.response?.data?.message || "Server error";

    toast.error(errorMessage, {
      id: `err-error-${pathname}`, // unique toast per route
    });
    return Promise.reject(err);
  }
);

export default instance;

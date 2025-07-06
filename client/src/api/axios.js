import axios from "axios";
import { toast } from "react-hot-toast";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

instance.interceptors.response.use(
  (res) => {
    if (res?.data?.success === false) {
      toast.error(res.data.message || "Something went wrong");
      return Promise.reject(res.data);
    }
    return res;
  },
  (err) => {
    console.log("error: ",err)
    toast.error(err.response?.data?.message || "Server error");
    return Promise.reject(err);
  }
);

export default instance;

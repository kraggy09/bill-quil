import axios from "axios";
axios.defaults.withCredentials = true;
import { apiUrl } from "../constant";

const apiCaller = axios.create({
  baseURL: apiUrl,
});

apiCaller.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.log(config.url, "URL from the user");

    const exemptedRoutes = ["/login", "/signup"];

    if (config.url.includes(exemptedRoutes[0])) {
      return config;
    }

    if (!token) {
      return Promise.reject(new Error("Token not found"));
    }

    console.log(token, "token");

    if (config.method === "post") {
      config.data = {
        ...config.data,
        token,
      };
    } else if (config.method === "get") {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else if (config.method === "delete") {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiCaller;

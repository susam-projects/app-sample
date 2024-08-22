import { notification } from "antd";
import axios from "axios";

import i18n from "@/common/i18n";
import { authService } from "@/features/authentication";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
});

apiClient.defaults.withCredentials = true;
apiClient.defaults.headers.common["Accept-Language"] =
  "en-US,en;q=0.5,fr;q=0.3";
apiClient.defaults.headers.common["Cache-Control"] = "no-cache";

apiClient.interceptors.request.use(
  (request) => {
    const token = authService.getToken();
    if (token) {
      request.headers.setAuthorization(`Bearer ${token}`);
    }
    request.params = { ...request.params, t: Date.now() };
    return request;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error(error.response);

    if (error.response?.status === 401 || error.response?.status === 403) {
      authService.logout();
      window.location.href = import.meta.env.BASE_URL;
      notification.error({ message: i18n.t("auth.authError").toString() });
    }

    return Promise.reject(error);
  },
);

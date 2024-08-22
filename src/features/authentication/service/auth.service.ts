import { clearStore } from "@/app/store";
import { ls, ss } from "@/common/localStorageClient";
import { userInfoService } from "@/feature-blocks/userInfo";
import {
  AUTH_TOKEN_LS_KEY,
  authApi,
  IS_AUTHENTICATED_LS_KEY,
} from "@/features/authentication";

export const authService = {
  isAuthenticated() {
    return !!ls.get(IS_AUTHENTICATED_LS_KEY);
  },

  getToken() {
    return ls.get(AUTH_TOKEN_LS_KEY);
  },

  logout() {
    ls.clear();
    ss.clear();
    clearStore();
  },

  getCredentialsOverride() {
    const loginOverride = import.meta.env.VITE_AUTH_LOGIN;
    const passwordOverride = import.meta.env.VITE_AUTH_PASSWORD;
    if (!loginOverride || !passwordOverride) {
      return null;
    }
    return {
      login: loginOverride,
      password: passwordOverride,
    };
  },

  isCredentialsOverride() {
    return !!authService.getCredentialsOverride();
  },

  async authenticate(login?: string, password?: string) {
    if (authService.isCredentialsOverride() && !login && !password) {
      const override = authService.getCredentialsOverride();
      login = override?.login;
      password = override?.password;
    }

    try {
      const response = await authApi.authenticate(login!, password!);
      const token = response.data?.token;

      if (response.status === 200 && token) {
        ls.set(IS_AUTHENTICATED_LS_KEY, "true");
        ls.set(AUTH_TOKEN_LS_KEY, token);
        userInfoService.setUserInfo({ firstName: "test", lastName: "test" });
        return true;
      }
    } catch {
      return false;
    }

    return false;
  },
};

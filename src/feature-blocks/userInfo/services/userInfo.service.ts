import { ls } from "@/common/localStorageClient";

import {
  USER_FIRST_NAME_LS_KEY,
  USER_LAST_NAME_LS_KEY,
} from "../constants/localStorage.ts";

export interface IUserInfo {
  firstName: string | null;
  lastName: string | null;
}

export const userInfoService = {
  setUserInfo(data: { firstName: string; lastName: string }) {
    ls.set(USER_FIRST_NAME_LS_KEY, data.firstName);
    ls.set(USER_LAST_NAME_LS_KEY, data.lastName);
  },

  getUserInfo(): IUserInfo {
    return {
      firstName: ls.get(USER_FIRST_NAME_LS_KEY),
      lastName: ls.get(USER_LAST_NAME_LS_KEY),
    };
  },
};

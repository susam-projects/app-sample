import { IEntityData } from "@/common/api";

import { userInfoService } from "./userInfo.service.ts";

export const entityUserInfo = {
  getUserData(): IEntityData {
    const { firstName, lastName } = userInfoService.getUserInfo();
    return {
      userFirstname: firstName || "",
      userLastname: lastName || "",
    };
  },
};

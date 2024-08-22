import { FC } from "react";

import { UserInfoUI } from "../../components/UserInfoUI/UserInfoUI.tsx";
import { userInfoService } from "../../services/userInfo.service.ts";

export const UserInfo: FC = () => {
  const userInfo = userInfoService.getUserInfo();

  return (
    <UserInfoUI firstName={userInfo.firstName} lastName={userInfo.lastName} />
  );
};

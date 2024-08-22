import { authClient } from "@/common/api";

export interface IAuthenticateResponse {
  token: string;
}

export const authApi = {
  authenticate(login: string, password: string) {
    return authClient.post<IAuthenticateResponse>("/", { login, password });
  },
};

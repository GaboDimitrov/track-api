import { UserAttributes, UserLoginAttributes } from "../../models/User";

export interface AuthService {
  register: (username: string, password: string) => Promise<UserAttributes>;
  login: (username: string, password: string) => Promise<string>;
  getUser: (token: string) => Promise<UserLoginAttributes | null>;
}

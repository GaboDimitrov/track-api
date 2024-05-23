import { UserAttributes, UserCreationAttributes } from "../../models/User";

export interface UserRepository {
  findByUsername(username: string): Promise<UserAttributes | null>;
  create(user: UserCreationAttributes): Promise<UserAttributes>;
  findById(id: number): Promise<UserAttributes | null>;
}

import { Model, Optional } from "sequelize";

export interface UserAttributes {
  id: number;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "createdAt" | "updatedAt"> {}

export interface UserLoginAttributes
  extends Pick<UserAttributes, "id" | "username"> {}

export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {}

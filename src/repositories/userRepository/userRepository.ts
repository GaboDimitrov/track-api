import { ModelStatic } from "sequelize";
import { Models } from "../../models/init";
import {
  UserAttributes,
  UserCreationAttributes,
  UserInstance,
} from "../../models/User";
import { UserRepository } from "./types";

export const userRepository = ({
  models,
}: {
  models: Models;
}): UserRepository => {
  const User: ModelStatic<UserInstance> = models.User;

  const findByUsername = async (
    username: string
  ): Promise<UserAttributes | null> => {
    const user = await User.findOne({ where: { username } });
    return user ? user.get() : null;
  };

  const findById = async (id: number): Promise<UserAttributes | null> => {
    const user = await User.findByPk(id);
    return user ? user.get() : null;
  };

  const create = async (
    user: UserCreationAttributes
  ): Promise<UserAttributes> => {
    const newUser = await User.create(user);
    return newUser.get();
  };

  return {
    findByUsername,
    create,
    findById,
  };
};

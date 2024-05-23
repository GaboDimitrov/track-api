import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserAttributes, UserLoginAttributes } from "../../models/User";
import { AuthService } from "./types";
import { UserRepository } from "../../repositories/userRepository";
import { Config } from "../../config";
import {
  UserAlreadyExistsError,
  UserInputError,
  AuthenticationError,
} from "../../errors";
import { AuthValidationSchema } from "../../validation";

export type Bcrypt = Pick<typeof bcrypt, "hash" | "compare">;
export type JWT = Pick<typeof jwt, "sign" | "verify">;

export const authService = ({
  userRepository,
  config,
  bcrypt,
  jwt,
  authValidationSchema,
}: {
  userRepository: UserRepository;
  config: Config;
  bcrypt: Bcrypt;
  jwt: JWT;
  authValidationSchema: AuthValidationSchema;
}): AuthService => {
  const register = async (
    username: string,
    password: string
  ): Promise<UserAttributes> => {
    const { error } = authValidationSchema.register.validate({
      username,
      password,
    });

    if (error) {
      throw new UserInputError(error.details[0].message);
    }

    const existingUser = await userRepository.findByUsername(username);
    if (existingUser) {
      throw new UserAlreadyExistsError();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userRepository.create({
      username,
      password: hashedPassword,
    });
    return user;
  };

  const login = async (username: string, password: string): Promise<string> => {
    const user = await userRepository.findByUsername(username);
    if (!user) throw new AuthenticationError("Invalid username or password");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new AuthenticationError("Invalid username or password");

    const token = jwt.sign(
      { id: user.id, username: user.username },
      config.JWT_SECRET,
      {
        expiresIn: "3h",
      }
    );
    return token;
  };

  const getUser = async (
    token: string
  ): Promise<UserLoginAttributes | null> => {
    try {
      const decoded: any = jwt.verify(token, config.JWT_SECRET);
      const user = await userRepository.findById(decoded.id);
      return user ? { id: user.id, username: user.username } : null;
    } catch (error) {
      return null;
    }
  };

  return {
    register,
    login,
    getUser,
  };
};

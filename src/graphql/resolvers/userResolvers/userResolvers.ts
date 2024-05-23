import { UserAttributes } from "../../../models/User";
import { Args, UserResolvers } from "./types";
import { GraphQLContext } from "../../../server";
import { AuthService } from "../../../services/authService/types";
import { GraphQLError } from "graphql";

export const userResolvers: UserResolvers = {
  Mutation: {
    register: (
      _: null,
      { username, password }: Args,
      { container }: GraphQLContext
    ): Promise<UserAttributes> => {
      const authService: AuthService = container.resolve("authService");
      return authService.register(username, password);
    },
    login: async (
      _: null,
      { username, password }: Args,
      { container }: GraphQLContext
    ): Promise<{ token: string }> => {
      const authService: AuthService = container.resolve("authService");
      const token = await authService.login(username, password);
      return { token };
    },
  },
};

import { IResolvers } from "@graphql-tools/utils";
import { UserAttributes } from "../../../models/User";
import { GraphQLContext } from "../../../server";

export interface Args {
  username: string;
  password: string;
}

export interface MutationResolvers {
  register: (
    parent: null,
    args: Args,
    context: GraphQLContext
  ) => Promise<UserAttributes>;
  login: (
    parent: null,
    args: Args,
    context: GraphQLContext
  ) => Promise<{ token: string }>;
}

export interface UserResolvers extends IResolvers {
  Mutation: MutationResolvers;
}

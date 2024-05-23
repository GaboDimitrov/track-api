import { ApolloServer } from "@apollo/server";
import { schema } from "../graphql/schema";
import { GraphQLContext } from "./types";

export const server = new ApolloServer<GraphQLContext>({
  schema,
  status400ForVariableCoercionErrors: true,
});

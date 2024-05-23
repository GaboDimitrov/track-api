import { ApolloServer } from "@apollo/server";
import { schema } from "../graphql/schema";
import { GraphQLContext } from "./types";
import { GraphQLFormattedError, GraphQLSchema } from "graphql";
import { formatError } from "../errors/formatError";

type FormatError = (error: GraphQLFormattedError) => {
  message: string;
  code: {};
  path: readonly (string | number)[] | undefined;
  timestamp: string;
};

const buildServer = ({
  schema,
  formatError,
}: {
  schema: GraphQLSchema;
  formatError: FormatError;
}) =>
  new ApolloServer<GraphQLContext>({
    schema,
    status400ForVariableCoercionErrors: true,
    formatError,
  });

export const server = buildServer({ schema, formatError });

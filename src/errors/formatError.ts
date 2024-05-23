import { GraphQLFormattedError } from "graphql";

export const formatError = (error: GraphQLFormattedError) => {
  console.error(error);

  return {
    message: error.message,
    code: error.extensions?.code || "INTERNAL_SERVER_ERROR",
    path: error.path,
    timestamp: new Date().toISOString(),
  };
};

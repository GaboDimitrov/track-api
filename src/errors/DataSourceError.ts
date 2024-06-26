import { GraphQLError } from "graphql";

export class DataSourceError extends GraphQLError {
  constructor(message: string, error?: Error) {
    super(message, {
      extensions: {
        code: "DATA_SOURCE_ERROR",
        originalError: error,
        statusCode: 500,
      },
    });
  }
}

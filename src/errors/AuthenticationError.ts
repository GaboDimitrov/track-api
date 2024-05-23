import { GraphQLError } from "graphql";

export class AuthenticationError extends GraphQLError {
  constructor(message = "You must be logged in") {
    super(message, {
      extensions: {
        code: "UNAUTHENTICATED",
        statusCode: 401,
      },
    });
  }
}

import { GraphQLError } from "graphql";

export class AuthenticationError extends GraphQLError {
  constructor(message = "You must be logged in") {
    super(message, {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }
}

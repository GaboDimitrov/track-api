import { GraphQLError } from "graphql";

export class ValidationError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: "BAD_USER_INPUT",
      },
    });
  }
}

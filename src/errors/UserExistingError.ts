import { GraphQLError } from "graphql";

export class UserAlreadyExistsError extends GraphQLError {
  constructor() {
    super("Registration error: User already exists", {
      extensions: {
        code: "REGISTRATION_ERROR",
      },
    });
  }
}

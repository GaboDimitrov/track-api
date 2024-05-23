import { GraphQLError } from "graphql";

export class TrackNotFoundError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: "TRACK_NOT_FOUND",
      },
    });
  }
}

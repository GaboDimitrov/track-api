import { formatError } from "../formatError";
import { GraphQLFormattedError } from "graphql";

describe("formatError", () => {
  const baseError: GraphQLFormattedError = {
    message: "An error occurred",
    extensions: {
      code: "BAD_REQUEST",
    },
    path: ["somePath"],
    locations: [{ line: 1, column: 1 }],
  };

  test("formats error correctly with all fields", () => {
    const formattedError = formatError(baseError);

    expect(formattedError).toHaveProperty("message", "An error occurred");
    expect(formattedError).toHaveProperty("code", "BAD_REQUEST");
    expect(formattedError).toHaveProperty("path", ["somePath"]);
    expect(formattedError).toHaveProperty("timestamp");
    expect(new Date(formattedError.timestamp).toString()).not.toBe(
      "Invalid Date"
    );
  });

  test("defaults code to INTERNAL_SERVER_ERROR if not provided", () => {
    const errorWithoutCode = { ...baseError, extensions: {} };
    const formattedError = formatError(errorWithoutCode);

    expect(formattedError).toHaveProperty("code", "INTERNAL_SERVER_ERROR");
  });

  test("handles missing extensions field", () => {
    const errorWithoutExtensions: GraphQLFormattedError = {
      message: "An error occurred",
      path: ["somePath"],
    };
    const formattedError = formatError(errorWithoutExtensions);

    expect(formattedError).toHaveProperty("code", "INTERNAL_SERVER_ERROR");
  });

  test("handles missing path field", () => {
    const errorWithoutPath: GraphQLFormattedError = {
      message: "An error occurred",
      extensions: {
        code: "BAD_REQUEST",
      },
    };
    const formattedError = formatError(errorWithoutPath);

    expect(formattedError).toHaveProperty("path", undefined);
  });

  test("handles empty error object", () => {
    const emptyError = {} as GraphQLFormattedError;
    const formattedError = formatError(emptyError);

    expect(formattedError).toHaveProperty("message", undefined);
    expect(formattedError).toHaveProperty("code", "INTERNAL_SERVER_ERROR");
    expect(formattedError).toHaveProperty("path", undefined);
  });

  test("logs error to console", () => {
    console.error = jest.fn();

    const error: GraphQLFormattedError = {
      message: "Test error",
      extensions: {
        code: "TEST_ERROR",
      },
      path: ["testPath"],
    };

    formatError(error);
    expect(console.error).toHaveBeenCalledWith(error);
  });
});

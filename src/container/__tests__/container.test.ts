import { container } from "../container";

jest.mock("sequelize");
jest.mock("../../utils/validateEnv");

describe("container", () => {
  test("registers sequelize as a value", () => {
    expect(container.resolve("sequelize")).toBeDefined();
  });

  test("registers format as a singleton function", () => {
    expect(container.resolve("format")).toBeDefined();
  });

  test("registers axios as a singleton function", () => {
    expect(container.resolve("axios")).toBeDefined();
  });

  test("registers config as a value", () => {
    expect(container.resolve("config")).toBeDefined();
  });

  test("registers bcrypt as a singleton function", () => {
    expect(container.resolve("bcrypt")).toBeDefined();
  });

  test("registers jwt as a singleton function", () => {
    expect(container.resolve("jwt")).toBeDefined();
  });

  test("registers models as a value", () => {
    expect(container.resolve("models")).toBeDefined();
  });

  test("registers trackRepository as a singleton function", () => {
    expect(container.resolve("trackRepository")).toBeDefined();
  });

  test("registers trackService as a singleton function", () => {
    expect(container.resolve("trackService")).toBeDefined();
  });

  test("registers trackDataSource as a singleton function", () => {
    expect(container.resolve("trackDataSource")).toBeDefined();
  });

  test("registers authService as a singleton function", () => {
    expect(container.resolve("authService")).toBeDefined();
  });
  test("registers trackValidationSchema as value", () => {
    expect(container.resolve("trackValidationSchema")).toBeDefined();
  });

  test("registers userRepository as a singleton function", () => {
    expect(container.resolve("userRepository")).toBeDefined();
  });
});

import { container } from "../container";

describe("container", () => {
  test("should register sequelize as a value", () => {
    expect(container.resolve("sequelize")).toBeDefined();
  });

  test("should register format as a singleton function", () => {
    expect(container.resolve("format")).toBeDefined();
  });

  test("should register axios as a singleton function", () => {
    expect(container.resolve("axios")).toBeDefined();
  });

  test("should register config as a value", () => {
    expect(container.resolve("config")).toBeDefined();
  });

  test("should register bcrypt as a singleton function", () => {
    expect(container.resolve("bcrypt")).toBeDefined();
  });

  test("should register jwt as a singleton function", () => {
    expect(container.resolve("jwt")).toBeDefined();
  });

  test("should register models as a value", () => {
    expect(container.resolve("models")).toBeDefined();
  });

  test("should register trackRepository as a singleton function", () => {
    expect(container.resolve("trackRepository")).toBeDefined();
  });

  test("should register trackService as a singleton function", () => {
    expect(container.resolve("trackService")).toBeDefined();
  });

  test("should register trackDataSource as a singleton function", () => {
    expect(container.resolve("trackDataSource")).toBeDefined();
  });

  test("should register authService as a singleton function", () => {
    expect(container.resolve("authService")).toBeDefined();
  });

  test("should register userRepository as a singleton function", () => {
    expect(container.resolve("userRepository")).toBeDefined();
  });
});

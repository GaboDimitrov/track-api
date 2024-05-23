import { validateEnvVar } from "../validateEnv";

describe("validateEnvVar", () => {
  test("it returns variable if the variable exists", () => {
    expect(validateEnvVar("exists", "exists")).toEqual("exists");
  });

  test("it throws an error if variable is NOT provided", () => {
    expect(() => validateEnvVar(undefined, "exists")).toThrow(Error);
  });
});

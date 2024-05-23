import { register } from "../authValidation";

describe("AuthValidation", () => {
  const validData = {
    username: "ValidUsername",
    password: "ValidPassword",
  };

  describe("register", () => {
    test("valid data passes", () => {
      const { error } = register.validate(validData);
      expect(error).toBeUndefined();
    });

    test("username validation", () => {
      const invalidData = { ...validData, username: "" };
      const { error } = register.validate(invalidData);
      expect(error?.details[0].message).toBe("Username name cannot be empty");

      invalidData.username = "abc";
      const { error: error2 } = register.validate(invalidData);
      expect(error2?.details[0].message).toBe(
        "Username must be at least 4 characters long"
      );
    });

    test("password validation", () => {
      const invalidData = { ...validData, password: "" };
      const { error } = register.validate(invalidData);
      expect(error?.details[0].message).toBe("Password name cannot be empty");

      invalidData.password = "abc";
      const { error: error2 } = register.validate(invalidData);
      expect(error2?.details[0].message).toBe(
        "Password must be at least 4 characters long"
      );
    });
  });
});

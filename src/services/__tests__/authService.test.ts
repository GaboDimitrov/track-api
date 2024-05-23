import { Bcrypt, JWT, authService } from "../authService";
import { UserRepository } from "../../repositories/userRepository";
import { Config } from "../../config";
import { UserAttributes, UserLoginAttributes } from "../../models/User";
import { AuthService } from "../authService/types";
import {
  AuthenticationError,
  UserAlreadyExistsError,
  UserInputError,
} from "../../errors";
import { AuthValidationSchema, RegisterSchema } from "../../validation";

describe("authService", () => {
  const userRepositoryMock: jest.Mocked<UserRepository> = {
    create: jest.fn(),
    findByUsername: jest.fn(),
    findById: jest.fn(),
  };
  const configMock: Config = {
    JWT_SECRET: "test-secret",
    ACR_CLOUD_API_URL: "",
    ACR_CLOUD_ACCESS_TOKEN: "",
    DATABASE_URL: "",
  };
  const bcryptMock = {
    hash: jest.fn(),
    compare: jest.fn(),
  };
  const jwtMock = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const validateMock = jest.fn();
  const registerSchemaMock: RegisterSchema = {
    validate: validateMock,
  };

  const authValidationSchemaMock: AuthValidationSchema = {
    register: registerSchemaMock,
  };
  const service: AuthService = authService({
    userRepository: userRepositoryMock,
    config: configMock,
    bcrypt: bcryptMock,
    jwt: jwtMock,
    authValidationSchema: authValidationSchemaMock,
  });

  beforeEach(() => {
    validateMock.mockReturnValue({ error: null });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("register", () => {
    test("if hashes password and create user", async () => {
      const hashedPassword = "hashedpassword";
      const mockUser: UserAttributes = {
        id: 1,
        username: "testuser",
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      bcryptMock.hash.mockResolvedValue(hashedPassword);
      userRepositoryMock.create.mockResolvedValue(mockUser);

      const result = await service.register("testuser", "password");

      expect(bcryptMock.hash).toHaveBeenCalledWith("password", 10);
      expect(userRepositoryMock.create).toHaveBeenCalledWith({
        username: "testuser",
        password: hashedPassword,
      });
      expect(result).toEqual(mockUser);
    });

    test("if throws UserInputError when username is too short", async () => {
      validateMock.mockReturnValueOnce({
        error: { details: [{ message: "too short" }] },
      });
      await expect(service.register("tes", "password")).rejects.toThrow(
        UserInputError
      );
    });

    test("if throws UserInputError when password is too short", async () => {
      validateMock.mockReturnValueOnce({
        error: { details: [{ message: "too short" }] },
      });
      await expect(service.register("testuser", "pas")).rejects.toThrow(
        UserInputError
      );
    });

    test("if throws UserAlreadyExistsError when username exist", async () => {
      const mockUser: UserAttributes = {
        id: 1,
        username: "testuser",
        password: "hashedPassword",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      userRepositoryMock.findByUsername.mockResolvedValue(mockUser);

      await expect(service.register("testuser", "passsword")).rejects.toThrow(
        UserAlreadyExistsError
      );
    });
  });

  describe("login", () => {
    test("if returns token if username and password are correct", async () => {
      const mockUser: UserAttributes = {
        id: 1,
        username: "testuser",
        password: "hashedpassword",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockToken = "mocked.jwt.token";
      userRepositoryMock.findByUsername.mockResolvedValue(mockUser);
      bcryptMock.compare.mockResolvedValue(true);
      jwtMock.sign.mockReturnValue(mockToken);

      const result = await service.login("testuser", "password");

      expect(userRepositoryMock.findByUsername).toHaveBeenCalledWith(
        "testuser"
      );
      expect(bcryptMock.compare).toHaveBeenCalledWith(
        "password",
        mockUser.password
      );
      expect(jwtMock.sign).toHaveBeenCalledWith(
        { id: mockUser.id, username: mockUser.username },
        configMock.JWT_SECRET,
        { expiresIn: "3h" }
      );
      expect(result).toEqual(mockToken);
    });

    test("if throws an error when username is incorrect", async () => {
      userRepositoryMock.findByUsername.mockResolvedValue(null);

      await expect(service.login("testuser", "password")).rejects.toThrow(
        AuthenticationError
      );
    });

    test("if throws an error when password is incorrect", async () => {
      const mockUser: UserAttributes = {
        id: 1,
        username: "testuser",
        password: "hashedpassword",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      userRepositoryMock.findByUsername.mockResolvedValue(mockUser);
      bcryptMock.compare.mockResolvedValue(false);

      await expect(service.login("testuser", "password")).rejects.toThrow(
        AuthenticationError
      );
    });
  });

  describe("getUser", () => {
    test("if returns user when the token is valid", async () => {
      const mockUser: UserAttributes = {
        id: 1,
        username: "testuser",
        password: "hashedpassword",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockDecoded = { id: 1, username: "testuser" };
      jwtMock.verify.mockReturnValue(mockDecoded);
      userRepositoryMock.findById.mockResolvedValue(mockUser);

      const result = await service.getUser("valid.token");

      expect(jwtMock.verify).toHaveBeenCalledWith(
        "valid.token",
        configMock.JWT_SECRET
      );
      expect(userRepositoryMock.findById).toHaveBeenCalledWith(mockDecoded.id);
      expect(result).toEqual({ id: mockUser.id, username: mockUser.username });
    });

    test("it returns null when token is NOT valid", async () => {
      jwtMock.verify.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const result = await service.getUser("invalid.token");

      expect(jwtMock.verify).toHaveBeenCalledWith(
        "invalid.token",
        configMock.JWT_SECRET
      );
      expect(result).toBeNull();
    });

    test("if returns null when user is NOT found", async () => {
      const mockDecoded = { id: 1, username: "testuser" };
      jwtMock.verify.mockReturnValue(mockDecoded);
      userRepositoryMock.findById.mockResolvedValue(null);

      const result = await service.getUser("valid.token");

      expect(jwtMock.verify).toHaveBeenCalledWith(
        "valid.token",
        configMock.JWT_SECRET
      );
      expect(userRepositoryMock.findById).toHaveBeenCalledWith(mockDecoded.id);
      expect(result).toBeNull();
    });
  });
});

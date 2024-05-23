import { userResolvers } from "../userResolvers";
import { AuthService } from "../../../services/authService/types";
import { GraphQLContext } from "../../../server";
import { UserAttributes } from "../../../models/User";
import { GraphQLError } from "graphql";
import { AwilixContainer } from "awilix";
import {
  AuthServiceMock,
  AwilixContainerMock,
  getContainerMock,
} from "./mocks";

describe("userResolvers", () => {
  const authServiceMock: AuthServiceMock = {
    register: jest.fn(),
    login: jest.fn(),
    getUser: jest.fn(),
  };
  const containerMock: AwilixContainerMock =
    getContainerMock<AuthServiceMock>(authServiceMock);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Mutation", () => {
    describe("register", () => {
      test("registers a user", async () => {
        const mockUser: UserAttributes = {
          id: 1,
          username: "testuser",
          password: "hashedpassword",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        authServiceMock.register.mockResolvedValue(mockUser);
        const result = await userResolvers.Mutation.register(
          null,
          { username: "testuser", password: "password" },
          { container: containerMock, user: null }
        );
        expect(containerMock.resolve).toHaveBeenCalledWith("authService");
        expect(authServiceMock.register).toHaveBeenCalledWith(
          "testuser",
          "password"
        );
        expect(result).toEqual(mockUser);
      });
    });
    describe("login", () => {
      test("logs in a user and returns a token", async () => {
        const mockToken = "mocked.jwt.token";
        authServiceMock.login.mockResolvedValue(mockToken);
        const result = await userResolvers.Mutation.login(
          null,
          { username: "testuser", password: "password" },
          { container: containerMock, user: null }
        );
        expect(containerMock.resolve).toHaveBeenCalledWith("authService");
        expect(authServiceMock.login).toHaveBeenCalledWith(
          "testuser",
          "password"
        );
        expect(result).toEqual({ token: mockToken });
      });
    });
  });
});

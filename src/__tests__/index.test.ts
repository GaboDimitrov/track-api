import { startServer } from "..";
import { Sequelize } from "sequelize";
import { AwilixContainer } from "awilix";
import { AuthService } from "../services/authService/types";

jest.mock("sequelize");
jest.mock("@apollo/server/standalone");
jest.mock("../utils/validateEnv");

interface MockedSequelize extends Partial<Sequelize> {
  authenticate: jest.Mock;
  sync: jest.Mock;
}

interface MockedContainer extends Partial<AwilixContainer> {
  resolve: jest.Mock;
}

describe("startServer", () => {
  const sequelizeMock: MockedSequelize = {
    authenticate: jest.fn(),
    sync: jest.fn(),
  };

  const startStandaloneServerMock: jest.Mock = jest.fn().mockResolvedValue({
    url: "http://localhost:4000",
  });

  const authServiceMock: jest.Mocked<AuthService> = {
    getUser: jest.fn().mockResolvedValue(null),
    register: jest.fn(),
    login: jest.fn(),
  };

  const containerMock: MockedContainer = {
    resolve: jest.fn().mockReturnValue(authServiceMock),
  };

  const consoleLogSpy = jest.spyOn(console, "log");
  const consoleErrorSpy = jest.spyOn(console, "error");

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  test("starts the server successfully", async () => {
    await startServer({
      sequelize: sequelizeMock,
      startStandaloneServer: startStandaloneServerMock,
      container: containerMock,
    });

    expect(sequelizeMock.authenticate).toHaveBeenCalled();
    expect(sequelizeMock.sync).toHaveBeenCalled();
    expect(startStandaloneServerMock).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "🚀 Server ready at http://localhost:4000"
    );
  });

  test("handles errors when starting the server", async () => {
    const error = new Error("Test Error");
    sequelizeMock.authenticate = jest.fn().mockRejectedValue(error);

    await startServer({
      sequelize: sequelizeMock,
      startStandaloneServer: startStandaloneServerMock,
      container: containerMock,
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Unable to start the server:",
      error
    );
  });

  test("sets user in context if token is provided", async () => {
    const mockGetUser = jest
      .fn()
      .mockResolvedValue({ id: 1, name: "Test User" });
    containerMock.resolve = jest.fn().mockReturnValue({ getUser: mockGetUser });

    await startServer({
      sequelize: sequelizeMock as Sequelize,
      startStandaloneServer: startStandaloneServerMock,
      container: containerMock as any,
    });

    const contextFunction = startStandaloneServerMock.mock.calls[0][1].context;
    const req = { headers: { authorization: "Bearer test-token" } };

    const context = await contextFunction({ req });

    expect(mockGetUser).toHaveBeenCalledWith("Bearer test-token");
    expect(context.user).toEqual({ id: 1, name: "Test User" });
  });

  test("does not set user in context if no token is provided", async () => {
    await startServer({
      sequelize: sequelizeMock as Sequelize,
      startStandaloneServer: startStandaloneServerMock,
      container: containerMock,
    });

    const contextFunction = startStandaloneServerMock.mock.calls[0][1].context;
    const req = { headers: { authorization: "" } };

    const context = await contextFunction({ req });

    expect(context.user).toBeNull();
  });
});

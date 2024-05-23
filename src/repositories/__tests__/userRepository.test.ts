import { ModelStatic } from "sequelize";
import {
  UserAttributes,
  UserCreationAttributes,
  UserInstance,
} from "../../models/User";
import { UserRepository, userRepository } from "../userRepository";
import { trackMock, userMock } from "./mocks";

describe("userRepository", () => {
  const repository: UserRepository = userRepository({
    models: { Track: trackMock, User: userMock },
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should find a user by username", async () => {
    const username = "testuser";
    const userAttributes: UserAttributes = {
      id: 1,
      username: "testuser",
      password: "hashedpassword",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    userMock.findOne.mockResolvedValue({
      get: () => userAttributes,
    } as UserInstance);

    const result = await repository.findByUsername(username);

    expect(userMock.findOne).toHaveBeenCalledWith({ where: { username } });
    expect(result).toEqual(userAttributes);
  });

  test("should return null if user is not found by username", async () => {
    const username = "testuser";
    userMock.findOne.mockResolvedValue(null);

    const result = await repository.findByUsername(username);

    expect(userMock.findOne).toHaveBeenCalledWith({ where: { username } });
    expect(result).toBeNull();
  });

  test("should find a user by ID", async () => {
    const userId = 1;
    const userAttributes: UserAttributes = {
      id: 1,
      username: "testuser",
      password: "hashedpassword",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    userMock.findByPk.mockResolvedValue({
      get: () => userAttributes,
    } as UserInstance);

    const result = await repository.findById(userId);

    expect(userMock.findByPk).toHaveBeenCalledWith(userId);
    expect(result).toEqual(userAttributes);
  });

  test("should return null if user is not found by ID", async () => {
    const userId = 1;
    userMock.findByPk.mockResolvedValue(null);

    const result = await repository.findById(userId);

    expect(userMock.findByPk).toHaveBeenCalledWith(userId);
    expect(result).toBeNull();
  });

  test("should create a new user", async () => {
    const userCreationAttributes: UserCreationAttributes = {
      username: "newuser",
      password: "newpassword",
    };
    const userAttributes: UserAttributes = {
      id: 1,
      username: "newuser",
      password: "hashedpassword",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    userMock.create.mockResolvedValue({
      get: () => userAttributes,
    } as UserInstance);

    const result = await repository.create(userCreationAttributes);

    expect(userMock.create).toHaveBeenCalledWith(userCreationAttributes);
    expect(result).toEqual(userAttributes);
  });
});

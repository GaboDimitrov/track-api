import { ModelStatic } from "sequelize";
import { TrackInstance } from "../../models/Track";
import { UserInstance } from "../../models/User";

const findAll: jest.Mock = jest.fn();
export const trackMock: jest.Mocked<ModelStatic<TrackInstance>> = {
  ...jest.requireActual("sequelize").Model,
  findAll,
  findByPk: jest.fn(),
  create: jest.fn(),
  destroy: jest.fn(),
  update: jest.fn(),
};

export const userMock: jest.Mocked<ModelStatic<UserInstance>> = {
  ...jest.requireActual("sequelize").Model,
  findAll: jest.fn(),
  findOne: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  destroy: jest.fn(),
  update: jest.fn(),
};

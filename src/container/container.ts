import axios from "axios";
import { createContainer, asValue, asFunction, AwilixContainer } from "awilix";
import { format } from "date-fns";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sequelize } from "../config";
import { initModels } from "../models/init";
import { trackRepository } from "../repositories/trackRepository";
import { trackService } from "../services/trackService";
import { config } from "../config/env";
import { authService } from "../services/authService";
import { userRepository } from "../repositories/userRepository";
import { trackDataSource } from "../dataSource/trackDataSource";
import { createTrack, register, updateTrack } from "../validation";
import { getTrackByNameAndArtists } from "../validation/";

const container: AwilixContainer = createContainer();

container.register({
  sequelize: asValue(sequelize),
  format: asFunction(() => format).singleton(),
  axios: asFunction(() => axios).singleton(),
  config: asValue(config),
  trackValidationSchema: asValue({
    createTrack,
    getTrackByNameAndArtists,
    updateTrack,
  }),
  authValidationSchema: asValue({
    register,
  }),
  bcrypt: asFunction(() => bcrypt).singleton(),
  jwt: asFunction(() => jwt).singleton(),
  models: asValue(initModels(sequelize)),
  trackRepository: asFunction(trackRepository).singleton(),
  trackService: asFunction(trackService).singleton(),
  trackDataSource: asFunction(trackDataSource).singleton(),
  authService: asFunction(authService).singleton(),
  userRepository: asFunction(userRepository).singleton(),
});

export { container };

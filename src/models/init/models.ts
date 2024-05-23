import { Sequelize } from "sequelize";
import { TrackModel } from "../Track";
import { UserModel } from "../User";
export * from "../Track/types";

export const initModels = (sequelize: Sequelize) => {
  const Track = TrackModel(sequelize);
  const User = UserModel(sequelize);

  return {
    Track,
    User,
  };
};

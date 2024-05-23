import { Sequelize } from "sequelize";
import { config } from "./env";

export const sequelize = new Sequelize(config.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
});

import dotenv from "dotenv";
import { validateEnvVar } from "../utils/validateEnv";

dotenv.config();

export const config = {
  ACR_CLOUD_API_URL: validateEnvVar(
    process.env.ACR_CLOUD_API_URL,
    "ACR_CLOUD_API_URL"
  ),
  ACR_CLOUD_ACCESS_TOKEN: validateEnvVar(
    process.env.ACR_CLOUD_ACCESS_TOKEN,
    "ACR_CLOUD_ACCESS_TOKEN"
  ),
  DATABASE_URL: validateEnvVar(process.env.DATABASE_URL, "DATABASE_URL"),
  JWT_SECRET: validateEnvVar(process.env.JWT_SECRET, "JWT_SECRET"),
};

export type Config = typeof config;

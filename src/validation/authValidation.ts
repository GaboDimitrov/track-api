import Joi from "joi";
import { UserCreationAttributes } from "../models/User";
import { RegisterSchema } from "./types";

export const register: RegisterSchema = Joi.object<UserCreationAttributes>({
  username: Joi.string().min(4).required().messages({
    "string.empty": "Username name cannot be empty",
    "string.min": "Username must be at least 4 characters long",
  }),
  password: Joi.string().min(4).required().messages({
    "string.empty": "Password name cannot be empty",
    "string.min": "Password must be at least 4 characters long",
  }),
});

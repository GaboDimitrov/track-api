import { AwilixContainer } from "awilix";
import { UserLoginAttributes } from "../models/User";

export interface GraphQLContext {
  container: Pick<AwilixContainer, "resolve">;
  user: UserLoginAttributes | null;
}

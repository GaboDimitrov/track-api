import { ModelStatic } from "sequelize";
import { UserInstance } from "../User";
import { TrackInstance } from "../Track";

export interface Models {
  Track: ModelStatic<TrackInstance>;
  User: ModelStatic<UserInstance>;
}

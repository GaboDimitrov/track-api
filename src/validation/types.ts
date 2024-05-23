import Joi from "joi";
import {
  TrackCreationAttributes,
  TrackUpdateAttributes,
} from "../models/Track";
import { UserCreationAttributes } from "../models/User";
import { GetTrackByNameAndArtistsArgs } from "../graphql/resolvers/trackResolvers";

export type CreateTrackSchema = Pick<
  Joi.ObjectSchema<TrackCreationAttributes>,
  "validate"
>;

export type UpdateTrackSchema = Pick<
  Joi.ObjectSchema<TrackUpdateAttributes>,
  "validate"
>;

export type RegisterSchema = Pick<
  Joi.ObjectSchema<UserCreationAttributes>,
  "validate"
>;

export type getTrackByNameAndArtistsSchema = Pick<
  Joi.ObjectSchema<GetTrackByNameAndArtistsArgs>,
  "validate"
>;

export interface TrackValidationSchema {
  createTrack: CreateTrackSchema;
  getTrackByNameAndArtists: getTrackByNameAndArtistsSchema;
  updateTrack: UpdateTrackSchema;
}

export interface AuthValidationSchema {
  register: RegisterSchema;
}

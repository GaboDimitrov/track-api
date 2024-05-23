import * as joi from "joi";
import {
  TrackCreationAttributes,
  TrackUpdateAttributes,
} from "../models/Track";
import { CreateTrackSchema, UpdateTrackSchema } from "./types";
import { GetTrackByNameAndArtistsArgs } from "../graphql/resolvers/trackResolvers";
import DateExtension from "@joi/date";

const Joi = joi.extend(DateExtension) as typeof joi;
export const createTrack: CreateTrackSchema =
  Joi.object<TrackCreationAttributes>({
    name: Joi.string().min(3).required().messages({
      "string.empty": "Track name cannot be empty",
      "string.min": "Track name must be at least 3 characters long",
    }),
    artistNames: Joi.array()
      .min(1)
      .items(
        Joi.string().min(3).required().messages({
          "string.empty": "Artist name cannot be empty",
          "string.min": "Each artist name must be at least 3 characters long",
          "any.required": "Artist name is required",
        })
      )
      .required()
      .messages({
        "array.includesRequiredUnknowns": "Artist names array cannot be empty",
      }),
    duration: Joi.number().required(),
    isrc: Joi.string().min(2).required().messages({
      "string.empty": "ISRS name cannot be empty",
      "string.min": "ISRS must be at least 2 characters long",
    }),
    releaseDate: Joi.date().format("YYYY-MM-DD").required().messages({
      "date.base": "Release date must be a valid date",
      "date.format": "Release date must be in ISO format (YYYY-MM-DD)",
      "any.required": "Release date is required",
    }),
  });

export const updateTrack: UpdateTrackSchema = Joi.object<TrackUpdateAttributes>(
  {
    id: Joi.number().required(),
    name: Joi.string().min(3).messages({
      "string.empty": "Track name cannot be empty",
      "string.min": "Track name must be at least 3 characters long",
    }),
    artistNames: Joi.array()
      .min(1)
      .items(
        Joi.string().min(3).required().messages({
          "string.empty": "Artist name cannot be empty",
          "string.min": "Each artist name must be at least 3 characters long",
          "any.required": "Artist name is required",
        })
      )
      .required()
      .messages({
        "array.includesRequiredUnknowns": "Artist names array cannot be empty",
      }),
    duration: Joi.number(),
    isrc: Joi.string().min(2).messages({
      "string.empty": "ISRS name cannot be empty",
      "string.min": "ISRS must be at least 2 characters long",
    }),
    releaseDate: Joi.date().format("YYYY-MM-DD").required().messages({
      "date.base": "Release date must be a valid date",
      "date.format": "Release date must be in ISO format (YYYY-MM-DD)",
      "any.required": "Release date is required",
    }),
  }
);

export const getTrackByNameAndArtists =
  Joi.object<GetTrackByNameAndArtistsArgs>({
    name: Joi.string().min(3).required().messages({
      "string.empty": "Track name cannot be empty",
      "string.min": "Track name must be at least 3 characters long",
    }),
    artistNames: Joi.array()
      .items(
        Joi.string().min(3).required().messages({
          "string.empty": "Artist name cannot be empty",
          "string.min": "Each artist name must be at least 3 characters long",
          "any.required": "Artist name is required",
        })
      )
      .min(1)
      .required()
      .messages({
        "array.includesRequiredUnknowns": "Artist names array cannot be empty",
      }),
  });

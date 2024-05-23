import { Model, Optional } from "sequelize";

export interface TrackAttributes {
  id: number;
  name: string;
  artistNames: string[];
  duration: number;
  ISRC: string;
  releaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface FormattedTrackAttributes {
  id: number;
  name: string;
  artistNames: string[];
  duration: number;
  ISRC: string;
  releaseDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrackCreationAttributes
  extends Optional<TrackAttributes, "id" | "createdAt" | "updatedAt"> {}

export interface TrackUpdateAttributes
  extends Optional<
    TrackAttributes,
    | "createdAt"
    | "updatedAt"
    | "name"
    | "artistNames"
    | "duration"
    | "ISRC"
    | "releaseDate"
  > {}

export interface TrackInstance
  extends Model<TrackAttributes, TrackCreationAttributes>,
    TrackAttributes {}

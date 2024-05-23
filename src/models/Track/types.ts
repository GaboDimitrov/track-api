import { Model, Optional } from "sequelize";

export interface TrackAttributes {
  id: number;
  name: string;
  artistNames: string[];
  duration: number;
  isrc: string;
  releaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface FormattedTrackAttributes {
  id: number;
  name: string;
  artistNames: string[];
  duration: number;
  isrc: string;
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
    | "isrc"
    | "releaseDate"
  > {}

export interface TrackInstance
  extends Model<TrackAttributes, TrackCreationAttributes>,
    TrackAttributes {}

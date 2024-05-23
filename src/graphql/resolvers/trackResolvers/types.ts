import { IResolvers } from "@graphql-tools/utils";
import {
  TrackAttributes,
  TrackCreationAttributes,
  TrackUpdateAttributes,
} from "../../../models/init";
import { GraphQLContext } from "../../../server";

export interface GetTrackByIdArgs {
  id: number;
}

export interface GetTrackByNameAndArtistsArgs {
  name: string;
  artistNames: string[];
}

export interface Format {
  (date: Date, format: string): string;
}

interface TrackResolver {
  artist_name: (track: TrackAttributes) => string;
  createdAt: (
    parent: TrackAttributes,
    _: unknown,
    { container }: GraphQLContext
  ) => string;
  updatedAt: (
    parent: TrackAttributes,
    _: unknown,
    { container }: GraphQLContext
  ) => string;
  releaseDate: (
    parent: TrackAttributes,
    _: unknown,
    { container }: GraphQLContext
  ) => string;
  duration: (
    parent: TrackAttributes,
    _: unknown,
    { container }: GraphQLContext
  ) => string;
}

interface QueryResolver {
  getTrackByNameAndArtists: (
    _: unknown,
    { name, artistNames }: GetTrackByNameAndArtistsArgs,
    { container, user }: GraphQLContext
  ) => Promise<TrackAttributes | null>;
  getAllTracks: (
    _: unknown,
    args: null,
    { container, user }: GraphQLContext
  ) => Promise<TrackAttributes[]>;
  getTrackById: (
    _: null,
    { id }: GetTrackByIdArgs,
    { container, user }: any
  ) => Promise<TrackAttributes | null>;
}

interface MutationResolver {
  createTrack: (
    _: null,
    trackData: TrackCreationAttributes,
    { container, user }: GraphQLContext
  ) => Promise<TrackAttributes>;
  updateTrackById: (
    _: null,
    trackData: TrackUpdateAttributes,
    { container, user }: GraphQLContext
  ) => Promise<TrackAttributes | null>;
  deleteTrackById: (
    _: null,
    { id }: GetTrackByIdArgs,
    { container, user }: GraphQLContext
  ) => Promise<boolean>;
}

export interface TrackResolvers extends IResolvers {
  Track: TrackResolver;
  Query: QueryResolver;
  Mutation: MutationResolver;
}

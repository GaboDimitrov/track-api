import {
  TrackAttributes,
  TrackCreationAttributes,
  TrackUpdateAttributes,
} from "../../../models/init";
import { GraphQLContext } from "../../../server";
import {
  Format,
  GetTrackByIdArgs,
  GetTrackByNameAndArtistsArgs,
  TrackResolvers,
} from "./types";
import { TrackService } from "../../../services/trackService";
import { DATE_FORMAT, DURATION_FORMAT } from "../../../consts";
import { AuthenticationError } from "../../../errors";
import { addMilliseconds } from "date-fns";

export const trackResolvers: TrackResolvers = {
  Track: {
    artist_name: (track: TrackAttributes) => track.artistNames.join(", "),
    createdAt: (
      parent: TrackAttributes,
      _: unknown,
      { container }: GraphQLContext
    ) => {
      const format: Format = container.resolve("format");
      return format(parent.createdAt, DATE_FORMAT);
    },
    updatedAt: (
      parent: TrackAttributes,
      _: unknown,
      { container }: GraphQLContext
    ) => {
      const format: Format = container.resolve("format");
      return format(parent.updatedAt, DATE_FORMAT);
    },
    releaseDate: (
      parent: TrackAttributes,
      _: unknown,
      { container }: GraphQLContext
    ) => {
      const format: Format = container.resolve("format");
      return format(parent.releaseDate, DATE_FORMAT);
    },
    duration: (
      parent: TrackAttributes,
      _: unknown,
      { container }: GraphQLContext
    ) => {
      const format: Format = container.resolve("format");
      const startDate = new Date(0);
      const endDate = addMilliseconds(startDate, parent.duration);

      const formattedDuration = format(endDate, DURATION_FORMAT);
      return formattedDuration;
    },
  },
  Query: {
    getTrackByNameAndArtists: async (
      _: unknown,
      { name, artistNames }: GetTrackByNameAndArtistsArgs,
      { container, user }: GraphQLContext
    ) => {
      if (!user) {
        throw new AuthenticationError();
      }
      const trackService: TrackService = container.resolve("trackService");

      const track = await trackService.getTrackByNameAndArtists(
        name,
        artistNames
      );

      return track;
    },
    getAllTracks: (
      _: unknown,
      args: null,
      { container, user }: GraphQLContext
    ) => {
      if (!user) {
        throw new AuthenticationError();
      }
      const trackService: TrackService = container.resolve("trackService");
      return trackService.getAllTracks();
    },
    getTrackById: async (
      _: null,
      { id }: GetTrackByIdArgs,
      { container, user }
    ) => {
      if (!user) {
        throw new AuthenticationError();
      }

      const trackService: TrackService = container.resolve("trackService");
      const track = await trackService.getTrackById(id);

      return track;
    },
  },
  Mutation: {
    createTrack: (
      _: null,
      trackData: TrackCreationAttributes,
      { container, user }: GraphQLContext
    ) => {
      if (!user) {
        throw new AuthenticationError();
      }

      const trackService: TrackService = container.resolve("trackService");
      return trackService.createTrack(trackData);
    },

    updateTrackById: (
      _: null,
      trackData: TrackUpdateAttributes,
      { container, user }: GraphQLContext
    ) => {
      if (!user) {
        throw new AuthenticationError();
      }

      const trackService: TrackService = container.resolve("trackService");
      const track = trackService.updateTrackById(trackData);
      return track;
    },

    deleteTrackById: (
      _: null,
      { id }: GetTrackByIdArgs,
      { container, user }: GraphQLContext
    ) => {
      if (!user) {
        throw new AuthenticationError();
      }

      const trackService: TrackService = container.resolve("trackService");
      return trackService.deleteTrackById(id);
    },
  },
};

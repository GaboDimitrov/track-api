import { GraphQLError } from "graphql";
import { trackResolvers } from "../trackResolvers";
import { TrackAttributes } from "../../../models/init";
import { AwilixContainerMock, TrackServiceMock } from "./mocks";
import { AuthenticationError, TrackNotFoundError } from "../../../errors";
import { DURATION_FORMAT } from "../../../consts";

const DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";

describe("trackResolvers", () => {
  const trackServiceMock: TrackServiceMock = {
    getTrackByNameAndArtists: jest.fn(),
    getAllTracks: jest.fn(),
    getTrackById: jest.fn(),
    createTrack: jest.fn(),
    updateTrackById: jest.fn(),
    deleteTrackById: jest.fn(),
  };
  const formatMock = jest.fn();

  const containerMock: AwilixContainerMock = {
    resolve: jest.fn().mockImplementation((service) => {
      if (service === "trackService") return trackServiceMock;
      if (service === "format") return formatMock;
    }),
  };

  beforeEach(() => {
    trackServiceMock.updateTrackById.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("trackResolvers", () => {
    const track: TrackAttributes = {
      id: 1,
      name: "Test Track",
      artistNames: ["Artist1", "Artist2"],
      duration: 300,
      ISRC: "ISRC123",
      releaseDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    describe("Track resolver", () => {
      describe("artist_name", () => {
        test("returns formatted artist names", () => {
          const result = trackResolvers.Track.artist_name(track);
          expect(result).toBe("Artist1, Artist2");
        });

        test("returns formatted artist name", () => {
          const result = trackResolvers.Track.artist_name({
            ...track,
            artistNames: ["Artist 1"],
          });
          expect(result).toBe("Artist 1");
        });
      });

      describe("duration", () => {
        test("returns formatted duration", () => {
          formatMock.mockReturnValue("04:20");
          const endDate = new Date("1970-01-01T00:00:00.300Z");
          const result = trackResolvers.Track.duration(track, null, {
            container: containerMock,
            user: null,
          });
          expect(containerMock.resolve).toHaveBeenCalledWith("format");
          expect(formatMock).toHaveBeenCalledWith(endDate, DURATION_FORMAT);
          expect(result).toBe("04:20");
        });
      });

      describe("createdAt", () => {
        test("returns formatted createdAt", () => {
          formatMock.mockReturnValue("2023-12-14 10:43:00");
          const result = trackResolvers.Track.createdAt(track, null, {
            container: containerMock,
            user: null,
          });
          expect(containerMock.resolve).toHaveBeenCalledWith("format");
          expect(formatMock).toHaveBeenCalledWith(track.createdAt, DATE_FORMAT);
          expect(result).toBe("2023-12-14 10:43:00");
        });
      });

      describe("updatedAt", () => {
        test("returns formatted updatedAt", () => {
          formatMock.mockReturnValue("2023-12-14 10:43:00");
          const result = trackResolvers.Track.updatedAt(track, null, {
            container: containerMock,
            user: null,
          });
          expect(containerMock.resolve).toHaveBeenCalledWith("format");
          expect(formatMock).toHaveBeenCalledWith(track.updatedAt, DATE_FORMAT);
          expect(result).toBe("2023-12-14 10:43:00");
        });
      });

      describe("releaseDate", () => {
        test("returns formatted releaseDate", () => {
          formatMock.mockReturnValue("formattedDate");
          const result = trackResolvers.Track.releaseDate(track, null, {
            container: containerMock,
            user: null,
          });
          expect(containerMock.resolve).toHaveBeenCalledWith("format");
          expect(formatMock).toHaveBeenCalledWith(
            track.releaseDate,
            DATE_FORMAT
          );
          expect(result).toBe("formattedDate");
        });
      });
    });

    describe("Query", () => {
      const user = { id: 1, username: "testuser" };

      describe("getTrackByNameAndArtists", () => {
        test("returns track if found by name and artist", async () => {
          const args = { name: "Test Track", artistNames: ["Artist1"] };
          const resultData = track;
          trackServiceMock.getTrackByNameAndArtists.mockResolvedValue(
            resultData
          );

          const result = await trackResolvers.Query.getTrackByNameAndArtists(
            null,
            args,
            { container: containerMock, user }
          );

          expect(containerMock.resolve).toHaveBeenCalledWith("trackService");
          expect(
            trackServiceMock.getTrackByNameAndArtists
          ).toHaveBeenCalledWith(args.name, args.artistNames);
          expect(result).toBe(resultData);
        });

        test("should throw error if user is NOT authenticated", async () => {
          const args = { name: "Test Track", artistNames: ["Artist1"] };

          trackServiceMock.getTrackByNameAndArtists.mockResolvedValue(track);

          expect(
            async () =>
              await trackResolvers.Query.getTrackByNameAndArtists(null, args, {
                container: containerMock,
                user: null,
              })
          ).rejects.toThrow(AuthenticationError);
        });
      });

      describe("getAllTracks", () => {
        test("should return array of tracks", async () => {
          const resultData = [track];
          trackServiceMock.getAllTracks.mockResolvedValue(resultData);

          const result = await trackResolvers.Query.getAllTracks(null, null, {
            container: containerMock,
            user,
          });

          expect(containerMock.resolve).toHaveBeenCalledWith("trackService");
          expect(trackServiceMock.getAllTracks).toHaveBeenCalled();
          expect(result).toBe(resultData);
        });

        test("should return empty array if there are no tracks", async () => {
          const resultData = Array.from([]);
          trackServiceMock.getAllTracks.mockResolvedValue(resultData);

          const result = await trackResolvers.Query.getAllTracks(null, null, {
            container: containerMock,
            user,
          });

          expect(containerMock.resolve).toHaveBeenCalledWith("trackService");
          expect(trackServiceMock.getAllTracks).toHaveBeenCalled();
          expect(result).toBe(resultData);
        });

        test("should throw error if user is NOT authenticated", async () => {
          const resultData = Array.from([]);
          trackServiceMock.getAllTracks.mockResolvedValue(resultData);

          expect(
            async () =>
              await trackResolvers.Query.getAllTracks(null, null, {
                container: containerMock,
                user: null,
              })
          ).rejects.toThrow(GraphQLError);
        });
      });

      describe("getTrackById", () => {
        test("should return track by Id", async () => {
          const args = { id: 1 };
          const resultData = track;
          trackServiceMock.getTrackById.mockResolvedValue(resultData);

          const result = await trackResolvers.Query.getTrackById(null, args, {
            container: containerMock,
            user,
          });

          expect(containerMock.resolve).toHaveBeenCalledWith("trackService");
          expect(trackServiceMock.getTrackById).toHaveBeenCalledWith(args.id);
          expect(result).toBe(resultData);
        });

        test("should throw error if track with provided Id is not found", async () => {
          const args = { id: 1 };
          trackServiceMock.getTrackById.mockRejectedValue(
            new TrackNotFoundError("Track with id: 1 not found")
          );

          expect(
            async () =>
              await trackResolvers.Query.getTrackById(null, args, {
                container: containerMock,
                user,
              })
          ).rejects.toThrow(TrackNotFoundError);
        });

        test("should throw error if user is NOT authenticated", async () => {
          const args = { id: 1 };
          const resultData = null;
          trackServiceMock.getTrackById.mockResolvedValue(resultData);

          expect(
            async () =>
              await trackResolvers.Query.getTrackById(null, args, {
                container: containerMock,
                user: null,
              })
          ).rejects.toThrow(GraphQLError);
        });
      });
    });

    describe("Mutation", () => {
      const user = { id: 1, username: "testuser" };

      describe("createTrack", () => {
        test("should create new track", async () => {
          const trackData = {
            name: "New Track",
            artistNames: ["Artist1"],
            duration: 200,
            ISRC: "ISRC1234",
            releaseDate: new Date(),
          };
          const resultData = track;
          trackServiceMock.createTrack.mockResolvedValue(resultData);

          const result = await trackResolvers.Mutation.createTrack(
            null,
            trackData,
            { container: containerMock, user }
          );

          expect(containerMock.resolve).toHaveBeenCalledWith("trackService");
          expect(trackServiceMock.createTrack).toHaveBeenCalledWith(trackData);
          expect(result).toBe(resultData);
        });

        test("should throw error if user is NOT authenticated", async () => {
          const trackData = {
            name: "New Track",
            artistNames: ["Artist1"],
            duration: 200,
            ISRC: "ISRC1234",
            releaseDate: new Date(),
          };
          const resultData = track;
          trackServiceMock.createTrack.mockResolvedValue(resultData);

          expect(
            async () =>
              await trackResolvers.Mutation.createTrack(null, trackData, {
                container: containerMock,
                user: null,
              })
          ).rejects.toThrow(GraphQLError);
        });
      });
      describe("updateTrackById", () => {
        test("should Update track if found by Id", async () => {
          const trackData = {
            id: 1,
            name: "Updated Track",
            artistNames: ["Artist1"],
            duration: 210,
            ISRC: "ISRC1234",
            releaseDate: new Date(),
          };
          const resultData = track;
          trackServiceMock.updateTrackById.mockResolvedValue(resultData);

          const result = await trackResolvers.Mutation.updateTrackById(
            null,
            trackData,
            { container: containerMock, user }
          );

          expect(containerMock.resolve).toHaveBeenCalledWith("trackService");
          expect(trackServiceMock.updateTrackById).toHaveBeenCalledWith(
            trackData
          );
          expect(result).toBe(resultData);
        });

        test("should throw error if track is NOT found by Id", async () => {
          const trackData = {
            id: 1,
            name: "Updated Track",
            artistNames: ["Artist1"],
            duration: 210,
            ISRC: "ISRC1234",
            releaseDate: new Date(),
          };
          trackServiceMock.updateTrackById.mockRejectedValue(
            new TrackNotFoundError("Track with id: 1 not found")
          );

          expect(
            async () =>
              await trackResolvers.Mutation.updateTrackById(null, trackData, {
                container: containerMock,
                user,
              })
          ).rejects.toThrow(TrackNotFoundError);
        });

        test("should throw error if user is NOT authenticated", async () => {
          const trackData = {
            id: 1,
            name: "Updated Track",
            artistNames: ["Artist1"],
            duration: 210,
            ISRC: "ISRC1234",
            releaseDate: new Date(),
          };

          expect(
            async () =>
              await trackResolvers.Mutation.updateTrackById(null, trackData, {
                container: containerMock,
                user: null,
              })
          ).rejects.toThrow(AuthenticationError);
        });
      });

      describe("deleteTrackById", () => {
        test("should delete track if found by Id", async () => {
          const args = { id: 1 };
          const resultData = true;
          trackServiceMock.deleteTrackById.mockResolvedValue(resultData);

          const result = await trackResolvers.Mutation.deleteTrackById(
            null,
            args,
            {
              container: containerMock,
              user,
            }
          );

          expect(containerMock.resolve).toHaveBeenCalledWith("trackService");
          expect(trackServiceMock.deleteTrackById).toHaveBeenCalledWith(
            args.id
          );
          expect(result).toBe(resultData);
        });

        test("should throw error if user is NOT authenticated", async () => {
          const args = { id: 1 };
          const trackData = {
            id: 1,
            name: "Updated Track",
            artistNames: ["Artist1"],
            duration: 210,
            ISRC: "ISRC1234",
            releaseDate: new Date(),
          };
          trackServiceMock.updateTrackById.mockRejectedValue(trackData);

          expect(
            async () =>
              await trackResolvers.Mutation.deleteTrackById(null, args, {
                container: containerMock,
                user: null,
              })
          ).rejects.toThrow(GraphQLError);
        });
      });
    });
  });
});

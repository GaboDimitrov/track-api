import { TrackDataSource } from "../../dataSource/trackDataSource";
import { TrackNotFoundError } from "../../errors";
import {
  TrackAttributes,
  TrackCreationAttributes,
  TrackUpdateAttributes,
} from "../../models/init";
import {
  TrackRepository,
  trackRepository,
} from "../../repositories/trackRepository";
import { TrackRaw, trackService } from "../trackService";

describe("trackService", () => {
  const trackRepositoryMock: jest.Mocked<TrackRepository> = {
    createTrack: jest.fn(),
    getTrackByNameAndArtists: jest.fn(),
    getAllTracks: jest.fn(),
    getTrackById: jest.fn(),
    updateTrack: jest.fn(),
    deleteTrackById: jest.fn(),
  };

  const trackDataSourceMock: jest.Mocked<TrackDataSource> = {
    getTrackByNameAndArtists: jest.fn(),
  };

  const service = trackService({
    trackRepository: trackRepositoryMock,
    trackDataSource: trackDataSourceMock,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTrackByNameAndArtists", () => {
    test("should return track if found in repository", async () => {
      const mockTrack: TrackAttributes = {
        id: 1,
        name: "Test Track",
        artistNames: ["Artist1"],
        duration: 300,
        ISRC: "123456789",
        releaseDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      trackRepositoryMock.getTrackByNameAndArtists.mockResolvedValue(mockTrack);

      const result = await service.getTrackByNameAndArtists("Test Track", [
        "Artist1",
      ]);

      expect(trackRepositoryMock.getTrackByNameAndArtists).toHaveBeenCalledWith(
        "Test Track",
        ["Artist1"]
      );
      expect(
        trackDataSourceMock.getTrackByNameAndArtists
      ).not.toHaveBeenCalled();
      expect(result).toEqual(mockTrack);
    });

    test("should fetch from external data source and create track if not found in repository", async () => {
      const rawTrackMock: TrackRaw = {
        name: "Test Track",
        duration_ms: 300000,
        isrc: "123456789",
        artists: [{ name: "Artist1" }],
        album: { release_date: "2021-01-01" },
      };

      const mockTrack: TrackAttributes = {
        id: 1,
        name: "Test Track",
        artistNames: ["Artist1"],
        duration: 300000,
        ISRC: "123456789",
        releaseDate: new Date("2021-01-01"),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      trackRepositoryMock.getTrackByNameAndArtists.mockResolvedValue(null);

      trackDataSourceMock.getTrackByNameAndArtists.mockResolvedValue([
        rawTrackMock,
      ]);

      trackRepositoryMock.createTrack.mockResolvedValue(mockTrack);

      const result = await service.getTrackByNameAndArtists("Test Track", [
        "Artist1",
      ]);

      expect(trackRepositoryMock.getTrackByNameAndArtists).toHaveBeenCalledWith(
        "Test Track",
        ["Artist1"]
      );
      expect(trackDataSourceMock.getTrackByNameAndArtists).toHaveBeenCalledWith(
        "Test Track",
        ["Artist1"]
      );
      expect(trackRepositoryMock.createTrack).toHaveBeenCalledWith({
        name: "Test Track",
        artistNames: ["Artist1"],
        duration: 300000,
        ISRC: "123456789",
        releaseDate: new Date("2021-01-01"),
      });
      expect(result).toEqual(mockTrack);
    });

    test("should throw error if track not found in repository and external data source", async () => {
      trackRepositoryMock.getTrackByNameAndArtists.mockResolvedValue(null);
      trackDataSourceMock.getTrackByNameAndArtists.mockResolvedValue([]);

      await expect(
        service.getTrackByNameAndArtists("Test Track", ["Artist1"])
      ).rejects.toThrow(TrackNotFoundError);

      expect(trackRepositoryMock.getTrackByNameAndArtists).toHaveBeenCalledWith(
        "Test Track",
        ["Artist1"]
      );
      expect(trackDataSourceMock.getTrackByNameAndArtists).toHaveBeenCalledWith(
        "Test Track",
        ["Artist1"]
      );
    });
  });

  describe("getAllTracks", () => {
    test("should return all tracks", async () => {
      const mockTracks: TrackAttributes[] = [
        {
          id: 1,
          name: "Track 1",
          artistNames: ["Artist 1"],
          duration: 200,
          ISRC: "123456789",
          releaseDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      trackRepositoryMock.getAllTracks.mockResolvedValue(mockTracks);

      const result = await service.getAllTracks();

      expect(trackRepositoryMock.getAllTracks).toHaveBeenCalled();
      expect(result).toEqual(mockTracks);
    });
  });

  describe("updateTrackById", () => {
    test("should update and return track if found", async () => {
      const mockTrack: TrackAttributes = {
        id: 1,
        name: "Updated Track",
        artistNames: ["Updated Artist"],
        duration: 400,
        ISRC: "987654321",
        releaseDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updateData: TrackUpdateAttributes = {
        id: 1,
        name: "Updated Track",
        artistNames: ["Updated Artist"],
        duration: 400,
        ISRC: "987654321",
        releaseDate: new Date(),
      };
      trackRepositoryMock.updateTrack.mockResolvedValue(mockTrack);

      const result = await service.updateTrackById(updateData);

      expect(trackRepositoryMock.updateTrack).toHaveBeenCalledWith(updateData);
      expect(result).toEqual(mockTrack);
    });

    test("should throw error if track not found", async () => {
      const updateData: TrackUpdateAttributes = {
        id: 1,
        name: "Updated Track",
        artistNames: ["Updated Artist"],
        duration: 400,
        ISRC: "987654321",
        releaseDate: new Date(),
      };
      trackRepositoryMock.updateTrack.mockResolvedValue(null);

      await expect(service.updateTrackById(updateData)).rejects.toThrow(
        TrackNotFoundError
      );

      expect(trackRepositoryMock.updateTrack).toHaveBeenCalledWith(updateData);
    });
  });

  describe("createTrack", () => {
    test("should create and return track", async () => {
      const mockTrack: TrackAttributes = {
        id: 1,
        name: "New Track",
        artistNames: ["New Artist"],
        duration: 250,
        ISRC: "1122334455",
        releaseDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const createData: TrackCreationAttributes = {
        name: "New Track",
        artistNames: ["New Artist"],
        duration: 250,
        ISRC: "1122334455",
        releaseDate: new Date(),
      };
      trackRepositoryMock.createTrack.mockResolvedValue(mockTrack);

      const result = await service.createTrack(createData);

      expect(trackRepositoryMock.createTrack).toHaveBeenCalledWith(createData);
      expect(result).toEqual(mockTrack);
    });
  });

  describe("getTrackById", () => {
    test("should return track if found", async () => {
      const mockTrack: TrackAttributes = {
        id: 1,
        name: "Track 1",
        artistNames: ["Artist 1"],
        duration: 200,
        ISRC: "123456789",
        releaseDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      trackRepositoryMock.getTrackById.mockResolvedValue(mockTrack);

      const result = await service.getTrackById(1);

      expect(trackRepositoryMock.getTrackById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTrack);
    });

    test("should throw error if track not found", async () => {
      trackRepositoryMock.getTrackById.mockResolvedValue(null);

      await expect(service.getTrackById(1)).rejects.toThrow(TrackNotFoundError);

      expect(trackRepositoryMock.getTrackById).toHaveBeenCalledWith(1);
    });
  });

  describe("deleteTrackById", () => {
    test("should return true if track is deleted", async () => {
      trackRepositoryMock.deleteTrackById.mockResolvedValue(true);

      const result = await service.deleteTrackById(1);

      expect(trackRepositoryMock.deleteTrackById).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    test("should return false if track is not found", async () => {
      trackRepositoryMock.deleteTrackById.mockResolvedValue(false);

      const result = await service.deleteTrackById(1);

      expect(trackRepositoryMock.deleteTrackById).toHaveBeenCalledWith(1);
      expect(result).toBe(false);
    });
  });
});

import { TrackRepository, trackRepository } from "../trackRepository";
import {
  Models,
  TrackCreationAttributes,
  TrackInstance,
  TrackUpdateAttributes,
} from "../../models/init";

import { trackMock, userMock } from "./mocks";

describe("trackRepository", () => {
  const models: Models = { Track: trackMock, User: userMock };
  let repository: TrackRepository = trackRepository({
    models,
  });

  const mockTracks = [
    {
      id: 1,
      name: "Test Track",
      artistNames: ["Artist1"],
      duration: 300,
      isrc: "123456789",
      releaseDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as TrackInstance,
  ];

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("getTrackByNameAndArtists", () => {
    test("it returns track when found by name and artist", async () => {
      trackMock.findAll.mockResolvedValue(mockTracks);
      const result = await repository.getTrackByNameAndArtists("Test Track", [
        "Artist1",
      ]);
      expect(trackMock.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockTracks[0]);
    });
    test("it returns the first track when found by name and partial artist name", async () => {
      const mockTracks = [
        {
          id: 1,
          name: "Test Track",
          artistNames: ["Artist2"],
          duration: 300,
          isrc: "123456789",
          releaseDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        } as TrackInstance,
        {
          id: 2,
          name: "Test Track",
          artistNames: ["Artist1"],
          duration: 300,
          isrc: "123456789",
          releaseDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        } as TrackInstance,
      ];
      trackMock.findAll.mockResolvedValue(mockTracks);
      const result = await repository.getTrackByNameAndArtists("Test Track", [
        "Art",
      ]);
      expect(trackMock.findAll).toHaveBeenCalled();
      expect(result?.artistNames).toEqual(["Artist2"]);
    });

    test("should return null if no track found by name and artist", async () => {
      trackMock.findAll.mockResolvedValue([]);
      const result = await repository.getTrackByNameAndArtists("Test Track", [
        "Artist1",
      ]);
      expect(trackMock.findAll).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
  describe("getAllTracks", () => {
    test("should return all tracks", async () => {
      trackMock.findAll.mockResolvedValue(mockTracks);
      const result = await repository.getAllTracks();
      expect(trackMock.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockTracks);
    });
  });
  describe("getTrackById", () => {
    test("should return track if found by id", async () => {
      const date = new Date();
      const mockTrack = {
        get: () => ({
          id: 1,
          name: "Test Track",
          artistNames: ["Artist1"],
          duration: 300,
          isrc: "123456789",
          releaseDate: date,
          createdAt: date,
          updatedAt: date,
        }),
      } as TrackInstance;

      trackMock.findByPk.mockResolvedValue(mockTrack);
      const result = await repository.getTrackById(1);
      expect(trackMock.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTrack.get());
    });
    test("should return null if track not found by id", async () => {
      trackMock.findByPk.mockResolvedValue(null);
      const result = await repository.getTrackById(1);
      expect(trackMock.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBeNull();
    });
  });
  describe("updateTrack", () => {
    test("should update and return track if found", async () => {
      const mockTrack: TrackInstance = {
        get: jest.fn().mockReturnValue({
          id: 1,
          name: "Updated Track",
          artistNames: ["Updated Artist"],
          duration: 400,
          isrc: "987654321",
          releaseDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        update: jest.fn(),
      } as unknown as TrackInstance;
      trackMock.findByPk.mockResolvedValue(mockTrack);
      const updateData: TrackUpdateAttributes = {
        id: 1,
        name: "Updated Track",
        artistNames: ["Updated Artist"],
        duration: 400,
        isrc: "987654321",
        releaseDate: new Date(),
      };
      const result = await repository.updateTrack(updateData);
      expect(trackMock.findByPk).toHaveBeenCalledWith(updateData.id);
      expect(mockTrack.update).toHaveBeenCalledWith(updateData);
      expect(result).toEqual(mockTrack.get());
    });
    test("should throw error if track not found", async () => {
      trackMock.findByPk.mockResolvedValue(null);
      const updateData: TrackUpdateAttributes = {
        id: 1,
        name: "Updated Track",
        artistNames: ["Updated Artist"],
        duration: 400,
        isrc: "987654321",
        releaseDate: new Date(),
      };
      await expect(repository.updateTrack(updateData)).rejects.toThrow(
        "Track with ID 1 does not exist"
      );
      expect(trackMock.findByPk).toHaveBeenCalledWith(updateData.id);
    });
  });
  describe("createTrack", () => {
    test("should create and return track", async () => {
      const releaseDate = new Date();
      const mockTrack = {
        get: () => ({
          id: 1,
          name: "New Track",
          artistNames: ["New Artist"],
          duration: 250,
          isrc: "1122334455",
          releaseDate,
        }),
      } as TrackInstance;
      const createData: TrackCreationAttributes = {
        name: "New Track",
        artistNames: ["New Artist"],
        duration: 250,
        isrc: "1122334455",
        releaseDate,
      };
      trackMock.create.mockResolvedValue(mockTrack);
      const result = await repository.createTrack(createData);
      expect(trackMock.create).toHaveBeenCalledWith(createData);
      expect(result).toEqual(mockTrack.get());
    });
  });
  describe("deleteTrackById", () => {
    test("should return true if track is deleted", async () => {
      trackMock.destroy.mockResolvedValue(1);
      const result = await repository.deleteTrackById(1);
      expect(trackMock.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBe(true);
    });
    test("should return false if track is not found", async () => {
      trackMock.destroy.mockResolvedValue(0);
      const result = await repository.deleteTrackById(1);
      expect(trackMock.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBe(false);
    });
  });
});

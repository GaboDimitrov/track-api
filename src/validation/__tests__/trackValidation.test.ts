import {
  createTrack,
  updateTrack,
  getTrackByNameAndArtists,
} from "../trackValidation";

describe("TrackValidation", () => {
  describe("createTrack schema", () => {
    const validData = {
      name: "Valid Track Name",
      artistNames: ["Artist One", "Artist Two"],
      duration: 300,
      isrc: "ISRC001",
      releaseDate: "2022-01-01",
    };

    test("valid data passes", () => {
      const { error } = createTrack.validate(validData);
      expect(error).toBeUndefined();
    });

    test("name validation", () => {
      const invalidData = { ...validData, name: "" };
      const { error } = createTrack.validate(invalidData);
      expect(error?.details[0].message).toBe("Track name cannot be empty");

      invalidData.name = "ab";
      const { error: error2 } = createTrack.validate(invalidData);
      expect(error2?.details[0].message).toBe(
        "Track name must be at least 3 characters long"
      );
    });

    test("artistNames validation", () => {
      const invalidData = { ...validData, artistNames: [""] };
      const { error } = createTrack.validate(invalidData);
      expect(error?.details[0].message).toBe("Artist name cannot be empty");

      invalidData.artistNames = ["a"];
      const { error: error2 } = createTrack.validate(invalidData);
      expect(error2?.details[0].message).toBe(
        "Each artist name must be at least 3 characters long"
      );

      invalidData.artistNames = [];
      const { error: error3 } = createTrack.validate(invalidData);
      expect(error3?.details[0].message).toBe(
        "Artist names array cannot be empty"
      );
    });

    test("duration validation", () => {
      const invalidData = { ...validData, duration: undefined };
      const { error } = createTrack.validate(invalidData);
      expect(error?.details[0].message).toBe('"duration" is required');
    });

    test("isrc validation", () => {
      const invalidData = { ...validData, isrc: "" };
      const { error } = createTrack.validate(invalidData);
      expect(error?.details[0].message).toBe("ISRS name cannot be empty");

      invalidData.isrc = "a";
      const { error: error2 } = createTrack.validate(invalidData);
      expect(error2?.details[0].message).toBe(
        "ISRS must be at least 2 characters long"
      );
    });

    test("releaseDate validation", () => {
      const invalidData = { ...validData, releaseDate: "" };
      const { error } = createTrack.validate(invalidData);
      expect(error?.details[0].message).toBe(
        "Release date must be in ISO format (YYYY-MM-DD)"
      );
    });
  });

  describe("updateTrack schema", () => {
    const validData = {
      id: 1,
      name: "Updated Track Name",
      artistNames: ["Artist One", "Artist Two"],
      duration: 300,
      isrc: "ISRC001",
      releaseDate: "2022-01-01",
    };

    test("valid data passes", () => {
      const { error } = updateTrack.validate(validData);
      expect(error).toBeUndefined();
    });

    test("id validation", () => {
      const invalidData = { ...validData, id: undefined };
      const { error } = updateTrack.validate(invalidData);
      expect(error?.details[0].message).toBe('"id" is required');
    });

    test("name validation", () => {
      const invalidData = { ...validData, name: "" };
      const { error } = updateTrack.validate(invalidData);
      expect(error?.details[0].message).toBe("Track name cannot be empty");

      invalidData.name = "ab";
      const { error: error2 } = updateTrack.validate(invalidData);
      expect(error2?.details[0].message).toBe(
        "Track name must be at least 3 characters long"
      );
    });

    test("artistNames validation", () => {
      const invalidData = { ...validData, artistNames: [""] };
      const { error } = updateTrack.validate(invalidData);
      expect(error?.details[0].message).toBe("Artist name cannot be empty");

      invalidData.artistNames = ["a"];
      const { error: error2 } = updateTrack.validate(invalidData);
      expect(error2?.details[0].message).toBe(
        "Each artist name must be at least 3 characters long"
      );

      invalidData.artistNames = [];
      const { error: error3 } = updateTrack.validate(invalidData);
      expect(error3?.details[0].message).toBe(
        "Artist names array cannot be empty"
      );
    });

    test("isrc validation", () => {
      const invalidData = { ...validData, isrc: "" };
      const { error } = updateTrack.validate(invalidData);
      expect(error?.details[0].message).toBe("ISRS name cannot be empty");

      invalidData.isrc = "a";
      const { error: error2 } = updateTrack.validate(invalidData);
      expect(error2?.details[0].message).toBe(
        "ISRS must be at least 2 characters long"
      );
    });

    test("releaseDate validation", () => {
      const invalidData = { ...validData, releaseDate: "" };
      const { error } = updateTrack.validate(invalidData);
      expect(error?.details[0].message).toBe(
        "Release date must be in ISO format (YYYY-MM-DD)"
      );
    });
  });

  describe("getTrackByNameAndArtists schema", () => {
    const validData = {
      name: "Track Name",
      artistNames: ["Artist One", "Artist Two"],
    };

    test("valid data passes", () => {
      const { error } = getTrackByNameAndArtists.validate(validData);
      expect(error).toBeUndefined();
    });

    test("name validation", () => {
      const invalidData = { ...validData, name: "" };
      const { error } = getTrackByNameAndArtists.validate(invalidData);
      expect(error?.details[0].message).toBe("Track name cannot be empty");

      invalidData.name = "ab";
      const { error: error2 } = getTrackByNameAndArtists.validate(invalidData);
      expect(error2?.details[0].message).toBe(
        "Track name must be at least 3 characters long"
      );
    });

    test("artistNames validation", () => {
      const invalidData = { ...validData, artistNames: [""] };
      const { error } = getTrackByNameAndArtists.validate(invalidData);
      expect(error?.details[0].message).toBe("Artist name cannot be empty");

      invalidData.artistNames = ["a"];
      const { error: error2 } = getTrackByNameAndArtists.validate(invalidData);
      expect(error2?.details[0].message).toBe(
        "Each artist name must be at least 3 characters long"
      );

      invalidData.artistNames = [];
      const { error: error3 } = getTrackByNameAndArtists.validate(invalidData);
      expect(error3?.details[0].message).toBe(
        "Artist names array cannot be empty"
      );
    });
  });
});

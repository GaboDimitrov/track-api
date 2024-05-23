import { Axios } from "axios";
import { AxiosGet } from "../trackDataSource";
import { Config } from "../../config";
import { trackDataSource } from "../trackDataSource/trackDataSource";
import { TrackRaw } from "../../services/trackService";
import { DataSourceError } from "../../errors";

describe("trackDataSource", () => {
  const axiosMock: jest.Mocked<AxiosGet> = {
    get: jest.fn(),
  };

  const configMock: Config = {
    ACR_CLOUD_API_URL: "cloud.api",
    ACR_CLOUD_ACCESS_TOKEN: "eytoken",
    DATABASE_URL: "",
    JWT_SECRET: "",
  };

  const dataSource = trackDataSource({ axios: axiosMock, config: configMock });

  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe("getTrackByNameAndArtists", () => {
    test("returns track data if API call is successful", async () => {
      const mockTrackRaw: TrackRaw = {
        name: "Test Track",
        artists: [{ name: "Artist1" }],
        duration_ms: 300000,
        isrc: "123456789",
        album: { release_date: "2021-01-01" },
      };
      const mockResponse = { data: { data: [mockTrackRaw] } };
      axiosMock.get.mockResolvedValue(mockResponse);

      const result = await dataSource.getTrackByNameAndArtists("Test Track", [
        "Artist1",
      ]);

      expect(axiosMock.get).toHaveBeenCalledWith(
        configMock.ACR_CLOUD_API_URL,
        expect.objectContaining({
          method: "get",
          maxBodyLength: Infinity,
          params: {
            query: JSON.stringify({
              track: "Test Track",
              artists: ["Artist1"],
            }),
            format: "json",
          },
          headers: {
            Authorization: `Bearer ${configMock.ACR_CLOUD_ACCESS_TOKEN}`,
          },
        })
      );
      expect(result).toEqual([mockTrackRaw]);
    });

    test("throws error if API call fails with error", async () => {
      const mockError = new Error("API call failed");
      axiosMock.get.mockRejectedValue(mockError);

      await expect(
        dataSource.getTrackByNameAndArtists("Test Track", ["Artist1"])
      ).rejects.toThrow(DataSourceError);

      expect(axiosMock.get).toHaveBeenCalledWith(
        configMock.ACR_CLOUD_API_URL,
        expect.objectContaining({
          method: "get",
          maxBodyLength: Infinity,
          params: {
            query: JSON.stringify({
              track: "Test Track",
              artists: ["Artist1"],
            }),
            format: "json",
          },
          headers: {
            Authorization: `Bearer ${configMock.ACR_CLOUD_ACCESS_TOKEN}`,
          },
        })
      );
    });

    test("throws error if API call fails with other than error", async () => {
      const mockError = "ERROR";
      axiosMock.get.mockRejectedValue(mockError);

      await expect(
        dataSource.getTrackByNameAndArtists("Test Track", ["Artist1"])
      ).rejects.toThrow(DataSourceError);

      expect(axiosMock.get).toHaveBeenCalledWith(
        configMock.ACR_CLOUD_API_URL,
        expect.objectContaining({
          method: "get",
          maxBodyLength: Infinity,
          params: {
            query: JSON.stringify({
              track: "Test Track",
              artists: ["Artist1"],
            }),
            format: "json",
          },
          headers: {
            Authorization: `Bearer ${configMock.ACR_CLOUD_ACCESS_TOKEN}`,
          },
        })
      );
    });
  });
});

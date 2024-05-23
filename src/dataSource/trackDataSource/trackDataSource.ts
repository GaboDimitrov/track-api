import { Config } from "../../config";
import { DataSourceError } from "../../errors";
import { TrackRaw } from "../../services/trackService";
import { AxiosGet, TrackDataSource } from "./types";

export const trackDataSource = ({
  axios,
  config,
}: {
  axios: AxiosGet;
  config: Config;
}): TrackDataSource => {
  const getTrackByNameAndArtists = async (
    name: string,
    artistNames: string[]
  ) => {
    try {
      const response = await axios.get<{ data: TrackRaw[] }>(
        config.ACR_CLOUD_API_URL,
        {
          method: "get",
          maxBodyLength: Infinity,
          params: {
            query: JSON.stringify({
              track: name,
              artists: artistNames,
            }),
            format: "json",
          },
          headers: {
            Authorization: `Bearer ${config.ACR_CLOUD_ACCESS_TOKEN}`,
          },
        }
      );

      const { data } = response.data;

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new DataSourceError(`Failed to fetch from data source`, error);
      }
      throw new DataSourceError(`Failed to fetch from data source`);
    }
  };

  return {
    getTrackByNameAndArtists,
  };
};

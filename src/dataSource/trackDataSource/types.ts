import { Axios } from "axios";
import { TrackRaw } from "../../services/trackService";

export type AxiosGet = Pick<Axios, "get">;
export interface TrackDataSource {
  getTrackByNameAndArtists(
    name: string,
    artistNames: string[]
  ): Promise<TrackRaw[]>;
}

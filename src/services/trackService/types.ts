import {
  TrackAttributes,
  TrackCreationAttributes,
  TrackUpdateAttributes,
} from "../../models/init";

export interface TrackService {
  getTrackByNameAndArtists(
    name: string,
    artists: string[]
  ): Promise<TrackAttributes | null>;
  getAllTracks(): Promise<TrackAttributes[]>;
  getTrackById(id: number): Promise<TrackAttributes | null>;
  createTrack(trackData: TrackCreationAttributes): Promise<TrackAttributes>;
  updateTrackById(
    trackData: TrackUpdateAttributes
  ): Promise<TrackAttributes | null>;
  deleteTrackById(id: number): Promise<boolean>;
}

export interface TrackRaw {
  name: string;
  duration_ms: number;
  isrc: string;
  artists: { name: string }[];
  album: { release_date: string };
}

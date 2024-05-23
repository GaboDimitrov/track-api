import {
  TrackAttributes,
  TrackCreationAttributes,
  TrackUpdateAttributes,
} from "../../models/init";

export interface TrackRepository {
  createTrack(trackData: TrackCreationAttributes): Promise<TrackAttributes>;
  getTrackByNameAndArtists(
    name: string,
    artistNames: string[]
  ): Promise<TrackAttributes | null>;
  getAllTracks(): Promise<TrackAttributes[]>;
  getTrackById(id: number): Promise<TrackAttributes | null>;
  updateTrack(
    trackData: TrackUpdateAttributes
  ): Promise<TrackAttributes | null>;

  deleteTrackById(id: number): Promise<boolean>;
}

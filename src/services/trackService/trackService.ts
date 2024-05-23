import {
  TrackAttributes,
  TrackCreationAttributes,
  TrackUpdateAttributes,
} from "../../models/init";
import { TrackRepository } from "../../repositories/trackRepository";
import { TrackNotFoundError } from "../../errors";
import { TrackService } from "./types";
import { TrackDataSource } from "../../dataSource/trackDataSource";

export const trackService = ({
  trackRepository,
  trackDataSource,
}: {
  trackRepository: TrackRepository;
  trackDataSource: TrackDataSource;
}): TrackService => {
  const getTrackByNameAndArtists = async (
    name: string,
    artistNames: string[]
  ): Promise<TrackAttributes | null> => {
    let track = await trackRepository.getTrackByNameAndArtists(
      name,
      artistNames
    );

    if (!track) {
      const data = await trackDataSource.getTrackByNameAndArtists(
        name,
        artistNames
      );

      if (data && data.length > 0) {
        const trackData = data[0];
        track = await trackRepository.createTrack({
          name: trackData.name,
          artistNames: trackData.artists.map((artist) => artist.name),
          duration: trackData.duration_ms,
          ISRC: trackData.isrc,
          releaseDate: new Date(trackData.album.release_date),
        });
      }
    }

    if (!track) {
      throw new TrackNotFoundError(
        `Track with name: ${name} and artist(s): ${artistNames.join(
          ", "
        )} not found`
      );
    }

    return track;
  };

  const getAllTracks = async (): Promise<TrackAttributes[]> => {
    return await trackRepository.getAllTracks();
  };

  const updateTrackById = async (
    trackData: TrackUpdateAttributes
  ): Promise<TrackAttributes | null> => {
    const track = await trackRepository.updateTrack(trackData);

    if (!track) {
      throw new TrackNotFoundError(`Track with id: ${trackData.id} not found`);
    }

    return track;
  };

  const createTrack = async (
    trackData: TrackCreationAttributes
  ): Promise<TrackAttributes> => {
    return await trackRepository.createTrack(trackData);
  };

  const getTrackById = async (id: number): Promise<TrackAttributes | null> => {
    const track = await trackRepository.getTrackById(id);

    if (!track) {
      throw new TrackNotFoundError(`Track with id: ${id} not found`);
    }

    return track;
  };

  const deleteTrackById = async (id: number): Promise<boolean> =>
    await trackRepository.deleteTrackById(id);

  return {
    createTrack,
    getTrackByNameAndArtists,
    getAllTracks,
    getTrackById,
    updateTrackById,
    deleteTrackById,
  };
};

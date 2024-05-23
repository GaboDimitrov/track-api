import { ModelStatic } from "sequelize";
import {
  TrackAttributes,
  TrackCreationAttributes,
  TrackInstance,
  TrackUpdateAttributes,
} from "../../models/init";
import { Models } from "../../models/init";
import { TrackRepository } from "./types";

export const trackRepository = ({
  models,
}: {
  models: Models;
}): TrackRepository => {
  const Track: ModelStatic<TrackInstance> = models.Track;

  const getTrackByNameAndArtists = async (
    name: string,
    artistNames: string[]
  ): Promise<TrackAttributes | null> => {
    // TODO: DB request can be improved
    const tracks = await Track.findAll({
      where: { name },
    });

    const filteredTracks = tracks.filter((track) => {
      return artistNames.some((artistName) =>
        track.artistNames.some((trackArtistName) =>
          new RegExp(artistName, "i").test(trackArtistName)
        )
      );
    });

    const track = filteredTracks.length ? filteredTracks[0] : null;
    return track;
  };

  const getAllTracks = async (): Promise<TrackAttributes[]> => {
    return await Track.findAll();
  };

  const getTrackById = async (id: number): Promise<TrackAttributes | null> => {
    const track = await Track.findByPk(id);
    return track ? track.get() : null;
  };

  const updateTrack = async (
    trackData: TrackUpdateAttributes
  ): Promise<TrackAttributes | null> => {
    const track = await Track.findByPk(trackData.id);
    if (!track) {
      throw new Error(`Track with ID ${trackData.id} does not exist`);
    }
    track.update(trackData);
    return track.get();
  };

  const createTrack = async (
    trackData: TrackCreationAttributes
  ): Promise<TrackAttributes> => {
    return (await Track.create(trackData)).get();
  };

  const deleteTrackById = async (id: number): Promise<boolean> => {
    const rowsDeleted = await Track.destroy({
      where: { id },
    });
    return rowsDeleted > 0;
  };

  return {
    createTrack,
    getTrackByNameAndArtists,
    getAllTracks,
    getTrackById,
    updateTrack,
    deleteTrackById,
  };
};

import { gql } from "graphql-tag";

export const trackTypeDefs = gql`
  type Track {
    id: ID!
    name: String!
    artist_name: String!
    duration: String!
    ISRC: String!
    releaseDate: String!
    createdAt: String!
    updatedAt: String!
  }

  input ArtistInput {
    name: String!
  }

  type Query {
    getTrackByNameAndArtists(name: String!, artistNames: [String!]!): Track
    getAllTracks: [Track!]!
    getTrackById(id: ID!): Track
  }

  type Mutation {
    createTrack(
      name: String!
      artistNames: [String!]!
      duration: Int!
      ISRC: String!
      releaseDate: String!
    ): Track!
    updateTrackById(
      id: ID!
      name: String
      artistNames: [String]
      duration: Int
      ISRC: String
      releaseDate: String
    ): Track
    deleteTrackById(id: ID!): Boolean!
  }
`;

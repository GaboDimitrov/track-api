# Track API

GraphQL API designed for searching, managing, and maintaining music tracks.

## Table of Contents

- [Introduction](#introduction)
- [Technologies](#technologies)
- [Installation](#installation)
- [Docker](#docker)
- [Usage](#usage)
- [Queries and Mutations](#queries-and-mutations)
- [Evaluation Criteria](#evaluation-criteria)

## Introduction

Track API is a GraphQL-based API built to help users search, manage, and maintain music tracks efficiently. It leverages the power of GraphQL to provide flexible and efficient querying capabilities.

## Technologies

The technologies used are:

- Node.js
- GraphQL
- TypeScript
- Sequelize
- PostgreSQL
- Joi
- Jest

## Installation

To get started with Track API, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/GaboDimitrov/track-api.git
   ```
2. Navigate to the project directory:
   ```bash
   cd track-api
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Set up the environment variables by updating the `.env` file in the root directory:
   ```plaintext
   DATABASE_URL=your_postgresdb_url | postgres://postgres:password@localhost:5433/trackdb - for use with docker compose
   ACR_CLOUD_API_URL=https://eu-api-v2.acrcloud.com/api/external-metadata/tracks
   ACR_CLOUD_ACCESS_TOKEN=acr_api_token
   JWT_SECRET=your_jwt_secret
   ```
5. Start the development server:

   ```bash
   npm run dev
   ```

## Docker

To start the application using Docker, follow these steps:

1. Ensure Docker is installed on your system.
2. Make sure that the DATABASE_URL is set to `postgres://postgres:password@postgres:5432/trackdb`
3. Run docker compose up --build

Docker will run the production build, so no hot reload will be applied

## Usage

Once the server is running, you can access the GraphQL playground at `http://localhost:4000` to interact with the API.

### Queries and mutations

#### Queries

- **getTrackByNameAndArtists**: Returns the first track found in the database that partially matches the track name and artist names. If a track is not found in the database, it will fetch the first occurrence from ACRCloud.
- **getAllTracks**: Returns all tracks from the database. Returns an empty array if there are no tracks.
- **getTrackById**: Returns a track by ID. Throws a 404 error if no track with this ID is found.

#### Mutations

- **createTrack**: Create a new track.
- **updateTrackById**: Updates an existing track found by ID. Throws a 404 error if no track is found.
- **deleteTrackById**: Deletes a track by ID. Returns true if the track is found and deleted, false if not.
- **register**: Registers a user. Accepts username and password, each with a minimum length of 4 characters.
- **login**: Logs in a user. Returns an authentication token used to authorize the user.

All queries and mutations require authorization, except for register and login. To authenticate, provide the Authorization header with the token returned from the login mutation (e.g., Authorization: eyJhbGciOiJIUz).

### Evaluation Criteria

1. Correct implementation of the GraphQL schema and resolvers: Each entity has its own schema and resolvers.
2. Proper error handling and response status codes: Custom errors such as AuthenticationError and DataSourceError are used, and errors are formatted to show meaningful information.
3. Use of TypeScript for type safety and clear type definitions: The codebase is strictly typed.
4. Overall code organization, readability, and best practices: The app is built using the DI pattern for better modularity and testability.
5. Tests properly written: The DI pattern makes mocking easier, leading to better tests.

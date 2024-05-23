import { AwilixContainer } from "awilix";
import { AuthService } from "../../../services/authService/types";
import { TrackService } from "../../../services/trackService";

export type AwilixContainerMock = jest.Mocked<
  Pick<AwilixContainer, "resolve">
> & {
  resolve: jest.Mock;
};

export type AuthServiceMock = jest.Mocked<AuthService>;
export type TrackServiceMock = jest.Mocked<TrackService>;

export const getContainerMock = <T>(service: T): AwilixContainerMock => {
  return {
    resolve: jest.fn().mockReturnValue(service),
  };
};

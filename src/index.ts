import { GraphQLContext, server } from "./server";
import { sequelize } from "./config";
import { startStandaloneServer } from "@apollo/server/standalone";
import { container } from "./container";
import { AuthService } from "./services/authService/types";
import { Sequelize } from "sequelize";
import { AwilixContainer } from "awilix";

export type StartStandaloneServer = typeof startStandaloneServer;

interface StartServer {
  sequelize: Pick<Sequelize, "authenticate" | "sync">;
  startStandaloneServer: StartStandaloneServer;
  container: Pick<AwilixContainer, "resolve">;
}

export const startServer = async ({
  sequelize,
  startStandaloneServer,
  container,
}: StartServer) => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const { url } = await startStandaloneServer(server, {
      listen: { port: Number(process.env.PORT) || 4000 },
      context: async ({ req }): Promise<GraphQLContext> => {
        const token = req.headers.authorization || "";

        const authService: AuthService = container.resolve("authService");

        const user = token ? await authService.getUser(token) : null;

        return { container, user };
      },
    });
    console.log(`🚀 Server ready at ${url}`);
  } catch (error) {
    console.error("Unable to start the server:", error);
  }
};

startServer({ sequelize, startStandaloneServer, container });

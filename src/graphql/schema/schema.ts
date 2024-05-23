import { makeExecutableSchema } from "@graphql-tools/schema";
import { trackTypeDefs, userTypeDefs } from "../typeDefs";

import { trackResolvers } from "../resolvers/trackResolvers";
import { userResolvers } from "../resolvers/userResolvers/userResolvers";

export const schema = makeExecutableSchema({
  typeDefs: [trackTypeDefs, userTypeDefs],
  resolvers: [trackResolvers, userResolvers],
});

import dotenv from "dotenv";
dotenv.config();

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import jwt from "jsonwebtoken";
import resolvers from "./graphql/resolvers/resolvers.js";
import typeDefs from "./graphql/schema/schema.js";

const app = express();

const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  debug: true, // Currently "true"
  introspection: true, // Currently "true"
  csrfPrevention: true,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  cors(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      const token = req.headers.authorization;
      try {
        if (!token)
          return {
            userAuthentication: { userId: null, message: "token is not exist" },
          };
        const userDecoded = jwt.verify(token, process.env.SECRET_KET);
        const userAuthentication = { userId: userDecoded?.userId };
        return { userAuthentication };
      } catch (error) {
        return {
          userAuthentication: { userId: null, message: "User Unauthorized" },
        };
      }
    },
  })
);

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

console.log(`🚀  Server ready at: http://localhost:4000/`);

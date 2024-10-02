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
import { getAuthentication } from "./utils/authentication.js";

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
app.use(cors(), express.json());

// get authentication context data
// const getContext = await getAuthentication({ req });

app.use(
  expressMiddleware(server, {
    context: async ({ req }) => {
      const bearerToken = req.headers.authorization;
      // await getAuthentication(req);
      console.log("bearerToken", bearerToken);
      try {
        if (!bearerToken) {
          return {
            userAuthentication: {
              userId: null,
              errorMessage: "token is not exist",
            },
          };
        } else {
          const token = bearerToken.split(" ")[1];
          const userDecoded = jwt.verify(token, process.env.SECRET_KEY);
          const userAuthentication = { userId: userDecoded?.userId };
          return { userAuthentication };
        }
      } catch (error) {
        console.log("error", error);
        return {
          userAuthentication: {
            userId: null,
            errorMessage: "User Unauthorized",
          },
        };
      }
    },
  })
);

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

console.log(`🚀  Server ready at: http://localhost:4000/`);

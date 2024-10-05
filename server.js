import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import http from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import resolvers from "./graphql/resolvers/resolvers.js";
import typeDefs from "./graphql/schema/schema.js";
import { getAuthentication } from "./utils/authentication.js";
import userLoader from "./utils/dataLoader.js";

const app = express();

const httpServer = http.createServer(app);

const schema = makeExecutableSchema({ typeDefs, resolvers });

//create websocket server
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/subscriptions", // this is the endpoint of subscription listen point : like : ws://localhost:4000/subscriptions
});

// save the return server info, so that can shutdown later.
const serverCleanUp = useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema,
  debug: true,
  introspection: true, // this is help get schema structure and data type
  csrfPrevention: true, // Cross-Site Request Forgery for security purpose
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }), // Graceful Shutdown ,Integration with Node.js HTTP Servers , Prevention of Data Loss

    // proper shutdown for the websocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanUp.dispose();
          },
        };
      },
    },
  ],
});

await server.start();
app.use(cors(), express.json());

async function getContext({ req }) {
  const authData = await getAuthentication(req);

  return { ...authData, userLoader };
}

app.use(
  expressMiddleware(server, {
    context: getContext,
  })
);

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

console.log(`🚀  Server ready at: http://localhost:4000/`);

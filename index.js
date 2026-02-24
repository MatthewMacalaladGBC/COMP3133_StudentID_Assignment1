import express from "express";
import cors from "cors";
import connectDB from "./config/db.js"
import typeDefs from "./schemas/typeDefs.js";
import resolvers from "./resolvers/resolvers.js";

import { ApolloServer }  from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

const app = express();

async function startServer() {
    await connectDB();

    // Define Apollo Server
    const server = new ApolloServer({
      typeDefs,
      resolvers
    });

    // Start the Apollo Server
    await server.start();

    // Apply middleware to the Express app
    app.use(
      "/graphql", 
      cors(),
      express.json(),
      expressMiddleware(server)
    );

    //Start Express server
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${process.env.PORT}/graphql`);
      //Connect to MongoDB Atlas
    });
}

startServer();
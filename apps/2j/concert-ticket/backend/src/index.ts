import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { readFileSync } from 'fs';
import { join } from 'path';
import { resolvers } from './resolvers';
import { createContextWithAuth, Context } from './context';
import { connectDatabase } from './database/connection';

async function startApolloServer() {
  await connectDatabase();
  const app = express();
  const httpServer = http.createServer(app);
  const typeDefs = readFileSync(join(__dirname, 'schemas', 'schema.graphql'), 'utf-8');
  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    introspection: true,
    csrfPrevention: false, // ✅ Disable CSRF for local development
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      return {
        message: error.message,
        code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
      };
    },
  });
  await server.start();

  // ✅ CORS + JSON middleware must come before Apollo
  app.use(
    '/api/graphql',
    cors({
      origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
      credentials: true,
    }),
    express.json(),
    express.urlencoded({ extended: true }),
    expressMiddleware(server, {
      context: async ({ req }) => createContextWithAuth(req),
    })
  );
  const port = process.env.PORT ? parseInt(process.env.PORT) : 4000;
  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
  console.log(`🚀 Apollo Server ready at: http://localhost:${port}/api/graphql`);
  console.log(`📚 GraphQL Playground: http://localhost:${port}/api/graphql`);
}

startApolloServer().catch((error) => {
  console.error('❌ Server эхлүүлэхэд алдаа гарлаа:', error);
  process.exit(1);
});

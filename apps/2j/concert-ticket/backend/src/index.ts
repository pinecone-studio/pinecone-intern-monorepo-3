import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import { readFileSync } from 'fs';
import { join } from 'path';
import { resolvers } from './resolvers';
import { createContextWithAuth } from './context';
import { connectDatabase } from './database/connection';
import { WebhookController } from './controllers/webhook.controller';

async function startApolloServer() {
  // Database холбогдох
  await connectDatabase();

  // Express app үүсгэх
  const app = express();
  const httpServer = http.createServer(app);

  // GraphQL schema-г файлаас унших
  const typeDefs = readFileSync(join(__dirname, 'schemas', 'schema.graphql'), 'utf-8');

  // Apollo Server үүсгэх
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      return {
        message: error.message,
        code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
      };
    },
  });

  // Apollo Server эхлүүлэх
  await server.start();

  // Middleware тохиргоо
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Webhook endpoint (Clerk)
  app.post('/api/webhooks/clerk', WebhookController.handleClerkWebhook);

  // GraphQL endpoint
  app.use(
    '/api/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => createContextWithAuth(req),
    })
  );

  // Server эхлүүлэх
  const port = process.env.PORT ? parseInt(process.env.PORT) : 4000;
  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));

  console.log(`🚀 Apollo Server ready at: http://localhost:${port}/api/graphql`);
  console.log(`📚 GraphQL Playground: http://localhost:${port}/api/graphql`);
  console.log(`🔗 Webhook endpoint: http://localhost:${port}/api/webhooks/clerk`);
}

// Server эхлүүлэх
startApolloServer().catch((error) => {
  console.error('❌ Server эхлүүлэхэд алдаа гарлаа:', error);
  process.exit(1);
});

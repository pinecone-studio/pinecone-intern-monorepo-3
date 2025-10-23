import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { readFileSync } from 'fs';
import { join } from 'path';
import { resolvers } from './resolvers';
import { createContextWithAuth, Context } from './context';
import { connectDatabase } from './database/connection';
import { NextApiRequest, NextApiResponse } from 'next';

// Vercel-д зориулсан Apollo Server
async function createApolloServer() {
  await connectDatabase();

  const typeDefs = readFileSync(join(__dirname, 'schemas', 'schema.graphql'), 'utf-8');

  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
    introspection: true,
    csrfPrevention: false,
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      return {
        message: error.message,
        code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
      };
    },
  });

  await server.start();
  return server;
}

// Vercel handler үүсгэх
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const server = await createApolloServer();
  return startServerAndCreateNextHandler(server, {
    context: async ({ req }) => createContextWithAuth({ headers: { authorization: req.headers.authorization } }),
  })(req, res);
}

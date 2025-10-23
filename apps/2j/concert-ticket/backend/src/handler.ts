import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from './schemas';
import { NextRequest } from 'next/server';
import { resolvers } from './resolvers';
import { connectToDb } from './utils/connect-to-db';
import { Context, createContextWithAuth } from './context';

// Database холбоос үүсгэх
connectToDb();

const server = new ApolloServer<Context>({
  resolvers,
  typeDefs,
  introspection: true,
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  },
});

export const handler = startServerAndCreateNextHandler<NextRequest, Context>(server, {
  context: async (req) => {
    // Authentication context үүсгэх
    return await createContextWithAuth(req);
  },
});

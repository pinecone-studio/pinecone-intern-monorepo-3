import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { resolvers } from './resolvers';
import { createContext } from './context';
import { connectDatabase } from './database/connection';
import { typeDefs } from './schemas';

async function startApolloServer() {
  // Database холбогдох
  await connectDatabase();

  // Apollo Server үүсгэх
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      return {
        message: error.message,
        code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
      };
    },
  });

  // Server-ийг эхлүүлэх
  const { url } = await startStandaloneServer(server, {
    listen: { port: process.env.PORT ? parseInt(process.env.PORT) : 4000 },
    context: async ({ req }) => {
      // JWT token-ийг header-оос авах
      const token = req.headers.authorization?.replace('Bearer ', '');
      
          // TODO: JWT verify хийх
          if (token) {
            // JWT decode + verify logic
            console.log('Token received:', token);
          }

      return createContext();
    },
    // CORS тохиргоо
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:4000', 'https://studio.apollographql.com'],
      credentials: true,
    },
  });

  console.log(`🚀 Apollo Server ready at: ${url}`);
  console.log(`📚 GraphQL Playground: ${url}`);
}

// Server эхлүүлэх
startApolloServer().catch((error) => {
  console.error('❌ Server эхлүүлэхэд алдаа гарлаа:', error);
  process.exit(1);
});

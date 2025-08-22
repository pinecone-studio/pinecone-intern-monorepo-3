import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from './schemas';
import { NextRequest } from 'next/server';
import { resolvers } from './resolvers';
import { connectToDb } from './utils/connect-to-db';
import { Context } from './types';
import jwt from 'jsonwebtoken';
import { UserModel } from './models';

connectToDb();

export const getUserFromToken = async (token: string) => {
  try {
    if (!token) {
      console.log("No token provided");
      return null;
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    console.log("Decoded token:", decoded);
    
    const user = await UserModel.findById((decoded as any).userId);
    if (!user) {
      console.log("User not found");
      return null;
    }

    
    return {
      id: user._id.toString(),  
      email: user.email,
      username: user.username,
      fullname: user.fullname,
    };
  } catch (err) {
    console.log("Token verification failed:", err);
    return null;
  }
};

const server = new ApolloServer<Context>({
  resolvers,
  typeDefs,
  introspection: true,
});

export const handler = startServerAndCreateNextHandler<NextRequest, Context>(server, {
  context: async (req) => {
   
    const token = req.headers.get('authorization')?.replace('Bearer ', '') || '';
    
   
    const user = await getUserFromToken(token);

    
    return { req, user };
  },
});

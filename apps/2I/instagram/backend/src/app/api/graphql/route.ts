import { createYoga, createSchema } from 'graphql-yoga';
import type { NextRequest } from 'next/server';


import typeDefs from '../../../schemas';
import { resolvers } from '../../../resolvers';


type Ctx = { req: NextRequest };



const { handleRequest } = createYoga<Ctx>({
  schema: createSchema<Ctx>({ typeDefs, resolvers }),
  graphqlEndpoint: '/api/graphql',
  fetchAPI: {
    Request,
    Response,
  },

});


export { handleRequest as GET, handleRequest as POST, handleRequest as OPTIONS };


export const dynamic = 'force-dynamic';

export const runtime = 'nodejs';

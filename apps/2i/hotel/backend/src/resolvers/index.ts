import * as Mutation from './mutations';
import * as Query from './queries';

export const resolvers = {
  Mutation: {
    addRoom: Mutation.addRoom,
  },
  Query: {
    getRoomById: Query.getRoomById,
    getRooms: Query.getRooms,
  },
};

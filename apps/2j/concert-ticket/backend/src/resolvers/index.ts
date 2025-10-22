import { Resolvers } from '../generated/resolvers-types';
import { Query } from './Query';
import { Mutation } from './Mutation';
import { Concert } from './Concert';
import { User } from './User';
import { Booking } from './Booking';
import { Artist } from './Artist';
import { TicketCategory } from './TicketCategory';

export const resolvers: Resolvers = {
  Query,
  Mutation,
  Concert,
  User,
  Booking,
  Artist,
  TicketCategory,
};

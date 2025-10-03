import { Resolvers } from '../generated/resolvers-types';

export const Query: Resolvers['Query'] = {
  concerts: async (_parent, _args, _ctx) => {
    return {
      concerts: [],
      totalCount: 0,
      hasMore: false,
    };
  },
  concert: async (_parent, _args, _ctx) => {
    return null;
  },
  myBookings: async (_parent, _args, _ctx) => {
    return [];
  },
  user: async (_parent, _args, _ctx) => {
    return null;
  },
  users: async (_parent, _args, _ctx) => {
    return [];
  },
  artists: async () => {
    return [];
  },
  artist: async (_parent, _args) => {
    return null;
  },
  checkTicketAvailability: async (_parent, _args) => {
    return {
      id: _args.ticketCategoryId,
      type: 'REGULAR',
      totalQuantity: 0,
      availableQuantity: 0,
      unitPrice: 0,
      description: null,
      features: [],
    };
  },
  searchSuggestions: async () => {
    return [];
  },
};

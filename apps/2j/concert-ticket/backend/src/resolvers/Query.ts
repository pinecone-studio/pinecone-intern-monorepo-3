import { Resolvers } from '../generated/resolvers-types';
import { Concert } from '../models/model.concert';
import { Artist } from '../models/model.artist';
import { TicketCategory } from '../models/model.ticket-category';

export const Query: Resolvers['Query'] = {
  concerts: async (_parent, args, _ctx) => {
    try {
      console.log('🎵 Fetching concerts from database...');
      
      const { filter, pagination } = args;
      const limit = pagination?.limit || 10;
      const offset = pagination?.offset || 0;

      // Build query based on filters
        const query: any = { isActive: true };
      
      if (filter?.name) {
        query.name = { $regex: filter.name, $options: 'i' };
      }
      
      if (filter?.date) {
        const filterDate = new Date(filter.date);
        const startOfDay = new Date(filterDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(filterDate.setHours(23, 59, 59, 999));
        query.date = { $gte: startOfDay, $lte: endOfDay };
      }

      if (filter?.artistId) {
        query.$or = [
          { mainArtist: filter.artistId },
          { otherArtists: filter.artistId }
        ];
      }

      console.log('🔍 Query:', JSON.stringify(query, null, 2));

      // Fetch concerts with pagination - featured concerts first, then by date
      const concerts = await Concert.find(query)
        .populate('mainArtist', 'name bio image')
        .populate('otherArtists', 'name bio image')
        .sort({ featured: -1, date: 1, createdAt: -1 })
        .skip(offset)
        .limit(limit);

      console.log(`📊 Found ${concerts.length} concerts`);

      // Get total count for pagination
      const totalCount = await Concert.countDocuments(query);
      console.log(`📈 Total count: ${totalCount}`);

      // Get ticket categories for each concert
      const concertsWithTickets = await Promise.all(
        concerts.map(async (concert) => {
          const ticketCategories = await TicketCategory.find({ concert: concert._id });
          const concertObj = concert.toObject();
          return {
            ...concertObj,
            id: concertObj._id.toString(), // Convert MongoDB _id to GraphQL id
            date: concertObj.date.toISOString(), // Convert Date to ISO string
            mainArtist: concertObj.mainArtist ? {
              ...concertObj.mainArtist,
              id: concertObj.mainArtist._id.toString(),
              name: concertObj.mainArtist.name || 'Unknown Artist',
              bio: concertObj.mainArtist.bio || '',
              image: concertObj.mainArtist.image || ''
            } : null,
            otherArtists: concertObj.otherArtists ? concertObj.otherArtists.map((artist: any) => ({
              ...artist,
              id: artist._id.toString(),
              name: artist.name || 'Unknown Artist',
              bio: artist.bio || '',
              image: artist.image || ''
            })) : [],
            ticketCategories: ticketCategories.map(cat => ({
              ...cat.toObject(),
              id: cat._id.toString(), // Convert MongoDB _id to GraphQL id
            })),
            totalAvailableTickets: ticketCategories.reduce((sum: number, cat: any) => sum + cat.availableQuantity, 0)
          };
        })
      );

      console.log('✅ Returning concerts with tickets');
      return {
        concerts: concertsWithTickets,
        totalCount,
        hasMore: offset + limit < totalCount,
      };
    } catch (error) {
      console.error('❌ Error fetching concerts:', error);
      return {
        concerts: [],
        totalCount: 0,
        hasMore: false,
      };
    }
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
    try {
      const artists = await Artist.find().sort({ name: 1 });
      return artists;
    } catch (error) {
      console.error('Error fetching artists:', error);
      return [];
    }
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

import { Resolvers } from '../generated/resolvers-types';
import { Concert } from '../models/model.concert';
import { Artist } from '../models/model.artist';
import { TicketCategory } from '../models/model.ticket-category';

export const Mutation: Resolvers['Mutation'] = {
  register: async (_p, _a, _c) => {
    return { token: 'TODO', user: { id: '0', email: '', role: 'USER', createdAt: '', updatedAt: '' } } as any;
  },
  login: async (_p, _a, _c) => {
    return { token: 'TODO', user: { id: '0', email: '', role: 'USER', createdAt: '', updatedAt: '' } } as any;
  },
  forgotPassword: async () => {
    return 'SENT';
  },
  resetPassword: async () => {
    return { token: 'TODO', user: { id: '0', email: '', role: 'USER', createdAt: '', updatedAt: '' } } as any;
  },
  logout: async () => true,

  createConcert: async (_parent, { input }, _ctx) => {
    try {
      // Create the concert
      const concert = new Concert({
        name: input.name,
        description: input.description,
        venue: input.venue,
        date: new Date(input.date),
        time: input.time,
        mainArtist: input.mainArtistId,
        otherArtists: input.otherArtistIds || [],
        image: input.image,
        isActive: true,
      });

      await concert.save();

      // Create ticket categories
      const ticketCategories = await Promise.all(
        input.ticketCategories.map(async (categoryInput: any) => {
          const ticketCategory = new TicketCategory({
            type: categoryInput.type,
            totalQuantity: categoryInput.totalQuantity,
            availableQuantity: categoryInput.totalQuantity, // Initially all tickets are available
            unitPrice: categoryInput.unitPrice,
            description: categoryInput.description,
            features: categoryInput.features || [],
            concert: concert._id,
          });
          return await ticketCategory.save();
        })
      );

      // Populate the concert with artist data
      await concert.populate('mainArtist', 'name bio image');
      await concert.populate('otherArtists', 'name bio image');

      return {
        ...concert.toObject(),
        ticketCategories,
        totalAvailableTickets: ticketCategories.reduce((sum: number, cat: any) => sum + cat.availableQuantity, 0)
      };
    } catch (error) {
      console.error('Error creating concert:', error);
      throw new Error('Concert creation failed');
    }
  },
  updateConcert: async () => {
    return {
      id: '0',
      name: '',
      venue: '',
      date: '',
      time: '',
      mainArtist: { id: '0', name: '' },
      otherArtists: [],
      isActive: true,
      featured: false,
      ticketCategories: [],
      totalAvailableTickets: 0,
    } as any;
  },
  updateConcertFeatured: async (_parent, { id, featured }, _ctx) => {
    try {
      console.log(`⭐ Updating concert ${id} featured status to: ${featured}`);
      
      const concert = await Concert.findByIdAndUpdate(
        id,
        { featured },
        { new: true }
      ).populate('mainArtist', 'name bio image')
       .populate('otherArtists', 'name bio image');

      if (!concert) {
        throw new Error('Concert not found');
      }

      // Get ticket categories for the concert
      const ticketCategories = await TicketCategory.find({ concert: concert._id });

      return {
        ...concert.toObject(),
        id: concert._id.toString(),
        date: concert.date.toISOString(),
        mainArtist: concert.mainArtist ? {
          ...concert.mainArtist,
          id: concert.mainArtist._id.toString(),
          name: concert.mainArtist.name || 'Unknown Artist',
          bio: concert.mainArtist.bio || '',
          image: concert.mainArtist.image || ''
        } : null,
        otherArtists: concert.otherArtists ? concert.otherArtists.map((artist: any) => ({
          ...artist,
          id: artist._id.toString(),
          name: artist.name || 'Unknown Artist',
          bio: artist.bio || '',
          image: artist.image || ''
        })) : [],
        ticketCategories: ticketCategories.map(cat => ({
          ...cat.toObject(),
          id: cat._id.toString(),
        })),
        totalAvailableTickets: ticketCategories.reduce((sum: number, cat: any) => sum + cat.availableQuantity, 0)
      };
    } catch (error) {
      console.error('Error updating concert featured status:', error);
      throw new Error('Failed to update concert featured status');
    }
  },
  deleteConcert: async () => true,

  createArtist: async (_parent, { input }, _ctx) => {
    try {
      const artist = new Artist({
        name: input.name,
        bio: input.bio,
        image: input.image,
      });
      
      await artist.save();
      return artist;
    } catch (error) {
      console.error('Error creating artist:', error);
      throw new Error('Artist creation failed');
    }
  },
  updateArtist: async () => ({ id: '0', name: '' } as any),
  deleteArtist: async () => true,

  createBooking: async () => {
    return {
      id: '0',
      user: { id: '0', email: '', role: 'USER', createdAt: '', updatedAt: '' },
      concert: { id: '0', name: '', venue: '', date: '', time: '', mainArtist: { id: '0', name: '' }, otherArtists: [], isActive: true, ticketCategories: [], totalAvailableTickets: 0 },
      ticketCategory: { id: '0', type: 'REGULAR', totalQuantity: 0, availableQuantity: 0, unitPrice: 0 },
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      bookingDate: '',
      status: 'PENDING',
      paymentStatus: 'PENDING',
      canCancel: true,
      cancellationDeadline: '',
    } as any;
  },
  cancelBooking: async () => ({ id: '0' } as any),
  requestCancellation: async () => ({ id: '0' } as any),

  updateUserProfile: async () => ({ id: '0', email: '', role: 'USER', createdAt: '', updatedAt: '' } as any),
  updateTicketQuantity: async () => ({ id: '0', type: 'REGULAR', totalQuantity: 0, availableQuantity: 0, unitPrice: 0 } as any),
  updateTicketPrice: async () => ({ id: '0', type: 'REGULAR', totalQuantity: 0, availableQuantity: 0, unitPrice: 0 } as any),
};

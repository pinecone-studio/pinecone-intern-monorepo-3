import * as Mutation from './mutations';
import * as Query from './queries';

export const resolvers = {
  Mutation: {
    addRoom: Mutation.addRoom,
    addHotel: Mutation.addHotel,
    updateHotel: Mutation.updateHotel,
    deleteHotel: Mutation.deleteHotel,
    submitUserRating: Mutation.submitUserRating,
    userSignUp: Mutation.userSignUp,
    bookingUpdate: Mutation.bookingUpdate,
    roomBooking: Mutation.roomBooking,
  },
  Query: {
    getRoomById: Query.getRoomById,
    getRooms: Query.getRooms,
    getHotel: Query.getHotel,
    getHotelById: Query.getHotelById,
    getAvailableRooms: Query.getAvailableRooms,
    getUserData: Query.getUserData,
  },
};

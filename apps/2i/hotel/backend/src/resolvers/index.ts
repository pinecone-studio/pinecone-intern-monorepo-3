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
    userLogin: Mutation.userLogin,
    roomBooking: Mutation.roomBooking,
    bookingUpdate: Mutation.bookingUpdate,
    sendOtp: Mutation.sendOtp,
    verifyOtp: Mutation.verifyOtp,
    uploadToCloudinary: Mutation.uploadToCloudinary,
    updateRoom: Mutation.updateRoom,
    uploadRoomImages: Mutation.uploadRoomImages,
  },
  Query: {
    getRoomById: Query.getRoomById,
    getRooms: Query.getRooms,
    getHotel: Query.getHotel,
    getHotelById: Query.getHotelById,
    getAvailableRooms: Query.getAvailableRooms,
    getUserData: Query.getUserData,
    getBooking: Query.getBooking,
    getFiltered: Query.getFiltered,
    getFilterRoom: Query.getFilterRoom,
    getpopularHotels: Query.getpopularHotels,
    getmostBookedHotels: Query.getmostBookedHotels,
  },
};

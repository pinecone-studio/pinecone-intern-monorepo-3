import gql from 'graphql-tag';

export const typeDefs = gql`
  input AmenitiesInput {
    bathroom: [String]!
    foodAndDrink: [String]!
    technology: [String]!
    accessibility: [String]!
    bedroom: [String]!
    more: [String]!
  }
  type Hotel {
    _id: ID!
    hotelName: String!
    description: String
    location: String!
    starRating: String!
    userRating: [UserRating]!
    image: [String!]!
    rooms: [Room]!
  }

  type UserRating {
    rating: Int
    comment: String
    hotel: ID
  }
  type Amenities {
    bathroom: [String]!
    foodAndDrink: [String]!
    technology: [String]!
    accessibility: [String]!
    bedroom: [String]!
    more: [String]!
  }

  type Room {
    _id: ID!
    hotelName: ID!
    roomNumber: String!
    roomType: String!
    pricePerNight: Int!
    roomImgs: [String]!
    roomInfos: [String]!
    amenities: Amenities!
  }

  type Booking {
    _id: ID!
    user: ID!
    hotel: Hotel
    room: Room!
    checkIn: String!
    checkOut: String!
    getHotelById(id: ID!): Hotel
  }

  type EmergencyNumber {
    phoneNumber: String
    relation: String
  }

  type User {
    _id: ID!
    email: String!
    firstName: String
    lastName: String
    birthDate: String
    phoneNumber: String
    emergencyNumber: EmergencyNumber
  }

  type SignUpResponse {
    message: String!
  }

  type Query {
    getRoomById(id: ID!): Room
    getRooms: [Room]!
    getHotel: [Hotel]!
    getHotelById(id: ID!): Hotel!
    getAvailableRooms(id: ID!): Room
    getUserData: [User]!
  }

  type Mutation {
    addRoom(hotelName: ID!, roomNumber: String!, roomType: String!, pricePerNight: Int!, roomImgs: [String]!, roomInfos: [String]!, amenities: AmenitiesInput!): Room!
    addHotel(hotelName: String!, description: String!, location: String!, starRating: String!, image: [String]!): Hotel!
    updateHotel(id: ID!, hotelName: String!, description: String!, location: String!, starRating: String): Hotel!
    deleteHotel(id: ID!): Boolean!
    submitUserRating(hotelId: String!, rating: Int!, comment: String): [UserRating]!
    uploadToCloudinary(hotelId: ID!, image: [String]): Hotel!
    userSignUp(email: String!, password: String!): SignUpResponse!
    roomBooking(userId: ID!, hotelName: ID!, roomNumber: ID!, checkIn: String!, checkOut: String!): User!
    bookingUpdate(userId: ID!, hotelName: String!, roomNumber: ID!, checkIn: String!, checkOut: String!): Booking!
  }
`;

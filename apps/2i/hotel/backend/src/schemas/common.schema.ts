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

  type Query {
    getRoomById(id: ID!): Room
    getRooms: [Room]!
    getHotel: [Hotel]!
    getHotelById(id: ID!): Hotel!
    getAvailableRooms(id: ID!): Room
  }

  type Booking {
    _id: ID!
    user: ID!
    hotel: Hotel
    room: Room!
    checkIn: String!
    checkOut: String!
  }

  type Mutation {
    addRoom(hotelName: ID!, roomNumber: String!, roomType: String!, pricePerNight: Int!, roomImgs: [String]!, roomInfos: [String]!, amenities: AmenitiesInput!): Room!
    addHotel(hotelName: String!, description: String!, location: String!, starRating: String!, image: [String]!): Hotel!
    updateHotel(id: ID!, hotelName: String!, description: String!, location: String!, starRating: String): Hotel!
    deleteHotel(id: ID!): Boolean!
    submitUserRating(hotelId: String!, rating: Int!, comment: String): [UserRating]!
    uploadToCloudinary(hotelId: ID!, image: [String]): Hotel!
  }
`;

import gql from 'graphql-tag';

export const typeDefs = gql`
  scalar JSON

  scalar Date

  enum Response {
    Success
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
    hotelName: String!
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
  }

  type Mutation {
    addRoom(hotelName: String!, roomNumber: String!, roomType: String!, pricePerNight: Int!, roomImgs: [String]!, roomInfos: [String]!, amenities: AmenitiesInput!): Room!
  }

  input AmenitiesInput {
    bathroom: [String]!
    foodAndDrink: [String]!
    technology: [String]!
    accessibility: [String]!
    bedroom: [String]!
    more: [String]!
  }
`;

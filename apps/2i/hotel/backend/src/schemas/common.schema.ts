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
    _id:ID!
hotelName:String!
description:String
location:String!
starRating:String!
  userRating: [UserRating]!
}
 
type UserRating {
  rating: Int!
  comment: String
  hotel: String!
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
    getHotel:[Hotel!]!
  getHotelById(id: ID!): Hotel
  }

  type Mutation {
    addRoom(hotelName: String!, roomNumber: String!, roomType: String!, pricePerNight: Int!, roomImgs: [String]!, roomInfos: [String]!, amenities: AmenitiesInput!): Room!
    addHotel(hotelName:String!, description:String!, location:String!, starRating:String!):Hotel!
    updateHotel(id:ID!, hotelName:String!, description:String!, location:String!, starRating:String):Hotel!
    deleteHotel(id:ID!):Boolean!
    submitUserRating(hotelId: String!, rating: Int!, comment: String):[UserRating]!
  }
 
`;

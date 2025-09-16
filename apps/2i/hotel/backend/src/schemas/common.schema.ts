import gql from 'graphql-tag';

export const typeDefs = gql`
  type Hotel {
    _id: ID!
    hotelName: String!
    description: String
    phoneNumber: String
    about: String
    location: String!
    languages: [String]
    starRating: String!
    image: [String!]!
    amenities: Amenities!
    policies: [Policy]
    userRating: [UserRating]!
    rooms: [Room]!
  }

  type Policy {
    title: String
    description: String
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
    wifi: boolean
    parking: boolean
    spa: boolean
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

  input RoomFilterInput {
    roomType: String
    amenities: AmenitiesInput
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

  type UpdateResponse {
    message: String!
  }

  type UplodedImageResponse {
    message: String!
  }

  type Booking {
    _id: ID!
    user: User
    hotel: Hotel
    room: Room
    checkIn: String!
    checkOut: String!
    nights: Int
    pricePerNight: Int
    taxes: Float
    totalPrice: Float
    email: String
    firstName: String
    lastName: String
    phoneNumber: String
    cardNumber: String
  }

  type Otp {
    email: String!
    code: String!
    verified: Boolean!
  }

  type OtpResponse {
    success: Boolean!
    message: String!
  }

  type Query {
    getRoomById(id: ID!): Room
    getRooms: [Room]!
    getHotel: [Hotel]!
    getHotelById(id: ID!): Hotel!
    getAvailableRooms(id: ID!): [Room]!
    getUserData(id: ID): [User]!
    getBooking: [Booking]!
    getFiltered: [Hotel]!
    getFilterRoom(filter: RoomFilterInput): [Room]!
    getpopularHotels: [Hotel]!
    getmostBookedHotels: [Hotel]!
  }
`;

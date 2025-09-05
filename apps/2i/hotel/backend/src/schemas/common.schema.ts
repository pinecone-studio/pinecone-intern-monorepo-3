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

  input PolicyInput {
    title: String
    description: String
  }

  input UpdateHotelInput {
    hotelName: String
    description: String
    phoneNumber: String
    about: String
    location: String
    languages: [String]
    starRating: String
    image: [String]
    amenities: [String]
    policies: [PolicyInput]
  }

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
    amenities: [String]
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

  type Query {
    getRoomById(id: ID!): Room
    getRooms: [Room]!
    getHotel: [Hotel]!
    getHotelById(id: ID!): Hotel!
    getAvailableRooms(id: ID!): [Room]!
    getUserData(id: ID): [User]!
    getBooking(userId: ID): Booking
    getFiltered: [Hotel]!
    getFilterRoom(filter: RoomFilterInput): [Room]!
    getpopularHotels: [Hotel!]!
    getmostBookedHotels: [Hotel!]!
  }

  type Booking {
    _id: ID!
    user: ID!
    hotel: Hotel
    room: Room!
    checkIn: String!
    checkOut: String!
    getHotelById(id: ID!): Hotel
    nights: Int
    pricePerNight: Int
    taxes: Float
    totalPrice: Float
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

  type Mutation {
    addRoom(hotelName: ID!, roomNumber: String!, roomType: String!, pricePerNight: Int!, roomImgs: [String]!, roomInfos: [String]!, amenities: AmenitiesInput!): Room!
    addHotel(hotelName: String!, description: String!, starRating: String!, phoneNumber: String!): Hotel!
    updateHotel(id: ID!, input: UpdateHotelInput!): UpdateResponse!
    deleteHotel(id: ID!): Boolean!
    submitUserRating(hotelId: String!, rating: Int!, comment: String): [UserRating]!
    uploadToCloudinary(hotelId: ID!, image: [String!]!): Hotel!
    sendOtp(email: String!): OtpResponse!
    verifyOtp(email: String!, code: String!): Boolean!
    userSignUp(email: String!, password: String!): SignUpResponse!
    roomBooking(userId: String, hotelName: String, roomNumber: String, checkIn: String, checkOut: String, nights: Int, pricePerNight: Int, taxes: Float, totalPrice: Float): Booking!
    bookingUpdate(userId: String, hotelName: String, roomNumber: String, checkIn: String, checkOut: String, nights: Int, pricePerNight: Int, taxes: Float, totalPrice: Float): Booking!
  }
`;

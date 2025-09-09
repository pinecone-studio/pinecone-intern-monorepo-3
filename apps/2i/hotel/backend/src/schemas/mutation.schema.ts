import gql from 'graphql-tag';

export const mutationDefs = gql`
  input AmenitiesInput {
    bathroom: [String!]
    foodAndDrink: [String!]
    technology: [String!]
    accessibility: [String!]
    bedroom: [String!]
    more: [String!]
  }

  input RoomFilterInput {
    roomType: String
    amenities: AmenitiesInput
  }

  input UpdateRoomInput {
    roomType: String
    pricePerNight: Int
    roomInfos: [String]
    roomImgs: [String]
    amenities: AmenitiesInput
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

  type UpdateResponse {
    message: String!
  }

  type UplodedImageResponse {
    message: String!
  }
  type LoginResponse {
    message: String!
    token: String
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

    uploadToCloudinary(hotelId: ID!, image: [String]!): UplodedImageResponse!

    sendOtp(email: String!): OtpResponse!
    verifyOtp(email: String!, code: String!): OtpResponse!

    userSignUp(email: String!, password: String!): SignUpResponse!
    userLogin(email: String!, password: String!): LoginResponse!

    roomBooking(userId: String, hotelName: String, roomNumber: String, checkIn: String, checkOut: String, nights: Int, pricePerNight: Int, taxes: Float, totalPrice: Float): Booking!

    bookingUpdate(userId: String, hotelName: String, roomNumber: String, checkIn: String, checkOut: String, nights: Int, pricePerNight: Int, taxes: Float, totalPrice: Float): Booking!

    updateRoom(roomId: ID!, input: UpdateRoomInput!): UpdateResponse!

    uploadRoomImages(roomId: ID!, image: [String]!): UplodedImageResponse!
  }
`;

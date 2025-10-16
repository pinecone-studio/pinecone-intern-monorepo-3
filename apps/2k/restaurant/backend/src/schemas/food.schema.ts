import gql from 'graphql-tag';

export const typeDefs = gql`
  # type discount {
  #   value: Int
  #   startDate: Date
  #   endDate: Date
  # }

  type foodTypeDef {
    id: ID!
    name: String
    image: String
    price: Int
    available: Boolean
    # discount:discount
    # categoryId:ID!
  }

  type Query {
    allFood: [foodTypeDef!]!
    GetFoodById(foodId: ID!): foodTypeDef!
  }

  type Mutation {
    createFood(
      name: String!
      image: String
      price: Int!
      available: Boolean # categoryId:ID!
    ): foodTypeDef!

    updateFood(
      name: String
      image: String
      price: Int
      available: Boolean
      id: ID! # categoryId:ID!
    ): foodTypeDef!

    DeleteFood(foodId: ID!): foodTypeDef!
  }
`;

import gql from 'graphql-tag';

export const typeDefs = gql`
  # type discount {
  #   value: Int
  #   startDate: Date
  #   endDate: Date
  # }

  type FoodType {
    id: ID!
    name: String
    image: String
    price: Int
    available: Boolean
    # discount:discount
    categoryId: ID
  }


  type Query {
    allFood: [FoodType!]!
    GetFoodById(foodId: ID!): FoodType!
  }

  type Mutation {
    createFood(
      name: String!
      image: String
      price: Int!
      available: Boolean # categoryId:ID!
    ): FoodType!

    updateFood(
      name: String
      image: String
      price: Int
      available: Boolean
      id: ID! # categoryId:ID!
    ): FoodType!

    AddFoodToCategory(foodId: ID!, categoryId: ID!): FoodType
    DeleteFoodFromCategory(foodId:ID!, categoryId:ID!):FoodType

    DeleteFood(foodId: ID!): FoodType!
  }
`;

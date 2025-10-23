import gql from 'graphql-tag';

export const typeDefs = gql`

  enum FoodOrderStatus {
    PENDING
    INPROGRESS
    COMPLETED
    SERVED
  }

  enum FoodServeType {
    GO
    IN
  }

  type FoodOrderItemType {
    food: FoodType!
    quantity: Int!
  }

  type FoodOrder {
    id: ID!
    user: ID!
    status: FoodOrderStatus!
    foodOrderItems: [FoodOrderItemType!]!
    tableId: String!
    totalPrice: Int!
    orderNumber: Int!
    serveType: FoodServeType!
    createdAt: Date
    updatedAt: Date
  }

  input FoodOrderItemInput {
    food: ID!
    quantity: Int!
  }

  input FoodOrderInput {
    totalPrice: Int!
    status: FoodOrderStatus!
    serveType: FoodServeType!
    foodOrderItems: [FoodOrderItemInput!]!
  }

  input UpdateOrderStatusInput {
    order:ID!
    status:FoodOrderStatus!
  }

  type Query {
    getAllOrderByUserId(userId: String!): [FoodOrder!]!
    GetAllOrders: [FoodOrder!]!
  }

  type Mutation {
    createOrder(userId: String!, tableId: String!, input: FoodOrderInput!): FoodOrder!
    UpdateOrder(input:UpdateOrderStatusInput!): FoodOrder!
  }
`;

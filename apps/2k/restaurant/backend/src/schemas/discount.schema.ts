import { gql } from 'graphql-tag';

export const discountTypeDefs = gql`
  type Discount {
    id: ID!
    discountName: String!
    discountRate: Int!
    startDate: String!
    endDate: String!
    # food: [Food]
    createdAt: String
    updatedAt: String
  }

  input CreateDiscountInput {
    discountName: String!
    discountRate: Int!
    startDate: String!
    endDate: String!
  }

  input UpdateDiscountInput {
    discountName: String!
    discountRate: Int!
    startDate: String!
    endDate: String!
  }

  type Query {
    getDiscount: [Discount]!
  }

  type Mutation {
    createDiscount(input: CreateDiscountInput!): Discount!
    updateDiscount(discountId: ID!, input: UpdateDiscountInput!): Discount!
    deleteDiscount(discountId: ID!): Discount!
  }
`;

import gql from 'graphql-tag';

export const categoryTypeDefs = gql`

  type Category {
    categoryId: ID!
    categoryName: String!
    food: [FoodType]
    createdAt: String
    updatedAt: String
  }

  input CreateCategoryInput {
    categoryName: String!
  }

  input UpdateCategoryInput {
    categoryName: String!
  }
  
  type Query {
    getByIdCategory(categoryId: ID!): Category!
    getCategories: [Category]!
  }

  type Mutation {
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(categoryId: ID!, input: UpdateCategoryInput!): Category!
    deleteCategory(categoryId: ID!): Category!
  }
`;
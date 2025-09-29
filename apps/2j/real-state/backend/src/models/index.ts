export { User, createUser, findUserByEmail, findUserById } from './User';
export { PropertyFeature, createPropertyFeature, findPropertyFeatureById, findPropertyFeaturesByUserId } from './PropertyFeature';
export { 
  Post, 
  createPost, 
  findPostById, 
  findPostsByOwner, 
  findApprovedPosts, 
  findPendingPosts, 
  updatePostStatus 
} from './Post';

// Re-export types
export type { IUserDocument } from './User';
export type { IPropertyFeatureDocument } from './PropertyFeature';
export type { IPostDocument } from './Post';

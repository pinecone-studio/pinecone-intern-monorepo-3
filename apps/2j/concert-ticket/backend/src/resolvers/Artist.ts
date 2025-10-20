import { Resolvers } from '../generated/resolvers-types';

export const Artist: Resolvers['Artist'] = {
  // Artist type-ийн field-уудыг resolve хийх
  id: (parent) => {
    if (parent._id) {
      return parent._id.toString();
    }
    if (parent.id) {
      return parent.id.toString();
    }
    return '';
  },
  name: (parent) => parent.name,
  bio: (parent) => parent.bio || null,
  image: (parent) => parent.image || null,
  concerts: () => [], // Concerts-ийг дараа нь implement хийх
};

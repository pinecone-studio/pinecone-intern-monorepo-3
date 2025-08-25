// import { StoryModel } from "../../models/storymodel";

// export const getStoriesFeed = async (_: unknown, __: any, context: { user: { id: string } }) => {
//   const now = new Date();

//   const stories = await StoryModel.find({
//     expiresAt: { $gt: now }
//   }).populate('user');

//   return stories;
// };

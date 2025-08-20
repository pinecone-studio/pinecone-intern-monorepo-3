import type { GraphQLResolveInfo } from "graphql";

export const signup = async (
  _parent: unknown,
  args: { email: string; password: string; fullName: string; username: string },
  _ctx: unknown,
  _info: GraphQLResolveInfo
) => {
  return {
    id: "2",
    email: args.email,
    username: args.username,
    fullName: args.fullName,
  };
};

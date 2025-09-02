/* eslint-disable @typescript-eslint/ban-types */
export type Context = {
  user?: {
    id: string;
    email: string;
    username: string;
    fullname: string;
  } | null;
};

import { connect } from 'mongoose';

export const connectToDb = async () => {
  await connect(process.env.MONGODB_URI!);
};

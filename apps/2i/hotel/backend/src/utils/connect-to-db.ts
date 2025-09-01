import { connect } from 'mongoose';

export const connectToDb = async () => {
  const uri = process.env.MONGO_URI;
  console.log('mongo', uri);
  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment variables.');
  }

  await connect(uri);
};

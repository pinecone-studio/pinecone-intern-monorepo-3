import { connect } from 'mongoose';

export const connectToDb = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/real-estate';
  await connect(mongoUri);
};

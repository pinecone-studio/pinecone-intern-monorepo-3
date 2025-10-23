import { connect } from 'mongoose';

export const connectToDb = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI or MONGO_URI environment variable is not set');
  }
  await connect(mongoUri);
};

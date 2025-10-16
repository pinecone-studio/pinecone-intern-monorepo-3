import mongoose, { Document, Schema } from 'mongoose';

// Post interface matching your database model
export interface IPost {
  propertyOwnerId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  propertyDetail: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'declined';
  createdAt: Date;
  updatedAt: Date;
}

export interface IPostDocument extends IPost, Document {}

// Post schema matching your database model
const PostSchema = new Schema<IPostDocument>({
  propertyOwnerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  propertyDetail: { type: Schema.Types.ObjectId, ref: 'PropertyFeature', required: true },
  status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Post = mongoose.models.Post || mongoose.model<IPostDocument>('Post', PostSchema);
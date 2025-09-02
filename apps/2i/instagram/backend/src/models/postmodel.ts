import mongoose, { Schema, Document, Types } from 'mongoose';

export interface Post extends Document {
  user: Types.ObjectId;
  images: string[];
  caption: string;
  likes: Types.ObjectId[];
  comments: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<Post>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  images: [{ type: String, required: true }],
  caption: { type: String, default: '' },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

PostSchema.index({ user: 1, createdAt: -1 });

export const PostModel = mongoose.models.Post || mongoose.model('Post', PostSchema);

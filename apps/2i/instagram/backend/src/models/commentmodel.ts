import mongoose, { Schema, Document, Types } from 'mongoose';

export interface Comment extends Document {
  user: Types.ObjectId;
  post: Types.ObjectId;
  text: string;
  createdAt: Date;
}

const CommentSchema = new Schema<Comment>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const CommentModel = mongoose.models.Comment || mongoose.model<Comment>('Comment', CommentSchema);

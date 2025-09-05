import mongoose, { Schema, Document, Types } from 'mongoose';

export interface Notification extends Document {
  user: Types.ObjectId;
  fromUser?: Types.ObjectId;
  type: 'like' | 'comment' | 'follow';
  message: string;
  post?: Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema<Notification> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    fromUser: { type: Schema.Types.ObjectId, ref: 'users' },
    type: {
      type: String,
      enum: ['like', 'comment', 'follow'],
      required: true,
    },
    message: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, ref: 'posts' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const NotificationModel = mongoose.models.Notification || mongoose.model<Notification>('Notification', NotificationSchema);

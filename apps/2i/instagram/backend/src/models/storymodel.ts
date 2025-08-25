import mongoose, { Schema, Document, Types } from "mongoose";

export interface Story extends Document {
  user: Types.ObjectId;
  mediaUrl: string;
  createdAt: Date;
  expiresAt: Date;
  viewers: Types.ObjectId[]; 
}

const StorySchema = new Schema<Story>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  mediaUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }, 
  viewers: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export const StoryModel = mongoose.model("Story", StorySchema);

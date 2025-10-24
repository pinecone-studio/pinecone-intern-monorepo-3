import mongoose, { Schema, Document } from 'mongoose';

export interface IArtist extends Document {
  name: string;
  bio?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const artistSchema = new Schema<IArtist>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Name field-ийг index болгох (хайлтыг хурдасгах)
artistSchema.index({ name: 'text' });

// Hot reload үед model дахин үүсэхээс сэргийлэх
export const Artist = mongoose.models.Artist || mongoose.model<IArtist>('Artist', artistSchema, 'artists');

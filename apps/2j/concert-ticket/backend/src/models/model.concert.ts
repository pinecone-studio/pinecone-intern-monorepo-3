import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IConcert extends Document {
  name: string;
  description?: string;
  venue: string;
  date: Date;
  time: string;
  mainArtist: Types.ObjectId;
  otherArtists: Types.ObjectId[];
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const concertSchema = new Schema<IConcert>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  venue: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
    trim: true,
  },
  mainArtist: {
    type: Schema.Types.ObjectId,
    ref: 'Artist',
    required: true,
  },
  otherArtists: [{
    type: Schema.Types.ObjectId,
    ref: 'Artist',
  }],
  image: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Name, venue, date field-үүдийг index болгох
concertSchema.index({ name: 'text', venue: 'text' });
concertSchema.index({ date: 1 });
concertSchema.index({ mainArtist: 1 });
concertSchema.index({ isActive: 1 });

// Hot reload үед model дахин үүсэхээс сэргийлэх
export const Concert = mongoose.models.Concert || mongoose.model<IConcert>('Concert', concertSchema);

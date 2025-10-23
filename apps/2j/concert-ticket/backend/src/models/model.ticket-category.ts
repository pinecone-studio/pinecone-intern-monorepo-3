import mongoose, { Schema, Document } from 'mongoose';

export interface ITicketCategory extends Document {
  type: 'VIP' | 'REGULAR' | 'GENERAL_ADMISSION';
  totalQuantity: number;
  availableQuantity: number;
  unitPrice: number;
  description?: string;
  features: string[];
  concert: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ticketCategorySchema = new Schema<ITicketCategory>({
  type: {
    type: String,
    enum: ['VIP', 'REGULAR', 'GENERAL_ADMISSION'],
    required: true,
  },
  totalQuantity: {
    type: Number,
    required: true,
    min: 0,
  },
  availableQuantity: {
    type: Number,
    required: true,
    min: 0,
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    trim: true,
  },
  features: [{
    type: String,
    trim: true,
  }],
  concert: {
    type: Schema.Types.ObjectId,
    ref: 'Concert',
    required: true,
  },
}, {
  timestamps: true,
});

// Concert + type хослолыг unique болгох
ticketCategorySchema.index({ concert: 1, type: 1 }, { unique: true });

// Available quantity-г автоматаар тооцоолох virtual field
ticketCategorySchema.virtual('isSoldOut').get(function() {
  return this.availableQuantity === 0;
});

// Хөнгөлөлттэй үнийг тооцоолох virtual field - concert огнооноос хамаарна
ticketCategorySchema.virtual('discountedPrice').get(function() {
  // Энэ virtual field нь concert мэдээлэл шаарддаг тул resolver дээр тооцоолно
  return this.unitPrice;
});

// JSON-д virtual field-ийг оруулах
ticketCategorySchema.set('toJSON', { virtuals: true });

export const TicketCategory = mongoose.model<ITicketCategory>('TicketCategory', ticketCategorySchema);

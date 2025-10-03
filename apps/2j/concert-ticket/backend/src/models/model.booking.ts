import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBooking extends Document {
  user: Types.ObjectId;
  concert: Types.ObjectId;
  ticketCategory: Types.ObjectId;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'CANCELLATION_REQUESTED';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  bookingDate: Date;
  canCancel: boolean;
  cancellationDeadline: Date;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  concert: {
    type: Schema.Types.ObjectId,
    ref: 'Concert',
    required: true,
  },
  ticketCategory: {
    type: Schema.Types.ObjectId,
    ref: 'TicketCategory',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'CANCELLATION_REQUESTED'],
    default: 'PENDING',
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
    default: 'PENDING',
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
  canCancel: {
    type: Boolean,
    default: true,
  },
  cancellationDeadline: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

// User + concert + ticketCategory хослолыг index болгох
bookingSchema.index({ user: 1, concert: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ bookingDate: 1 });

// Total price-г автоматаар тооцоолох middleware
bookingSchema.pre('save', function(next) {
  if (this.isModified('quantity') || this.isModified('unitPrice')) {
    this.totalPrice = this.quantity * this.unitPrice;
  }
  next();
});

// Cancellation deadline-г автоматаар тооцоолох (24 цагийн дараа)
bookingSchema.pre('save', function(next) {
  if (this.isNew) {
    this.cancellationDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }
  next();
});

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);

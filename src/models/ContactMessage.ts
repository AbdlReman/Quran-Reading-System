import mongoose from 'mongoose';

export interface IContactMessage extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: Date;
  updatedAt: Date;
}

const contactMessageSchema = new mongoose.Schema<IContactMessage>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['new', 'read', 'replied'],
      default: 'new',
    },
  },
  { timestamps: true }
);

contactMessageSchema.index({ createdAt: -1 });
contactMessageSchema.index({ status: 1 });

if (mongoose.models.ContactMessage) {
  delete mongoose.models.ContactMessage;
}

export default mongoose.model<IContactMessage>('ContactMessage', contactMessageSchema);

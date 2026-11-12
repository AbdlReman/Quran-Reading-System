import mongoose from 'mongoose';

export interface INewsletterLead extends mongoose.Document {
  email: string;
  source: string;
  status: 'new' | 'contacted';
  createdAt: Date;
  updatedAt: Date;
}

const newsletterLeadSchema = new mongoose.Schema<INewsletterLead>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    source: {
      type: String,
      default: 'footer',
      trim: true,
    },
    status: {
      type: String,
      enum: ['new', 'contacted'],
      default: 'new',
    },
  },
  { timestamps: true }
);

newsletterLeadSchema.index({ createdAt: -1 });

if (mongoose.models.NewsletterLead) {
  delete mongoose.models.NewsletterLead;
}

export default mongoose.model<INewsletterLead>('NewsletterLead', newsletterLeadSchema);

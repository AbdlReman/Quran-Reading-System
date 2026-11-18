import mongoose from 'mongoose';

export interface ITrialLead extends mongoose.Document {
  name: string;
  country: string;
  phone: string;
  course: string;
  source: string;
  status: 'new' | 'contacted' | 'scheduled' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const trialLeadSchema = new mongoose.Schema<ITrialLead>(
  {
    name: { type: String, required: true, trim: true },
    country: { type: String, trim: true, default: '' },
    phone: { type: String, required: true, trim: true },
    course: { type: String, trim: true, default: '' },
    source: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['new', 'contacted', 'scheduled', 'closed'],
      default: 'new',
    },
  },
  { timestamps: true }
);

trialLeadSchema.index({ createdAt: -1 });
trialLeadSchema.index({ status: 1 });

if (mongoose.models.TrialLead) {
  delete mongoose.models.TrialLead;
}

export default mongoose.model<ITrialLead>('TrialLead', trialLeadSchema);

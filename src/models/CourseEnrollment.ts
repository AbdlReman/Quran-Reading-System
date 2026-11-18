import mongoose from 'mongoose';

export interface ICourseEnrollment extends mongoose.Document {
  name: string;
  email: string;
  phone: string;
  age: number;
  education: string;
  country: string;
  notes: string;
  courseId: number;
  courseTitle: string;
  userId?: mongoose.Types.ObjectId;
  source: 'guest' | 'logged_in';
  status: 'new' | 'contacted' | 'confirmed' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const courseEnrollmentSchema = new mongoose.Schema<ICourseEnrollment>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 3, max: 100 },
    education: { type: String, trim: true, default: '' },
    country: { type: String, trim: true, default: '' },
    notes: { type: String, trim: true, default: '' },
    courseId: { type: Number, required: true },
    courseTitle: { type: String, required: true, trim: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    source: { type: String, enum: ['guest', 'logged_in'], default: 'guest' },
    status: {
      type: String,
      enum: ['new', 'contacted', 'confirmed', 'closed'],
      default: 'new',
    },
  },
  { timestamps: true }
);

courseEnrollmentSchema.index({ createdAt: -1 });
courseEnrollmentSchema.index({ status: 1 });
courseEnrollmentSchema.index({ courseId: 1 });
courseEnrollmentSchema.index({ email: 1 });

if (mongoose.models.CourseEnrollment) {
  delete mongoose.models.CourseEnrollment;
}

export default mongoose.model<ICourseEnrollment>('CourseEnrollment', courseEnrollmentSchema);

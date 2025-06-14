import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  name: string;
  email?: string;
  phone?: string;
  codeforcesHandle: string;
  currentRating: number;
  maxRating: number;
  lastSynced?: Date;
  remindersSent: number;
  autoReminder: boolean;
}

const StudentSchema = new Schema<IStudent>({
  name: { type: String, required: true },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  codeforcesHandle: { type: String, required: true, unique: true },
  currentRating: { type: Number, required: true },
  maxRating: { type: Number, required: true },
  lastSynced: { type: Date, default: Date.now },
  remindersSent: { type: Number, default: 0 },
  autoReminder: { type: Boolean, default: true },
});

export default mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);

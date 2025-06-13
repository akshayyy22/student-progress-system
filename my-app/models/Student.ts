import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  name: string;
  email: string;
  phone: string;
  codeforcesHandle: string;
  currentRating: number;
  maxRating: number;
  lastSynced?: Date;
}

const StudentSchema = new Schema<IStudent>({
  name: { type: String, required: true },
  email: String,
  phone: String,
  codeforcesHandle: String,
  currentRating: Number,
  maxRating: Number,
  lastSynced: Date,
});

export default mongoose.models.Student ||
  mongoose.model<IStudent>('Student', StudentSchema);

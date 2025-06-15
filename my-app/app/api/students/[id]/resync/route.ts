import { connectDB } from '@/lib/db';
import Student from '@/models/Student';
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const student = await Student.findById(params.id);
  const res = await axios.get(`https://codeforces.com/api/user.info?handles=${student.codeforcesHandle}`);
  const data = res.data.result[0];

  student.currentRating = data.rating;
  student.maxRating = data.maxRating;
  student.lastSynced = new Date();
  await student.save();

  return NextResponse.json({ success: true });
}

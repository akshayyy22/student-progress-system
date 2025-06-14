import { connectDB } from '@/lib/db';
import Student from '@/models/Student';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDB();
  const latestStudent = await Student.findOne().sort({ lastSynced: -1 }).select('lastSynced');
  return NextResponse.json({ lastSynced: latestStudent?.lastSynced ?? null });
}

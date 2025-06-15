import { connectDB } from '@/lib/db';
import Student from '@/models/Student';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDB();
  const students = await Student.find();
  return NextResponse.json(students);
}

export async function POST(req: Request) {
  const data = await req.json();
  await connectDB();
  const student = await Student.create(data);
  return NextResponse.json(student, { status: 201 });
}

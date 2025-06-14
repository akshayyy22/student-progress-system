import { connectDB } from '@/lib/db';
import Student from '@/models/Student';
import { NextResponse } from 'next/server';

export async function PUT(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const student = await Student.findById(params.id);
  if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 });

  student.autoReminder = !student.autoReminder;
  await student.save();

  return NextResponse.json({ success: true, autoReminder: student.autoReminder });
}

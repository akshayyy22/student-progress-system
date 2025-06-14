

import { connectDB } from '@/lib/db';
import CronSettings from '@/models/CronSettings';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';


export async function POST(req: Request) {
  await connectDB();
  const { time } = await req.json();

  await CronSettings.deleteMany({}); // clear old
  await CronSettings.create({ cronTime: time });

  // Write to cron-config.json as well
  const configPath = path.join(process.cwd(), 'cron-config.json');
  await fs.writeFile(configPath, JSON.stringify({ time }, null, 2), 'utf-8');

  return NextResponse.json({ success: true });
}

export async function GET() {
  await connectDB();
  const setting = await CronSettings.findOne();
  const time = setting?.cronTime || '0 2 * * *';
  return NextResponse.json({ time });
}

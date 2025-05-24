import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({ message: 'Connected to MongoDB successfully!' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to connect to MongoDB' }, { status: 500 });
  }
}
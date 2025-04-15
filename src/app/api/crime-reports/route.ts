import { connectToDatabase } from '@/lib/mongodb';
import { CrimeReport } from '@/models/CrimeReport';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();
    const reports = await CrimeReport.find({}).populate('reportedBy', 'name email');
    return NextResponse.json({ reports }, { status: 200 });
  } catch (error) {
    console.error('Error fetching crime reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch crime reports' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const report = await CrimeReport.create(body);
    return NextResponse.json({ report }, { status: 201 });
  } catch (error) {
    console.error('Error creating crime report:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create crime report',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

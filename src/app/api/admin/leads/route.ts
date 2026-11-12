import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import NewsletterLead from '@/models/NewsletterLead';

export const dynamic = 'force-dynamic';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!session || !(session as any).user || (session as any).user.role !== 'admin') {
    return null;
  }
  return session;
}

export async function GET() {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    await dbConnect();
    const leads = await NewsletterLead.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      { leads },
      { status: 200, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (error) {
    console.error('Error fetching newsletter leads:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !['new', 'contacted'].includes(status)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    await dbConnect();
    const lead = await NewsletterLead.findByIdAndUpdate(id, { status }, { new: true });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ lead });
  } catch (error) {
    console.error('Error updating newsletter lead:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Lead id required' }, { status: 400 });
    }

    await dbConnect();
    await NewsletterLead.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Error deleting newsletter lead:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

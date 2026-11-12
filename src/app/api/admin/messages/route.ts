import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import ContactMessage from '@/models/ContactMessage';

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
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      { messages },
      { status: 200, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (error) {
    console.error('Error fetching contact messages:', error);
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

    if (!id || !['new', 'read', 'replied'].includes(status)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    await dbConnect();
    const message = await ContactMessage.findByIdAndUpdate(id, { status }, { new: true });

    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error updating contact message:', error);
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
      return NextResponse.json({ error: 'Message id required' }, { status: 400 });
    }

    await dbConnect();
    await ContactMessage.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

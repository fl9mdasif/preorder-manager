/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const preorder = await prisma.preorder.findUnique({
      where: { id },
    });

    if (!preorder) {
      return NextResponse.json({ error: 'Preorder not found' }, { status: 404 });
    }

    return NextResponse.json(preorder);
  } catch (error: any) {
    console.error(`Error fetching preorder ${error}`);
    return NextResponse.json(
      { error: 'Failed to fetch preorder' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existingPreorder = await prisma.preorder.findUnique({
      where: { id },
    });

    if (!existingPreorder) {
      return NextResponse.json({ error: 'Preorder not found' }, { status: 404 });
    }

    // Build update data object
    const updateData: any = {};

    if (body.name !== undefined) {
      if (typeof body.name !== 'string' || body.name.trim() === '') {
        return NextResponse.json({ error: 'Name cannot be empty' }, { status: 400 });
      }
      updateData.name = body.name.trim();
    }

    if (body.products !== undefined) {
      updateData.products = typeof body.products === 'number' ? body.products : parseInt(body.products, 10);
    }

    if (body.preorderWhen !== undefined) {
      updateData.preorderWhen = body.preorderWhen;
    }

    if (body.startsAt !== undefined) {
      if (!body.startsAt) {
        return NextResponse.json({ error: 'Starts at date is required' }, { status: 400 });
      }
      updateData.startsAt = new Date(body.startsAt);
    }

    if (body.endsAt !== undefined) {
      updateData.endsAt = body.endsAt ? new Date(body.endsAt) : null;
    }

    if (body.isActive !== undefined) {
      updateData.isActive = typeof body.isActive === 'boolean' ? body.isActive : body.isActive === 'true';
    }

    const updatedPreorder = await prisma.preorder.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedPreorder);
  } catch (error: any) {
    console.error(`Error updating preorder:`, error);
    return NextResponse.json(
      { error: 'Failed to update preorder' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const existingPreorder = await prisma.preorder.findUnique({
      where: { id },
    });

    if (!existingPreorder) {
      return NextResponse.json({ error: 'Preorder not found' }, { status: 404 });
    }

    await prisma.preorder.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Preorder deleted successfully', id });
  } catch (error: any) {
    console.error(`Error deleting preorder:`, error);
    return NextResponse.json(
      { error: 'Failed to delete preorder' },
      { status: 500 }
    );
  }
}

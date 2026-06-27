/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    
    // Parse query params
    const filter = searchParams.get('filter') || 'all';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '8', 10);

    // Build filters
    const where: any = {};
    if (filter === 'active') {
      where.isActive = true;
    } else if (filter === 'inactive') {
      where.isActive = false;
    }

    // Validate sortBy
    const validSortFields = ['name', 'createdAt', 'startsAt', 'endsAt'];
    const orderByField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const orderByOrder = order === 'asc' ? 'asc' : 'desc';

    // Pagination
    const skip = (page - 1) * limit;
    const take = limit;

    // Run parallel queries
    const [preorders, total] = await Promise.all([
      prisma.preorder.findMany({
        where,
        orderBy: {
          [orderByField]: orderByOrder,
        },
        skip,
        take,
      }),
      prisma.preorder.count({ where }),
    ]);

    return NextResponse.json({
      preorders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('Error fetching preorders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preorders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, products, preorderWhen, startsAt, endsAt, isActive } = body;

    // Simple validation
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!startsAt) {
      return NextResponse.json({ error: 'Starts at date is required' }, { status: 400 });
    }

    const createdPreorder = await prisma.preorder.create({
      data: {
        name: name.trim(),
        products: typeof products === 'number' ? products : parseInt(products || '1', 10),
        preorderWhen: preorderWhen || 'regardless-of-stock',
        startsAt: new Date(startsAt),
        endsAt: endsAt ? new Date(endsAt) : null,
        isActive: typeof isActive === 'boolean' ? isActive : true,
      },
    });

    return NextResponse.json(createdPreorder, { status: 201 });
  } catch (error: any) {
    console.error('Error creating preorder:', error);
    return NextResponse.json(
      { error: 'Failed to create preorder' },
      { status: 500 }
    );
  }
}

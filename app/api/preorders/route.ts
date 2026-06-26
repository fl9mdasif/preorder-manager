import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "GET /api/preorders placeholder" });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: "POST /api/preorders placeholder" });
}

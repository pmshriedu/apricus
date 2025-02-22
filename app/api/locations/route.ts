// app/api/locations/route.ts
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { handleSuccess, handleError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      include: {
        hotels: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return handleSuccess(locations);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug } = body;

    if (!name || !slug) {
      return new NextResponse(
        JSON.stringify({ success: false, error: "Name and slug are required" }),
        { status: 400 }
      );
    }

    const location = await prisma.location.create({
      data: {
        name,
        slug,
      },
    });

    return handleSuccess(location);
  } catch (error) {
    return handleError(error);
  }
}

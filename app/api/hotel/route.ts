// app/api/hotel/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleSuccess, handleError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const hotels = await prisma.hotel.findMany({
      include: {
        location: true,
      },
    });
    return handleSuccess(hotels);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, locationId } = body;

    if (!name || !locationId) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Name and location are required",
        }),
        { status: 400 }
      );
    }

    const hotel = await prisma.hotel.create({
      data: {
        name,
        description,
        locationId,
      },
      include: {
        location: true,
      },
    });

    return handleSuccess(hotel);
  } catch (error) {
    return handleError(error);
  }
}

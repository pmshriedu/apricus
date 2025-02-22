// app/api/hotels/location/[locationId]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { locationId: string } }
) {
  try {
    const hotels = await prisma.hotel.findMany({
      where: {
        locationId: params.locationId,
      },
      include: {
        images: {
          select: {
            id: true,
            url: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: hotels,
    });
  } catch (error) {
    console.error("Error fetching hotels:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch hotels",
      },
      { status: 500 }
    );
  }
}

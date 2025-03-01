import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const locationId = searchParams.get("locationId");

    // Build the query with location filter if provided
    const query = {
      where: locationId && locationId !== "all" ? { locationId } : undefined,
      orderBy: {
        name: "asc" as const,
      },
      select: {
        id: true,
        name: true,
        locationId: true,
        location: {
          select: {
            name: true,
          },
        },
      },
    };

    // Fetch hotels with applied filters
    const hotels = await prisma.hotel.findMany(query);

    // Map to simplified structure
    const formattedHotels = hotels.map((hotel) => ({
      id: hotel.id,
      name: hotel.name,
      locationId: hotel.locationId,
      location: hotel.location.name,
    }));

    return NextResponse.json({
      success: true,
      data: formattedHotels,
    });
  } catch (error) {
    console.error("Failed to fetch hotels:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch hotels" },
      { status: 500 }
    );
  }
}

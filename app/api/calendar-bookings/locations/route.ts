import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all locations ordered by name
    const locations = await prisma.location.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            hotels: true,
          },
        },
      },
    });

    // Map to simplified structure
    const formattedLocations = locations.map((location) => ({
      id: location.id,
      name: location.name,
      slug: location.slug,
      hotelCount: location._count.hotels,
    }));

    return NextResponse.json({
      success: true,
      data: formattedLocations,
    });
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}

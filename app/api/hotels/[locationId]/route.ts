//api/hotels/[locationId]/route.ts
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { handleSuccess, handleError } from "@/lib/api-helpers";

export async function GET(
  request: Request,
  { params }: { params: { locationId: string } }
) {
  try {
    const hotels = await prisma.hotel.findMany({
      where: {
        locationId: params.locationId,
      },
    });

    return handleSuccess(hotels);
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { locationId: string } }
) {
  try {
    const body = await request.json();
    const { name, slug } = body;

    if (!name || !slug) {
      return new NextResponse(
        JSON.stringify({ success: false, error: "Name and slug are required" }),
        { status: 400 }
      );
    }

    // Check if the slug is already in use by another location
    const existingLocation = await prisma.location.findFirst({
      where: {
        slug,
        NOT: {
          id: params.locationId,
        },
      },
    });

    if (existingLocation) {
      return new NextResponse(
        JSON.stringify({ success: false, error: "Slug already in use" }),
        { status: 400 }
      );
    }

    const location = await prisma.location.update({
      where: { id: params.locationId },
      data: { name, slug },
    });

    return handleSuccess(location);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { locationId: string } }
) {
  try {
    // Start a transaction to ensure all operations complete or none do
    await prisma.$transaction(async (tx) => {
      // First, delete all bookings associated with this location
      await tx.booking.deleteMany({
        where: {
          locationId: params.locationId,
        },
      });

      // Then, delete all hotels associated with this location
      await tx.hotel.deleteMany({
        where: {
          locationId: params.locationId,
        },
      });

      // Finally, delete the location itself
      await tx.location.delete({
        where: {
          id: params.locationId,
        },
      });
    });

    return handleSuccess({
      message: "Location and all related records deleted successfully",
    });
  } catch (error) {
    return handleError(error);
  }
}

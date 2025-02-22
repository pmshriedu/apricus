// app/api/hotel/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleSuccess, handleError } from "@/lib/api-helpers";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id: params.id },
      include: {
        location: true,
      },
    });

    if (!hotel) {
      return new NextResponse(
        JSON.stringify({ success: false, error: "Hotel not found" }),
        { status: 404 }
      );
    }

    return handleSuccess(hotel);
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const hotel = await prisma.hotel.update({
      where: {
        id: params.id,
      },
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.$transaction(async (tx) => {
      // First delete all bookings associated with this hotel
      await tx.booking.deleteMany({
        where: {
          hotelId: params.id,
        },
      });

      // Then delete the hotel
      await tx.hotel.delete({
        where: {
          id: params.id,
        },
      });
    });

    return handleSuccess({ message: "Hotel deleted successfully" });
  } catch (error) {
    return handleError(error);
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleSuccess, handleError } from "@/lib/api-helpers";

export async function GET(
  request: Request,
  { params }: { params: { hotelId: string } }
) {
  try {
    const { hotelId } = params;

    const hotel = await prisma.hotel.findUnique({
      where: {
        id: hotelId,
      },
      include: {
        location: true,
        images: true,
        rooms: {
          include: {
            images: true,
            amenities: true,
          },
        },
      },
    });

    if (!hotel) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Hotel not found",
        }),
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
  { params }: { params: { hotelId: string } }
) {
  try {
    const { hotelId } = params;
    const body = await request.json();
    const { name, description, locationId } = body;

    // Check if the hotel exists
    const existingHotel = await prisma.hotel.findUnique({
      where: {
        id: hotelId,
      },
    });

    if (!existingHotel) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Hotel not found",
        }),
        { status: 404 }
      );
    }

    // Validate required fields
    if (!name) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Name is required",
        }),
        { status: 400 }
      );
    }

    // Update the hotel
    const updatedHotel = await prisma.hotel.update({
      where: {
        id: hotelId,
      },
      data: {
        name,
        description,
        ...(locationId && { locationId }),
      },
      include: {
        location: true,
      },
    });

    return handleSuccess(updatedHotel);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { hotelId: string } }
) {
  try {
    const { hotelId } = params;

    // Check if the hotel exists
    const existingHotel = await prisma.hotel.findUnique({
      where: {
        id: hotelId,
      },
    });

    if (!existingHotel) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Hotel not found",
        }),
        { status: 404 }
      );
    }

    // Delete the hotel and all related records
    // Note: This relies on the Cascade delete behavior defined in your Prisma schema
    await prisma.hotel.delete({
      where: {
        id: hotelId,
      },
    });

    return handleSuccess({ message: "Hotel deleted successfully" });
  } catch (error) {
    return handleError(error);
  }
}

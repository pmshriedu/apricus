// app/api/hotel/[hotelId]/rooms/route.ts

import { prisma } from "@/lib/prisma";
import { handleSuccess, handleError } from "@/lib/api-helpers";

export async function GET(
  request: Request,
  { params }: { params: { hotelId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");

    // First, get all rooms for the hotel
    const rooms = await prisma.room.findMany({
      where: {
        hotelId: params.hotelId,
      },
      include: {
        images: true,
        amenities: true,
        bookings: {
          include: {
            booking: {
              select: {
                status: true,
              },
            },
          },
        },
      },
    });

    // If no dates are provided, return all rooms with full availability
    if (!checkIn || !checkOut) {
      return handleSuccess(
        rooms.map((room) => ({
          ...room,
          availableCount: room.totalCount || 0, // Default to 0 if totalCount is null
          isAvailable: (room.totalCount || 0) > 0,
        }))
      );
    }

    // Check for overlapping bookings for the selected dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Calculate available rooms for each room type based on active bookings
    const roomsWithAvailability = await Promise.all(
      rooms.map(async (room) => {
        const overlappingBookingsCount = await prisma.roomBooking.count({
          where: {
            roomId: room.id,
            AND: [
              {
                checkIn: {
                  lt: checkOutDate,
                },
              },
              {
                checkOut: {
                  gt: checkInDate,
                },
              },
              {
                booking: {
                  status: {
                    not: "CANCELLED",
                  },
                },
              },
            ],
          },
        });

        const availableCount = Math.max(
          0,
          (room.totalCount || 0) - overlappingBookingsCount
        );

        return {
          ...room,
          availableCount,
          isAvailable: availableCount > 0,
        };
      })
    );

    return handleSuccess(roomsWithAvailability);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(
  request: Request,
  { params }: { params: { hotelId: string } }
) {
  try {
    const {
      name,
      description,
      price,
      capacity,
      totalCount,
      amenityIds,
      imageUrls,
    } = await request.json();

    const room = await prisma.room.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        capacity: parseInt(capacity),
        totalCount: parseInt(totalCount) || 0, // Default to 0 if not provided
        hotelId: params.hotelId,
        amenities: {
          connect: amenityIds?.map((id: string) => ({ id })) || [],
        },
        images: {
          create: imageUrls?.map((url: string) => ({ url })) || [],
        },
      },
      include: {
        images: true,
        amenities: true,
      },
    });

    return handleSuccess(room);
  } catch (error) {
    return handleError(error);
  }
}

// Update a room
export async function PUT(
  request: Request
  // { params }: { params: { hotelId: string } }
) {
  try {
    const {
      id,
      name,
      description,
      price,
      capacity,
      totalCount,
      amenityIds,
      imageUrls,
    } = await request.json();

    // First disconnect all existing amenities and delete existing images
    await prisma.$transaction([
      prisma.room.update({
        where: { id },
        data: {
          amenities: {
            set: [], // Disconnect all amenities
          },
        },
      }),
      prisma.roomImage.deleteMany({
        where: { roomId: id },
      }),
    ]);

    // Then update room with new data
    const room = await prisma.room.update({
      where: { id },
      data: {
        name,
        description,
        price: parseFloat(price),
        capacity: parseInt(capacity),
        totalCount: parseInt(totalCount) || 0,
        amenities: {
          connect: amenityIds?.map((id: string) => ({ id })) || [],
        },
        images: {
          create: imageUrls?.map((url: string) => ({ url })) || [],
        },
      },
      include: {
        images: true,
        amenities: true,
      },
    });

    return handleSuccess(room);
  } catch (error) {
    return handleError(error);
  }
}

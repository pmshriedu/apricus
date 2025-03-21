//File : /app/api/hotel/[hotelId]/rooms/inventory/route.ts

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { handleSuccess, handleError } from "@/lib/api-helpers";

// Get room inventory for a specific hotel
export async function GET(
  request: NextRequest,
  { params }: { params: { hotelId: string } }
) {
  try {
    // Get the current date for active bookings calculation
    const today = new Date();

    // Get all rooms for the hotel with their booking counts
    const rooms = await prisma.room.findMany({
      where: {
        hotelId: params.hotelId,
      },
      select: {
        id: true,
        name: true,
        price: true,
        capacity: true,
        totalCount: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            bookings: {
              where: {
                booking: {
                  status: {
                    not: "CANCELLED",
                  },
                  checkOut: {
                    gte: today, // Only count active bookings
                  },
                },
              },
            },
          },
        },
      },
    });

    // Transform the data to include availability information
    const roomsWithInventory = rooms.map((room) => {
      const activeBookings = room._count.bookings;
      const availableCount = Math.max(0, room.totalCount - activeBookings);
      const occupancyRate =
        room.totalCount > 0
          ? Math.round((activeBookings / room.totalCount) * 100)
          : 0;

      return {
        ...room,
        activeBookings,
        availableCount,
        occupancyRate: `${occupancyRate}%`,
      };
    });

    return handleSuccess(roomsWithInventory);
  } catch (error) {
    return handleError(error);
  }
}

// Update room inventory (total count)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { hotelId: string } }
) {
  try {
    const { roomId, totalCount } = await request.json();

    if (!roomId || typeof totalCount !== "number" || totalCount < 0) {
      return NextResponse.json(
        { success: false, error: "Invalid room ID or total count" },
        { status: 400 }
      );
    }

    // Check if the room belongs to the specified hotel
    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        hotelId: params.hotelId,
      },
    });

    if (!room) {
      return NextResponse.json(
        {
          success: false,
          error: "Room not found or doesn't belong to this hotel",
        },
        { status: 404 }
      );
    }

    // Get current active bookings count
    const activeBookingsCount = await prisma.roomBooking.count({
      where: {
        roomId: roomId,
        booking: {
          status: {
            not: "CANCELLED",
          },
          checkOut: {
            gte: new Date(),
          },
        },
      },
    });

    // Verify the new total count is not less than active bookings
    if (totalCount < activeBookingsCount) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot set total count below current active bookings (${activeBookingsCount})`,
        },
        { status: 400 }
      );
    }

    // Update the total count
    const updatedRoom = await prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        totalCount: totalCount,
      },
    });

    return handleSuccess(updatedRoom);
  } catch (error) {
    return handleError(error);
  }
}

// Bulk update room inventory
export async function PUT(
  request: NextRequest,
  { params }: { params: { hotelId: string } }
) {
  try {
    const { updates } = await request.json();

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid updates format" },
        { status: 400 }
      );
    }

    // Validate all updates
    for (const update of updates) {
      if (
        !update.roomId ||
        typeof update.totalCount !== "number" ||
        update.totalCount < 0
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid room ID or total count in updates",
          },
          { status: 400 }
        );
      }

      // Check if the room belongs to the hotel and get active bookings
      const room = await prisma.room.findFirst({
        where: {
          id: update.roomId,
          hotelId: params.hotelId,
        },
        include: {
          _count: {
            select: {
              bookings: {
                where: {
                  booking: {
                    status: {
                      not: "CANCELLED",
                    },
                    checkOut: {
                      gte: new Date(),
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!room) {
        return NextResponse.json(
          {
            success: false,
            error: `Room ${update.roomId} not found or doesn't belong to this hotel`,
          },
          { status: 404 }
        );
      }

      // Verify the new total count is not less than active bookings
      if (update.totalCount < room._count.bookings) {
        return NextResponse.json(
          {
            success: false,
            error: `Cannot set total count for room ${update.roomId} below current active bookings (${room._count.bookings})`,
          },
          { status: 400 }
        );
      }
    }

    // Perform bulk update using transaction
    const result = await prisma.$transaction(
      updates.map(({ roomId, totalCount }) =>
        prisma.room.update({
          where: {
            id: roomId,
            hotelId: params.hotelId,
          },
          data: {
            totalCount,
          },
        })
      )
    );

    return handleSuccess(result);
  } catch (error) {
    return handleError(error);
  }
}

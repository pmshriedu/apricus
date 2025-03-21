// app/api/hotel/[hotelId]/bookings/active/route.ts

import { prisma } from "@/lib/prisma";
import { handleSuccess, handleError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { hotelId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");

    if (!checkIn || !checkOut) {
      return handleError("Check-in and check-out dates are required");
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Get all active bookings that overlap with the specified date range
    const bookings = await prisma.roomBooking.findMany({
      where: {
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
              hotelId: params.hotelId,
              status: {
                not: "CANCELLED",
              },
            },
          },
        ],
      },
      include: {
        room: {
          select: {
            id: true,
            name: true,
            totalCount: true,
          },
        },
        booking: {
          select: {
            id: true,
            fullName: true,
            email: true,
            status: true,
          },
        },
      },
    });

    // Transform the data for easier consumption by the frontend
    const formattedBookings = bookings.map((booking) => ({
      id: booking.id,
      roomId: booking.roomId,
      bookingId: booking.bookingId,
      roomName: booking.room.name,
      guestName: booking.booking.fullName,
      email: booking.booking.email,
      status: booking.booking.status,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
    }));

    return handleSuccess(formattedBookings);
  } catch (error) {
    return handleError(error);
  }
}

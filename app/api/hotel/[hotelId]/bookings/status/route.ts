import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { handleSuccess, handleError } from "@/lib/api-helpers";

// Get booking status for a specific hotel with filters
export async function GET(
  request: NextRequest,
  { params }: { params: { hotelId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate")
      ? new Date(searchParams.get("startDate") as string)
      : new Date();
    const endDate = searchParams.get("endDate")
      ? new Date(searchParams.get("endDate") as string)
      : new Date();

    // Set end of day for the endDate
    endDate.setHours(23, 59, 59, 999);

    // Current date and time for status calculation
    const now = new Date();

    // Get all bookings for the hotel within the date range
    const bookings = await prisma.booking.findMany({
      where: {
        hotelId: params.hotelId,
        OR: [
          {
            // Bookings that check in during the date range
            checkIn: {
              gte: startDate,
              lte: endDate,
            },
          },
          {
            // Bookings that check out during the date range
            checkOut: {
              gte: startDate,
              lte: endDate,
            },
          },
          {
            // Bookings that span the date range
            AND: [
              {
                checkIn: {
                  lte: startDate,
                },
              },
              {
                checkOut: {
                  gte: endDate,
                },
              },
            ],
          },
        ],
        // Don't include canceled bookings
        status: {
          not: "CANCELLED",
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        hotel: {
          select: {
            name: true,
          },
        },
        location: {
          select: {
            name: true,
          },
        },
        roomBookings: {
          include: {
            room: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
        transaction: {
          select: {
            amount: true,
            totalAmount: true,
            status: true,
            paymentMethod: true,
          },
        },
      },
    });

    // Calculate checkout time (12:00 PM)
    const getCheckoutTime = (date: Date) => {
      const checkoutTime = new Date(date);
      checkoutTime.setHours(12, 0, 0, 0);
      return checkoutTime;
    };

    // Transform the data to include status information
    const bookingsWithStatus = bookings.map((booking) => {
      const checkInDate = new Date(booking.checkIn);
      const checkOutDate = new Date(booking.checkOut);
      const checkOutTime = getCheckoutTime(checkOutDate);

      // Determine booking status
      let status = "Upcoming";
      let statusCode = 0; // 0: Upcoming, 1: Checked In, 2: Checked Out

      if (now >= checkInDate && now < checkOutTime) {
        status = "Checked In";
        statusCode = 1;
      } else if (now >= checkOutTime) {
        status = "Checked Out";
        statusCode = 2;
      }

      // Calculate due checkout time
      const checkoutTimeFormatted = `${checkOutDate.toLocaleDateString()} 12:00 PM`;

      // Calculate duration of stay in days
      const durationMs = checkOutDate.getTime() - checkInDate.getTime();
      const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));

      // Format dates for display
      const checkInFormatted = checkInDate.toLocaleDateString();
      const checkOutFormatted = checkOutDate.toLocaleDateString();

      // Get room information
      const rooms = booking.roomBookings.map((rb) => ({
        name: rb.room.name,
        price: rb.room.price,
      }));

      // Calculate if late checkout (past 12 PM on checkout day)
      const isLateCheckout =
        now > checkOutTime &&
        now.toDateString() === checkOutDate.toDateString() &&
        statusCode === 1;

      return {
        id: booking.id,
        guestName: booking.fullName,
        email: booking.email,
        phone: booking.phoneNo,
        userAccount: booking.user?.name || "Guest Booking",
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString(),
        checkInFormatted,
        checkOutFormatted,
        durationDays,
        checkoutTime: checkoutTimeFormatted,
        status,
        statusCode,
        isLateCheckout,
        rooms,
        adults: booking.adults,
        children: booking.childrens,
        hotelName: booking.hotel.name,
        locationName: booking.location.name,
        paymentStatus: booking.transaction?.status || "PENDING",
        paymentMethod: booking.transaction?.paymentMethod || "Not Specified",
        totalAmount: booking.transaction?.totalAmount || 0,
      };
    });

    return handleSuccess(bookingsWithStatus);
  } catch (error) {
    return handleError(error);
  }
}

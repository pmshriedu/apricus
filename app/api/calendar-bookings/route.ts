import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Booking, RoomBooking, Prisma } from "@prisma/client";

// Define proper types for our included relations
type BookingWithRelations = Booking & {
  roomBookings: (RoomBooking & {
    room: {
      id: string;
      name: string;
      price: number;
    };
  })[];
  hotel: {
    id: string;
    name: string;
  };
  location: {
    name: string;
  };
  user: {
    name: string | null;
    email: string;
  } | null;
};

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const hotelId = searchParams.get("hotelId");
    const locationId = searchParams.get("locationId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build the query with proper type
    const query: Prisma.BookingFindManyArgs = {
      where: {},
      include: {
        roomBookings: {
          include: {
            room: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
        hotel: {
          select: {
            id: true,
            name: true,
          },
        },
        location: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    };

    // Apply filters if provided
    if (hotelId && hotelId !== "all") {
      query.where = { ...query.where, hotelId };
    }

    if (locationId && locationId !== "all") {
      query.where = { ...query.where, locationId };
    }

    // Filter by date range if provided
    if (startDate || endDate) {
      query.where = {
        ...query.where,
        OR: [],
      };

      if (startDate && endDate) {
        // Bookings that overlap with the selected date range
        query.where.OR?.push({
          AND: [
            { checkIn: { lte: new Date(endDate) } },
            { checkOut: { gte: new Date(startDate) } },
          ],
        });
      } else if (startDate) {
        query.where.OR?.push({ checkIn: { gte: new Date(startDate) } });
      } else if (endDate) {
        query.where.OR?.push({ checkOut: { lte: new Date(endDate) } });
      }
    }

    // Fetch bookings with applied filters
    const bookings = (await prisma.booking.findMany(
      query
    )) as unknown as BookingWithRelations[];

    // Build the room query - Using correct Prisma types for orderBy
    const whereCondition =
      hotelId && hotelId !== "all" ? { hotelId } : undefined;

    // Fetch rooms with their hotel info
    const roomsWithHotel = await prisma.room.findMany({
      where: whereCondition,
      orderBy: {
        name: "asc" as Prisma.SortOrder,
      },
      include: {
        hotel: true,
      },
    });

    // Map to simplified structure
    const rooms = roomsWithHotel.map((room) => ({
      id: room.id,
      name: room.name,
      hotelId: room.hotelId,
      capacity: room.capacity,
      hotelName: room.hotel.name,
    }));

    console.log("Fetched calendar bookings:", bookings);

    // Format response for calendar display
    const formattedResponse = {
      bookings: bookings.map((booking) => {
        // Check if booking has roomBookings
        if (!booking.roomBookings || booking.roomBookings.length === 0) {
          // Create a default roomBooking using the booking's check-in/check-out dates
          // This ensures the booking still appears on the calendar even without specific room assignments
          return {
            id: booking.id,
            fullName: booking.fullName,
            email: booking.email,
            phoneNo: booking.phoneNo,
            checkIn: booking.checkIn.toISOString().split("T")[0],
            checkOut: booking.checkOut.toISOString().split("T")[0],
            status: booking.status,
            hotelName: booking.hotel.name, // Make sure hotel name is included
            hotelId: booking.hotel.id,
            locationName: booking.location.name,
            rooms: rooms
              .filter((room) => room.hotelId === booking.hotelId)
              .slice(0, 1) // Use the first room from the hotel as a fallback
              .map((room) => ({
                roomId: room.id,
                roomName: room.name,
                checkIn: booking.checkIn.toISOString().split("T")[0],
                checkOut: booking.checkOut.toISOString().split("T")[0],
              })),
          };
        }

        // Normal case with roomBookings
        return {
          id: booking.id,
          fullName: booking.fullName,
          email: booking.email,
          phoneNo: booking.phoneNo,
          checkIn: booking.checkIn.toISOString().split("T")[0],
          checkOut: booking.checkOut.toISOString().split("T")[0],
          status: booking.status,
          hotelName: booking.hotel.name, // Make sure hotel name is included
          hotelId: booking.hotel.id,
          locationName: booking.location.name,
          rooms: booking.roomBookings.map((rb) => ({
            roomId: rb.roomId,
            roomName: rb.room.name,
            checkIn: rb.checkIn.toISOString().split("T")[0],
            checkOut: rb.checkOut.toISOString().split("T")[0],
          })),
        };
      }),
      rooms: rooms,
    };

    return NextResponse.json({ success: true, data: formattedResponse });
  } catch (error) {
    console.error("Failed to fetch calendar bookings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch calendar bookings" },
      { status: 500 }
    );
  }
}

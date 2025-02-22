// app/api/hotel/[hotelId]/rooms/route.ts
import { NextResponse } from "next/server";
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

    if (!checkIn || !checkOut) {
      const rooms = await prisma.room.findMany({
        where: {
          hotelId: params.hotelId,
        },
        include: {
          images: true,
          amenities: true,
          bookings: true,
        },
      });

      return handleSuccess(
        rooms.map((room) => ({
          ...room,
          isAvailable: true,
        }))
      );
    }

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
          where: {
            AND: [
              {
                checkIn: {
                  lt: new Date(checkOut),
                },
              },
              {
                checkOut: {
                  gt: new Date(checkIn),
                },
              },
            ],
          },
        },
      },
    });

    // Check for overlapping bookings
    const unavailableRoomIds = (
      await prisma.roomBooking.findMany({
        where: {
          AND: [
            {
              checkIn: {
                lt: new Date(checkOut),
              },
            },
            {
              checkOut: {
                gt: new Date(checkIn),
              },
            },
          ],
          booking: {
            status: {
              not: "CANCELLED",
            },
          },
        },
        select: {
          roomId: true,
        },
      })
    ).map((booking) => booking.roomId);

    const roomsWithAvailability = rooms.map((room) => ({
      ...room,
      isAvailable: !unavailableRoomIds.includes(room.id),
    }));

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
    const { name, description, price, capacity, amenityIds, imageUrls } =
      await request.json();

    const room = await prisma.room.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        capacity: parseInt(capacity),
        hotelId: params.hotelId,
        amenities: {
          connect: amenityIds.map((id: string) => ({ id })),
        },
        images: {
          create: imageUrls.map((url: string) => ({ url })),
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

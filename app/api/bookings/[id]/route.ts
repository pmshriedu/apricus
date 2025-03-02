// app/api/bookings/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validation";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const booking = await prisma.booking.findUnique({
      where: {
        id: params.id,
      },
      include: {
        hotel: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
          },
        },
        transaction: true,
        roomBookings: {
          include: {
            room: {
              select: {
                name: true,
                price: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ data: booking });
  } catch (error) {
    console.error("Failed to fetch booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = bookingSchema.partial().parse(body);

    const booking = await prisma.booking.update({
      where: {
        id: params.id,
      },
      data: {
        ...validatedData,
        checkIn: validatedData.checkIn
          ? new Date(validatedData.checkIn)
          : undefined,
        checkOut: validatedData.checkOut
          ? new Date(validatedData.checkOut)
          : undefined,
      },
      include: {
        hotel: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
          },
        },
        transaction: true,
        roomBookings: {
          include: {
            room: {
              select: {
                name: true,
                price: true,
                description: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ data: booking });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid booking data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Failed to update booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // First, delete all related roomBookings
    await prisma.roomBooking.deleteMany({
      where: {
        bookingId: params.id,
      },
    });

    // If there's a transaction related to this booking, we need to handle it too
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { transaction: true },
    });

    if (booking?.transaction) {
      await prisma.transaction.delete({
        where: { id: booking.transaction.id },
      });
    }

    // Now delete the booking itself
    await prisma.booking.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete booking:", error);
    return NextResponse.json(
      {
        error: "Failed to delete booking",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

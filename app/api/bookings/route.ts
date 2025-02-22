import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const BookingSchema = z.object({
  checkIn: z.string(),
  checkOut: z.string(),
  adults: z.number().min(1),
  childrens: z.number().min(0),
  fullName: z.string().min(2),
  phoneNo: z.string().min(10),
  email: z.string().email(),
  companyName: z.string().optional(),
  gstNumber: z.string().optional(),
  locationId: z.string(),
  hotelId: z.string(),
  roomId: z.string(),
});

function calculateNights(checkIn: Date, checkOut: Date): number {
  const diffTime = checkOut.getTime() - checkIn.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = BookingSchema.parse(body);

    // Check if the room is already booked for these dates
    const existingBooking = await prisma.roomBooking.findFirst({
      where: {
        roomId: validatedData.roomId,
        booking: {
          status: {
            not: "CANCELLED",
          },
        },
        AND: [
          {
            checkIn: {
              lt: new Date(validatedData.checkOut),
            },
          },
          {
            checkOut: {
              gt: new Date(validatedData.checkIn),
            },
          },
        ],
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        {
          success: false,
          error: "Room is not available for the selected dates",
        },
        { status: 400 }
      );
    }

    // Get room details to access the price per night
    const room = await prisma.room.findUnique({
      where: { id: validatedData.roomId },
      select: { price: true },
    });

    if (!room) {
      return NextResponse.json(
        { success: false, error: "Room not found" },
        { status: 404 }
      );
    }

    // Calculate total amount based on number of nights
    const checkInDate = new Date(validatedData.checkIn);
    const checkOutDate = new Date(validatedData.checkOut);
    const numberOfNights = calculateNights(checkInDate, checkOutDate);
    const totalAmount = room.price * numberOfNights;

    // Create booking with a unique reference
    const bookingReference = crypto.randomUUID();

    // Use a transaction to ensure all records are created or none are
    const { booking, transaction } = await prisma.$transaction(
      async (prisma) => {
        // Create the booking
        const booking = await prisma.booking.create({
          data: {
            checkIn: checkInDate,
            checkOut: checkOutDate,
            adults: validatedData.adults,
            childrens: validatedData.childrens,
            fullName: validatedData.fullName,
            phoneNo: validatedData.phoneNo,
            email: validatedData.email,
            companyName: validatedData.companyName,
            gstNumber: validatedData.gstNumber,
            locationId: validatedData.locationId,
            hotelId: validatedData.hotelId,
            status: "PENDING",
            // Create the RoomBooking record at the same time
            roomBookings: {
              create: {
                roomId: validatedData.roomId,
                checkIn: checkInDate,
                checkOut: checkOutDate,
              },
            },
          },
          include: {
            roomBookings: true,
          },
        });

        // Create Razorpay order
        const order = await razorpay.orders.create({
          amount: Math.round(totalAmount * 100), // Convert to paise
          currency: "INR",
          receipt: bookingReference,
          notes: {
            bookingId: booking.id,
          },
        });

        // Create transaction record
        const transaction = await prisma.transaction.create({
          data: {
            amount: totalAmount,
            currency: "INR",
            userEmail: validatedData.email,
            userName: validatedData.fullName,
            razorpayOrderId: order.id,
            status: "PENDING",
            bookingId: booking.id,
          },
        });

        return { booking, transaction };
      }
    );

    return NextResponse.json({
      success: true,
      booking,
      orderId: transaction.razorpayOrderId,
      transactionId: transaction.id,
      totalAmount,
      numberOfNights,
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create booking",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
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
        transaction: true,
        roomBookings: true, // Include roomBookings in the response
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ data: bookings });
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import Razorpay from "razorpay";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth-options";

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
  couponCode: z.string().optional(), // Add coupon code to schema
});

function calculateNights(checkIn: Date, checkOut: Date): number {
  const diffTime = checkOut.getTime() - checkIn.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function calculateTaxes(amount: number) {
  const gstRate = amount > 7500 ? 0.18 : 0.12;
  const totalTax = amount * gstRate;
  const sgst = totalTax / 2;
  const cgst = totalTax / 2;

  return {
    sgst,
    cgst,
    totalTax,
    totalAmount: amount + totalTax,
  };
}

async function calculateDiscount(
  couponCode: string | undefined,
  bookingAmount: number
) {
  if (!couponCode) return { discountAmount: 0, couponId: null };

  const coupon = await prisma.coupon.findFirst({
    where: {
      code: couponCode,
      isActive: true,
      currentUses: { lt: prisma.coupon.fields.maxUses },
      startDate: { lte: new Date() },
      endDate: { gte: new Date() },
      minBookingAmount: { lte: bookingAmount },
    },
  });

  if (!coupon) return { discountAmount: 0, couponId: null };

  const discountAmount =
    coupon.discountType === "PERCENTAGE"
      ? (bookingAmount * coupon.discountValue) / 100
      : coupon.discountValue;

  return {
    discountAmount: Math.min(discountAmount, bookingAmount),
    couponId: coupon.id,
  };
}

// Send booking confirmation email

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = BookingSchema.parse(body);

    // Verify the user exists in the database
    const userExists = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    // Check if room exists
    const room = await prisma.room.findUnique({
      where: { id: validatedData.roomId },
      select: { price: true, name: true },
    });

    if (!room) {
      return NextResponse.json(
        { success: false, error: "Room not found" },
        { status: 404 }
      );
    }

    const checkInDate = new Date(validatedData.checkIn);
    const checkOutDate = new Date(validatedData.checkOut);
    const numberOfNights = calculateNights(checkInDate, checkOutDate);
    const baseAmount = room.price * numberOfNights;

    // Calculate discount if coupon is provided
    const { discountAmount, couponId } = await calculateDiscount(
      validatedData.couponCode,
      baseAmount
    );
    const discountedAmount = baseAmount - discountAmount;

    // Calculate taxes based on discounted amount
    const { sgst, cgst, totalTax, totalAmount } =
      calculateTaxes(discountedAmount);

    const bookingReference = crypto.randomUUID();

    const { booking, transaction } = await prisma.$transaction(
      async (prisma) => {
        // Create booking data with conditional userId
        const bookingData = {
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
          status: "PENDING" as const, // Type assertion to fix the enum issue
          ...(userExists && { userId: session.user.id }),
          roomBookings: {
            create: {
              roomId: validatedData.roomId,
              checkIn: checkInDate,
              checkOut: checkOutDate,
            },
          },
        };

        const booking = await prisma.booking.create({
          data: bookingData,
          include: {
            roomBookings: true,
          },
        });

        // Create order with Razorpay using the total amount (including taxes)
        const order = await razorpay.orders.create({
          amount: Math.round(totalAmount * 100), // Use total amount with taxes
          currency: "INR",
          receipt: bookingReference,
          notes: {
            bookingId: booking.id,
          },
        });

        // Create transaction with tax details
        const transaction = await prisma.transaction.create({
          data: {
            amount: discountedAmount,
            totalAmount: totalAmount,
            sgst: sgst,
            cgst: cgst,
            currency: "INR",
            userEmail: validatedData.email,
            userName: validatedData.fullName,
            razorpayOrderId: order.id,
            status: "PENDING",
            bookingId: booking.id,
            couponId: couponId,
            discountAmount: discountAmount,
          },
        });

        // Increment coupon usage if applied
        if (couponId) {
          await prisma.coupon.update({
            where: { id: couponId },
            data: { currentUses: { increment: 1 } },
          });
        }

        return { booking, transaction };
      }
    );

    // Return comprehensive response with all price components
    return NextResponse.json({
      success: true,
      booking,
      orderId: transaction.razorpayOrderId,
      transactionId: transaction.id,
      baseAmount: baseAmount, // Original room price * nights
      discountAmount: discountAmount, // Coupon discount amount
      discountedAmount: discountedAmount, // After applying discount
      sgst: sgst, // SGST component
      cgst: cgst, // CGST component
      totalTax: totalTax, // Total tax amount
      totalAmount: totalAmount, // Final amount with taxes
      numberOfNights,
      gstRate: discountedAmount > 7500 ? 18 : 12, // GST rate applied
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

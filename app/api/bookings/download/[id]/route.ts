// app/api/bookings/download/[id]/route.ts
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { prisma } from "@/lib/prisma";
import { generateBookingPDF } from "@/lib/pdf-generator";
import { convertPrismaBookingToInterface } from "@/lib/booking-helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get booking ID from the URL parameters
    const bookingId = params.id;

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    // Get the authenticated user's session
    const session = await getServerSession(authOptions);

    // If no session or user, return unauthorized
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get the user ID from the session
    const userId = session.user.id;

    // Fetch the booking with all necessary details
    const prismaBooking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
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
    });

    // Check if booking exists
    if (!prismaBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Verify that the booking belongs to the authenticated user
    if (prismaBooking.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized access to this booking" },
        { status: 403 }
      );
    }

    // Convert Prisma booking to our interface type
    const booking = convertPrismaBookingToInterface(prismaBooking);

    // Generate the PDF
    const pdfBuffer = await generateBookingPDF(booking);

    // Create a response with the PDF
    const response = new NextResponse(pdfBuffer);

    // Set appropriate headers
    response.headers.set("Content-Type", "application/pdf");
    response.headers.set(
      "Content-Disposition",
      `attachment; filename="booking-${bookingId}.pdf"`
    );

    return response;
  } catch (error) {
    console.error("Failed to generate booking PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate booking PDF" },
      { status: 500 }
    );
  }
}

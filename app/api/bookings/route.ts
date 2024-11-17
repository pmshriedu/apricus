// app/api/bookings/route.ts

import { prisma } from "@/lib/prisma";
import { handleSuccess, handleError } from "@/lib/api-helpers";
import { ApiError } from "@/lib/utils";
import { transporter } from "@/lib/nodemailer";
import { generateEmailTemplate } from "@/lib/nodemailer-template";
import { generateCustomerConfirmationEmail } from "@/lib/customer-booking-template";

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        location: true,
        hotel: true,
      },
    });
    return handleSuccess(bookings);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate required fields
    const requiredFields = [
      "checkIn",
      "checkOut",
      "adults",
      "fullName",
      "phoneNo",
      "email",
      "locationId",
      "hotelId",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        throw new ApiError(400, `${field} is required`);
      }
    }

    // Validate dates
    const checkIn = new Date(body.checkIn);
    const checkOut = new Date(body.checkOut);

    if (isNaN(checkIn.getTime())) {
      throw new ApiError(400, "Invalid check-in date");
    }
    if (isNaN(checkOut.getTime())) {
      throw new ApiError(400, "Invalid check-out date");
    }
    if (checkIn >= checkOut) {
      throw new ApiError(400, "Check-out date must be after check-in date");
    }

    // Validate adults
    if (body.adults < 1) {
      throw new ApiError(400, "At least one adult is required");
    }

    // Validate childrens if provided
    const childrens = body.childrens ?? 0;
    if (childrens < 0) {
      throw new ApiError(400, "Number of childrens cannot be negative");
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        checkIn,
        checkOut,
        adults: body.adults,
        childrens,
        fullName: body.fullName,
        phoneNo: body.phoneNo,
        email: body.email,
        locationId: body.locationId,
        hotelId: body.hotelId,
        status: "PENDING",
      },
      include: {
        hotel: true,
        location: true,
      },
    });

    const bookingWithStringDates = {
      ...booking,
      checkIn: booking.checkIn.toISOString(),
      checkOut: booking.checkOut.toISOString(),
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    };
    // Send emails
    try {
      // Send detailed notification to admin
      await transporter.sendMail({
        from: `"Apricus Hotels" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `New Booking Request - ${booking.hotel.name}`,
        html: generateEmailTemplate(bookingWithStringDates),
        priority: "high",
      });

      // Send confirmation email to customer
      await transporter.sendMail({
        from: `"Apricus Hotels" <${process.env.EMAIL_USER}>`,
        to: booking.email,
        subject: `Booking Request Received - ${booking.hotel.name}`,
        html: generateCustomerConfirmationEmail(bookingWithStringDates),
      });
    } catch (emailError) {
      if (emailError instanceof Error) {
        console.error("Failed to send email:", {
          error: emailError.message,
          stack: emailError.stack,
          errorCode: (emailError as NodeJS.ErrnoException).code ?? "Unknown", // Safe type narrowing
        });
      } else {
        console.error("An unexpected error occurred:", emailError);
      }
    }

    return handleSuccess(booking);
  } catch (error) {
    return handleError(error);
  }
}

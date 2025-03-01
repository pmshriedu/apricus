// lib/email-utils.ts
import { prisma } from "@/lib/prisma";
import { transporter } from "@/lib/nodemailer";
import { generateEmailTemplate } from "@/lib/nodemailer-template";

// Send booking confirmation email
export async function sendBookingConfirmationEmail(bookingId: string | null) {
  try {
    if (!bookingId) {
      console.error("Cannot send confirmation email: Booking ID is null");
      return false;
    }
    // Fetch the complete booking details with related data
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        hotel: {
          select: { name: true },
        },
        location: {
          select: { name: true },
        },
        transaction: true,
        roomBookings: {
          include: {
            room: {
              select: { name: true, price: true },
            },
          },
        },
      },
    });

    if (!booking) {
      console.error(`Could not find booking with ID: ${bookingId}`);
      return false;
    }

    // Format booking data for email template
    const emailData = {
      id: booking.id,
      fullName: booking.fullName,
      email: booking.email,
      phoneNo: booking.phoneNo,
      hotel: booking.hotel,
      location: booking.location,
      checkIn: booking.checkIn.toISOString(),
      checkOut: booking.checkOut.toISOString(),
      adults: booking.adults,
      childrens: booking.childrens,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
      // Add additional fields used in the email template
      roomName: booking.roomBookings[0]?.room.name || "Standard Room",
      price: booking.roomBookings[0]?.room.price || 0,
      transaction: booking.transaction
        ? {
            amount: booking.transaction.amount || 0,
            discountAmount: booking.transaction.discountAmount || 0,
            totalAmount: booking.transaction.totalAmount || 0,
            status: booking.transaction.status || "PENDING",
            sgst: booking.transaction.sgst || 0,
            cgst: booking.transaction.cgst || 0,
          }
        : null,
    };

    // Generate email HTML
    const emailHtml = generateEmailTemplate(emailData);

    await transporter.sendMail({
      from: '"Apricus Hotels" <crs@apricushotels.com>',
      to: booking.email,
      subject: `Booking Confirmation - ${booking.hotel.name}`,
      html: emailHtml,
    });

    await transporter.sendMail({
      from: '"Apricus Hotels Booking System" <crs@apricushotels.com>',
      to: "crs@apricushotels.com",
      subject: `New Booking - ${booking.hotel.name} - ${booking.id}`,
      html: emailHtml,
    });

    console.log(`Booking confirmation email sent for booking ID: ${bookingId}`);
    return true;
  } catch (error) {
    console.error("Failed to send booking confirmation email:", error);
    return false;
  }
}

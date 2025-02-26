import PDFDocument from "pdfkit";
import { formatDate } from "@/lib/date-formatter";
import { formatCurrency } from "@/lib/currency-formatter";
import { BookingWithDetails } from "@/types/bookings";

export async function generateBookingPDF(
  booking: BookingWithDetails
): Promise<Buffer> {
  return new Promise((resolve) => {
    // Create a new PDF document
    const doc = new PDFDocument({ margin: 50 });

    // Buffer to store PDF
    const buffers: Buffer[] = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    // Use standard fonts
    doc.font("Helvetica");

    // Add hotel logo and header
    doc.fontSize(20).text("BOOKING CONFIRMATION", { align: "center" });
    doc.moveDown();

    // Add a horizontal rule
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // Hotel and booking information
    doc.fontSize(14).text(booking.hotel.name);
    doc.fontSize(10).text(booking.location.name);
    doc.moveDown();

    // Booking details
    doc.fontSize(12).text("Booking Details");
    doc.fontSize(10);
    doc.text(`Booking ID: ${booking.id}`);
    doc.text(`Status: ${booking.status}`);
    doc.text(`Booked On: ${new Date(booking.createdAt).toLocaleDateString()}`);
    doc.moveDown();

    // Guest information
    doc.fontSize(12).text("Guest Information");
    doc.fontSize(10);
    doc.text(`Name: ${booking.fullName}`);
    doc.text(`Email: ${booking.email}`);
    doc.text(`Phone: ${booking.phoneNo}`);
    doc.text(`Guests: ${booking.adults} Adults, ${booking.childrens} Children`);
    doc.moveDown();

    // Stay information
    doc.fontSize(12).text("Stay Information");
    doc.fontSize(10);
    doc.text(`Check-in: ${formatDate(booking.checkIn)}`);
    doc.text(`Check-out: ${formatDate(booking.checkOut)}`);

    // Calculate nights
    const checkInDate = new Date(booking.checkIn);
    const checkOutDate = new Date(booking.checkOut);
    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    doc.text(`Duration: ${nights} ${nights === 1 ? "night" : "nights"}`);
    doc.moveDown();

    // Room details
    doc.fontSize(12).text("Room Details");

    // Create a table for room information
    const roomTableTop = doc.y + 10;
    doc.font("Helvetica-Bold");
    doc.text("Room Type", 50, roomTableTop);
    doc.text("Price/Night", 400, roomTableTop, { width: 100, align: "right" });

    let roomTableY = roomTableTop + 20;

    // Draw the header line
    doc
      .moveTo(50, roomTableTop + 15)
      .lineTo(550, roomTableTop + 15)
      .stroke();

    // Add room entries
    doc.font("Helvetica");
    booking.roomBookings.forEach((roomBooking: any) => {
      doc.text(roomBooking.room.name, 50, roomTableY);
      doc.text(formatCurrency(roomBooking.room.price), 400, roomTableY, {
        width: 100,
        align: "right",
      });
      roomTableY += 20;
    });

    // Draw the footer line
    doc.moveTo(50, roomTableY).lineTo(550, roomTableY).stroke();
    doc.y = roomTableY + 20;

    // Payment information
    doc.fontSize(12).text("Payment Information");
    doc.fontSize(10);

    if (booking.transaction) {
      doc.text(`Total Amount: ${formatCurrency(booking.transaction.amount)}`);

      if (
        booking.transaction.discountAmount &&
        booking.transaction.discountAmount > 0
      ) {
        doc.text(
          `Discount Applied: ${formatCurrency(
            booking.transaction.discountAmount
          )}`
        );
      }

      doc.text(`Payment Status: ${booking.transaction.status}`);

      if (booking.transaction.razorpayPaymentId) {
        doc.text(`Payment ID: ${booking.transaction.razorpayPaymentId}`);
      }
    } else {
      doc.text("Payment Status: Pending");
    }

    doc.moveDown();

    // Hotel policies
    doc.fontSize(12).text("Hotel Policies");
    doc.fontSize(9);
    doc.text("• Check-in time is 2:00 PM and check-out time is 12:00 PM");
    doc.text(
      "• Early check-in and late check-out are subject to availability and may incur additional charges"
    );
    doc.text("• Government-issued photo ID is required at check-in");
    doc.text("• Pets are not allowed");

    doc.moveDown();

    // Footer
    doc
      .fontSize(8)
      .text(
        "For any queries regarding your booking, please contact us at support@example.com or call +1-800-123-4567",
        {
          align: "center",
        }
      );

    // Finalize the PDF
    doc.end();
  });
}

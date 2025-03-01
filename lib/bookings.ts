import { sendBookingConfirmationEmail } from "./email-utils";
import { prisma } from "./prisma";

export async function updateBookingStatus(
  transactionId: string,
  status: string
) {
  try {
    const transaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: { status },
      include: { booking: true },
    });

    if (status === "SUCCESS") {
      // Update booking status to CONFIRMED (not CANCELLED)
      if (transaction.booking) {
        await prisma.booking.update({
          where: { id: transaction.booking.id },
          data: { status: "CONFIRMED" }, // Changed from "CANCELLED" to "CONFIRMED"
        });
      }

      // Send confirmation email
      if (transaction.bookingId) {
        await sendBookingConfirmationEmail(transaction.bookingId);
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating booking status:", error);
    return { success: false, error: "Failed to update booking status" };
  }
}

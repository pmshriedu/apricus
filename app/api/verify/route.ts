import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendBookingConfirmationEmail } from "@/lib/email-utils";

const verifyRazorpaySignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  signature: string
): boolean => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET!;
  const generatedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(razorpayOrderId + "|" + razorpayPaymentId)
    .digest("hex");

  return generatedSignature === signature;
};

export async function POST(request: NextRequest) {
  try {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature } =
      await request.json();

    const isSignatureValid = verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    // First find the transaction with related booking
    const transaction = await prisma.transaction.findFirst({
      where: { razorpayOrderId },
      include: { booking: true },
    });

    if (!transaction) {
      return NextResponse.json(
        {
          message: "Transaction not found",
          isOk: false,
        },
        { status: 404 }
      );
    }

    if (!isSignatureValid) {
      // Update transaction status
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: "FAILED" },
      });

      // Only update booking if it exists
      if (transaction.booking) {
        await prisma.booking.update({
          where: { id: transaction.booking.id },
          data: { status: "CANCELLED" },
        });
      }

      return NextResponse.json(
        {
          message: "Payment verification failed",
          isOk: false,
        },
        { status: 400 }
      );
    }

    // Update both transaction and booking status atomically
    const [updatedTransaction] = await prisma.$transaction([
      prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: "SUCCESS",
          razorpayPaymentId,
          razorpaySignature,
        },
      }),
      prisma.booking.update({
        where: { id: transaction.booking?.id },
        data: { status: "CONFIRMED" },
      }),
    ]);

    // Send confirmation email after successful payment verification
    if (transaction.booking?.id) {
      try {
        await sendBookingConfirmationEmail(transaction.booking.id);
        console.log(`Email sent for booking: ${transaction.booking.id}`);
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
        // Don't fail the transaction if email fails
      }
    }

    return NextResponse.json(
      {
        message: "Payment verified successfully",
        isOk: true,
        transactionId: updatedTransaction.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        isOk: false,
      },
      { status: 500 }
    );
  }
}

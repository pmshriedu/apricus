// src/app/api/transaction/[id]/update/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBookingConfirmationEmail } from "@/lib/email-utils";

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const { status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Missing id or status" },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { booking: true },
    });

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Update transaction and booking status atomically
    const [updatedTransaction] = await prisma.$transaction([
      prisma.transaction.update({
        where: { id },
        data: { status },
      }),
      // Update booking status if it exists
      ...(transaction.booking
        ? [
            prisma.booking.update({
              where: { id: transaction.booking.id },
              data: {
                status: status === "SUCCESS" ? "CONFIRMED" : "CANCELLED",
              },
            }),
          ]
        : []),
    ]);

    // Send confirmation email for successful transactions
    if (status === "SUCCESS" && transaction.booking?.id) {
      try {
        await sendBookingConfirmationEmail(transaction.booking.id);
        console.log(`Email sent for booking: ${transaction.booking.id}`);
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      transaction: updatedTransaction,
    });
  } catch (error) {
    console.error("Transaction status update error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

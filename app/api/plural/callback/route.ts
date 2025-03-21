import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBookingConfirmationEmail } from "@/lib/email-utils";
import { verifySignature } from "@/utils/signature";

// Handle both GET and POST methods
export async function GET(request: NextRequest) {
  return handleCallback(request);
}

export async function POST(request: NextRequest) {
  return handleCallback(request);
}

async function handleCallback(request: NextRequest) {
  try {
    // Extract parameters from either query params (GET) or body (POST)
    let orderId, status, signature, transactionId, merchantOrderReference;

    if (request.method === "POST") {
      // For POST requests, try to parse the body as form data
      const formData = await request.formData().catch(() => null);

      if (formData) {
        // Extract data from form data
        orderId = formData.get("order_id") as string;
        status = formData.get("status") as string;
        signature = formData.get("signature") as string;
        transactionId = formData.get("txn_id") as string;
        merchantOrderReference = formData.get(
          "merchant_order_reference"
        ) as string;
      } else {
        // Try as JSON if form data parsing fails
        const body = await request.json().catch(() => ({}));
        orderId = body.order_id;
        status = body.status;
        signature = body.signature;
        transactionId = body.txn_id;
        merchantOrderReference = body.merchant_order_reference;
      }
    } else {
      // For GET requests, use search params
      const searchParams = request.nextUrl.searchParams;
      orderId = searchParams.get("order_id");
      status = searchParams.get("status");
      signature = searchParams.get("signature");
      transactionId = searchParams.get("txn_id");
      merchantOrderReference = searchParams.get("merchant_order_reference");
    }

    console.log("Plural callback received:", {
      method: request.method,
      orderId,
      status,
      signature,
      transactionId,
      merchantOrderReference,
    });

    // Make sure APP_URL is properly defined to prevent null URL errors
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Verify if orderId and status are present
    if (!orderId || !status) {
      console.error("Missing required parameters in callback");
      return NextResponse.redirect(
        `${appUrl}/bookings/failure?reason=missing_params`
      );
    }

    // Optional signature verification if PLURAL_SIGNATURE_SECRET is available
    if (process.env.PLURAL_SIGNATURE_SECRET && signature) {
      // Create data object for verification
      const dataToVerify: Record<string, string> = {
        order_id: orderId,
        status: status,
      };

      if (transactionId) dataToVerify.txn_id = transactionId;
      if (merchantOrderReference)
        dataToVerify.merchant_order_reference = merchantOrderReference;

      const isValid = verifySignature(
        dataToVerify,
        signature,
        process.env.PLURAL_SIGNATURE_SECRET
      );

      if (!isValid) {
        console.error("Invalid signature in callback");
        return NextResponse.redirect(
          `${appUrl}/bookings/failure?reason=invalid_signature`
        );
      }
    }

    // Handle different payment statuses
    const successStatuses = ["AUTHORIZED", "PROCESSED", "CAPTURED"];

    if (successStatuses.includes(status)) {
      try {
        // Find the transaction by plural order ID
        const transaction = await prisma.transaction.findFirst({
          where: {
            pluralOrderId: orderId,
          },
          include: {
            booking: true,
          },
        });

        // If no transaction found with pluralOrderId, try by razorpayOrderId (which we used as merchant_order_reference)
        if (!transaction && merchantOrderReference) {
          const transactionByRef = await prisma.transaction.findFirst({
            where: {
              razorpayOrderId: merchantOrderReference,
            },
            include: {
              booking: true,
            },
          });

          if (transactionByRef) {
            // Update the transaction with the plural order ID
            await prisma.transaction.update({
              where: { id: transactionByRef.id },
              data: {
                pluralOrderId: orderId,
              },
            });
          }
        }

        // Retry finding the transaction after possible update
        const updatedTransaction = await prisma.transaction.findFirst({
          where: {
            OR: [
              { pluralOrderId: orderId },
              { razorpayOrderId: merchantOrderReference },
            ],
          },
          include: {
            booking: true,
          },
        });

        if (!updatedTransaction) {
          console.error(
            "Transaction not found for order:",
            orderId,
            merchantOrderReference
          );
          return NextResponse.redirect(
            `${appUrl}/bookings/failure?reason=transaction_not_found`
          );
        }

        // Update transaction and booking status atomically
        const [finalTransaction] = await prisma.$transaction([
          prisma.transaction.update({
            where: { id: updatedTransaction.id },
            data: {
              status: "SUCCESS",
              pluralOrderId: orderId,
              pluralTransactionId: transactionId || "plural-txn-" + Date.now(),
              paymentMethod: "PLURAL",
              updatedAt: new Date(), // Ensure timestamp is updated
            },
          }),
          // Update booking status if it exists
          ...(updatedTransaction.booking
            ? [
                prisma.booking.update({
                  where: { id: updatedTransaction.booking.id },
                  data: {
                    status: "CONFIRMED",
                    updatedAt: new Date(), // Ensure timestamp is updated
                  },
                }),
              ]
            : []),
        ]);

        // Send confirmation email after successful payment
        if (updatedTransaction.booking?.id) {
          try {
            await sendBookingConfirmationEmail(updatedTransaction.booking.id);
            console.log(
              `Email sent for booking: ${updatedTransaction.booking.id}`
            );
          } catch (emailError) {
            console.error("Failed to send confirmation email:", emailError);
            // Don't fail the transaction if email fails
          }
        }

        // Add a small delay to ensure the database transaction is fully committed
        // await new Promise((resolve) => setTimeout(resolve, 500));

        // Payment successful - redirect to success page with transaction ID
        return NextResponse.redirect(
          `${appUrl}/bookings/success?transactionId=${finalTransaction.id}`
        );
      } catch (dbError) {
        console.error("Database error during payment processing:", dbError);
        return NextResponse.redirect(
          `${appUrl}/bookings/failure?reason=db_error`
        );
      }
    } else {
      // Payment failed or other status - update transaction status
      try {
        // Find the transaction and update its status
        const transaction = await prisma.transaction.findFirst({
          where: {
            OR: [
              { pluralOrderId: orderId },
              { razorpayOrderId: merchantOrderReference },
            ],
          },
          include: { booking: true },
        });

        if (transaction) {
          await prisma.$transaction([
            prisma.transaction.update({
              where: { id: transaction.id },
              data: {
                status: "FAILED",
                pluralOrderId: orderId,
                pluralTransactionId:
                  transactionId || "plural-txn-failed-" + Date.now(),
                updatedAt: new Date(), // Ensure timestamp is updated
              },
            }),
            // Update booking if it exists
            ...(transaction.booking
              ? [
                  prisma.booking.update({
                    where: { id: transaction.booking.id },
                    data: {
                      status: "CANCELLED",
                      updatedAt: new Date(), // Ensure timestamp is updated
                    },
                  }),
                ]
              : []),
          ]);
        }

        console.log("Payment failed or cancelled with status:", status);
        return NextResponse.redirect(
          `${appUrl}/bookings/failure?reason=${status.toLowerCase()}`
        );
      } catch (error) {
        console.error("Error updating transaction status:", error);
        return NextResponse.redirect(
          `${appUrl}/bookings/failure?reason=update_error`
        );
      }
    }
  } catch (error) {
    console.error("Callback API error:", error);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(
      `${appUrl}/bookings/failure?reason=server_error`
    );
  }
}

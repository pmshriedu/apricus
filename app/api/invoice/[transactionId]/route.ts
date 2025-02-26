import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { Invoices } from "razorpay/dist/types/invoices";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function GET(
  request: NextRequest,
  { params }: { params: { transactionId: string } }
) {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: params.transactionId },
      include: {
        booking: {
          include: {
            hotel: true,
            location: true,
          },
        },
      },
    });

    if (!transaction || !transaction.razorpayPaymentId) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    try {
      // First check if payment exists and has an invoice
      const payment = await razorpay.payments.fetch(
        transaction.razorpayPaymentId
      );

      if (payment.invoice_id) {
        const existingInvoice = await razorpay.invoices.fetch(
          payment.invoice_id
        );
        return NextResponse.json({
          invoice_url: existingInvoice.short_url,
          status: "success",
        });
      }

      // Format booking dates
      const checkIn = transaction.booking?.checkIn
        ? new Date(transaction.booking.checkIn).toLocaleDateString("en-IN")
        : "";
      const checkOut = transaction.booking?.checkOut
        ? new Date(transaction.booking.checkOut).toLocaleDateString("en-IN")
        : "";

      // Create description with booking details
      const description =
        `Hotel Booking Details:\n` +
        `Hotel: ${transaction.booking?.hotel?.name}\n` +
        `Location: ${transaction.booking?.location?.name}\n` +
        `Check-in: ${checkIn}\n` +
        `Check-out: ${checkOut}\n` +
        `Guests: ${transaction.booking?.adults} Adults, ${transaction.booking?.childrens} Children`;

      // Check if transaction is completed
      const isPaid =
        transaction.status === "COMPLETED" ||
        transaction.status === "SUCCESS" ||
        payment.status === "captured";

      // Use Razorpay's type from their SDK but extend it with additional properties
      const invoiceOptions: Invoices.RazorpayInvoiceCreateRequestBody & {
        status?: string;
        payment?: {
          payment_id: string;
        };
      } = {
        type: "invoice",
        description: description,
        customer: {
          name: transaction.userName,
          email: transaction.userEmail,
          contact: transaction.booking?.phoneNo || "",
          billing_address: {
            line1: "", // Required by Razorpay
            city: "", // Required by Razorpay
            state: "", // Required by Razorpay
            country: "IN", // Required by Razorpay
            zipcode: "", // Required by Razorpay
          },
        },
        line_items: [
          {
            name: "Hotel Room Booking",
            description: `Room booking at ${transaction.booking?.hotel?.name}`,
            amount: Math.round(transaction.amount * 100),
            currency: "INR",
            quantity: 1,
          },
        ],
        sms_notify: 1,
        email_notify: 1,
        receipt: transaction.id,
      };

      // If payment is already captured, create a paid invoice
      if (isPaid) {
        // Add payment details to the invoice
        invoiceOptions.status = "paid";
        invoiceOptions.payment = {
          payment_id: transaction.razorpayPaymentId,
        };
      }

      const invoice = await razorpay.invoices.create(invoiceOptions);

      if (!invoice || typeof invoice.short_url !== "string") {
        throw new Error("Invalid invoice response from Razorpay");
      }

      return NextResponse.json({
        invoice_url: invoice.short_url,
        status: "success",
      });
    } catch (razorpayError) {
      console.error("Razorpay invoice error:", razorpayError);

      // Fallback to basic receipt data
      return NextResponse.json({
        receipt_data: {
          transaction_id: transaction.id,
          payment_id: transaction.razorpayPaymentId,
          amount: transaction.amount,
          date: transaction.createdAt,
          customer_name: transaction.userName,
          customer_email: transaction.userEmail,
          company_name: transaction.booking?.companyName,
          gst_number: transaction.booking?.gstNumber,
          booking_details: {
            hotel: transaction.booking?.hotel?.name,
            location: transaction.booking?.location?.name,
            check_in: transaction.booking?.checkIn,
            check_out: transaction.booking?.checkOut,
            adults: transaction.booking?.adults,
            childrens: transaction.booking?.childrens,
          },
        },
        status: "fallback",
      });
    }
  } catch (error) {
    console.error("Invoice generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate invoice" },
      { status: 500 }
    );
  }
}

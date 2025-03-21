// src/app/api/plural/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pluralService } from "@/services/pluralService";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate the request data
    if (!data.amount || !data.orderReference) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find the transaction by Razorpay order ID (which we're using as merchant_order_reference)
    const transaction = await prisma.transaction.findFirst({
      where: {
        razorpayOrderId: data.orderReference,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Ensure amount is properly formatted for Plural
    // Plural expects amount in smallest currency unit (paise for INR)
    const amountInPaise = Math.round(parseFloat(data.amount) * 100);
    console.log("Amount in paise:", amountInPaise);

    // Build the absolute callback URL with fallback to localhost if env var is missing
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://www.apricushotels.com/";
    const callbackUrl = `${baseUrl}/api/plural/callback`;

    console.log("Using callback URL:", callbackUrl);

    // Process customer name properly
    const nameParts = data.customer.fullName
      ? data.customer.fullName.split(" ")
      : [data.customer.firstName, data.customer.lastName];

    const firstName = nameParts[0] || data.customer.firstName || "Guest";
    // Use a proper default last name instead of empty space
    const lastName =
      nameParts.length > 1
        ? nameParts.slice(1).join(" ")
        : data.customer.lastName || "Customer";

    const checkoutLinkRequest = {
      merchant_order_reference: data.orderReference,
      order_amount: {
        value: amountInPaise, // Use amount in paise
        currency: "INR",
      },
      pre_auth: false,
      allowed_payment_methods: [
        "CARD",
        "UPI",
        "NETBANKING",
        "POINTS",
        "WALLET",
      ],
      notes: data.notes || "Order from Apricus Hotels",
      callback_url: callbackUrl,
      purchase_details: {
        customer: {
          email_id: data.customer.email,
          first_name: firstName,
          last_name: lastName, // Now using a non-empty value
          customer_id: data.customer.id,
          mobile_number: data.customer.phone,
          // Include billing and shipping address if provided
          ...(data.customer.billingAddress && {
            billing_address: data.customer.billingAddress,
          }),
          ...(data.customer.shippingAddress && {
            shipping_address: data.customer.shippingAddress,
          }),
        },
        merchant_metadata: {
          ...data.metadata,
          bookingId: data.metadata?.bookingId || "",
          roomName: data.metadata?.roomName || "",
          hotelName: data.metadata?.hotelName || "",
          totalAmount: data.metadata?.totalAmount || amountInPaise.toString(),
          transactionId: transaction.id,
          transactionType: "HOTEL_BOOKING",
        },
      },
    };

    console.log(
      "Sending checkout request:",
      JSON.stringify(checkoutLinkRequest, null, 2)
    );

    const result = await pluralService.generateCheckoutLink(
      checkoutLinkRequest
    );

    // Update the transaction to indicate Plural payment attempt
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        paymentMethod: "PLURAL",
        pluralOrderId: result.order_id,
      },
    });

    return NextResponse.json({
      success: true,
      order_id: result.order_id,
      redirect_url: result.redirect_url,
      transactionId: transaction.id,
    });
  } catch (error) {
    console.error("Checkout API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate checkout link",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

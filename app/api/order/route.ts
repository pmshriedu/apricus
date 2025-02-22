// src/app/api/order/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { z } from "zod";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const OrderSchema = z.object({
  amount: z.number().min(1, "Amount must be at least 1"),
  currency: z.string().default("INR"),
  email: z.string().email("Invalid email"),
  name: z.string().min(2, "Name is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = OrderSchema.parse(body);

    const transaction = await prisma.transaction.create({
      data: {
        amount: validatedData.amount / 100,
        currency: validatedData.currency,
        userEmail: validatedData.email,
        userName: validatedData.name,
      },
    });

    const options = {
      amount: validatedData.amount,
      currency: validatedData.currency,
      receipt: transaction.id,
    };

    const order = await razorpay.orders.create(options);

    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { razorpayOrderId: order.id },
    });

    return NextResponse.json(
      {
        orderId: order.id,
        transactionId: transaction.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 }
    );
  }
}

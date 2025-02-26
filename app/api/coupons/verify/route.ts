// app/api/coupons/verify/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { code, bookingAmount } = await request.json();

    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      return NextResponse.json(
        { error: "Invalid coupon code" },
        { status: 400 }
      );
    }

    if (!coupon.isActive) {
      return NextResponse.json(
        { error: "Coupon is not active" },
        { status: 400 }
      );
    }

    const now = new Date();
    const endDate = new Date(coupon.endDate);

    if (endDate < now) {
      return NextResponse.json(
        { error: "Coupon has expired" },
        { status: 400 }
      );
    }

    if (coupon.currentUses >= coupon.maxUses) {
      return NextResponse.json(
        { error: "Coupon usage limit exceeded" },
        { status: 400 }
      );
    }

    const startDate = new Date(coupon.startDate);
    if (now < startDate) {
      return NextResponse.json(
        { error: "Coupon is not yet valid" },
        { status: 400 }
      );
    }

    if (coupon.minBookingAmount && bookingAmount < coupon.minBookingAmount) {
      return NextResponse.json(
        {
          error: `Minimum booking amount should be ₹${coupon.minBookingAmount}`,
        },
        { status: 400 }
      );
    }

    const discountAmount =
      coupon.discountType === "PERCENTAGE"
        ? (bookingAmount * coupon.discountValue) / 100
        : coupon.discountValue;

    return NextResponse.json({
      success: true,
      data: {
        ...coupon,
        discountAmount,
      },
    });
  } catch (error) {
    console.error("Error veriying coupon:", error);
    return NextResponse.json(
      { error: "Error verifying coupon" },
      { status: 500 }
    );
  }
}

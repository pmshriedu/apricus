// app/api/coupons/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      code,
      description,
      discountType,
      discountValue,
      maxUses,
      minBookingAmount,
      startDate,
      endDate,
    } = body;

    const coupon = await prisma.coupon.create({
      data: {
        code,
        description,
        discountType,
        discountValue,
        maxUses,
        minBookingAmount,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    return NextResponse.json({ success: true, data: coupon });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating coupon" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Add status calculation logic
    const couponsWithStatus = coupons.map((coupon) => {
      const now = new Date();
      const endDate = new Date(coupon.endDate);

      let status = "ACTIVE";
      if (!coupon.isActive) {
        status = "INACTIVE";
      } else if (endDate < now) {
        status = "EXPIRED";
      } else if (coupon.currentUses >= coupon.maxUses) {
        status = "EXHAUSTED";
      }

      return {
        ...coupon,
        status,
      };
    });

    return NextResponse.json({ success: true, data: couponsWithStatus });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching coupons" },
      { status: 500 }
    );
  }
}

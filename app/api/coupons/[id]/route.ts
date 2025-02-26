// app/api/coupons/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Transform the date strings to Date objects
    const updateData = {
      ...body,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      // Ensure numeric fields are properly typed
      discountValue:
        typeof body.discountValue === "string"
          ? parseFloat(body.discountValue)
          : body.discountValue,
      maxUses:
        typeof body.maxUses === "string"
          ? parseInt(body.maxUses)
          : body.maxUses,
      minBookingAmount: body.minBookingAmount
        ? typeof body.minBookingAmount === "string"
          ? parseFloat(body.minBookingAmount)
          : body.minBookingAmount
        : undefined,
    };

    const updatedCoupon = await prisma.coupon.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updatedCoupon });
  } catch (error) {
    console.error("Error updating coupon:", error);
    return NextResponse.json(
      { error: "Error updating coupon" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.coupon.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json(
      { error: "Error deleting coupon" },
      { status: 500 }
    );
  }
}

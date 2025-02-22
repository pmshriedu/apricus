// app/api/bookings/[id]/route.ts

import { prisma } from "@/lib/prisma";
import { handleSuccess, handleError } from "@/lib/api-helpers";
import { ApiError } from "@/lib/utils";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        location: true,
        hotel: true,
      },
    });

    if (!booking) {
      throw new ApiError(404, "Booking not found");
    }

    return handleSuccess(booking);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status: body.status,
        ...body,
      },
      include: {
        location: true,
        hotel: true,
      },
    });

    return handleSuccess(booking);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.booking.delete({
      where: { id: params.id },
    });

    return handleSuccess({ message: "Booking deleted successfully" });
  } catch (error) {
    return handleError(error);
  }
}

// app/api/hotel/[hotelId]/rooms/[roomId]/route.ts

import { prisma } from "@/lib/prisma";
import { handleSuccess, handleError } from "@/lib/api-helpers";

export async function PUT(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const { name, description, price, capacity, amenityIds } =
      await request.json();

    const room = await prisma.room.update({
      where: { id: params.roomId },
      data: {
        name,
        description,
        price: parseFloat(price),
        capacity: parseInt(capacity),
        amenities: {
          set: amenityIds.map((id: string) => ({ id })),
        },
      },
      include: {
        images: true,
        amenities: true,
      },
    });

    return handleSuccess(room);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    // First check if there are any bookings for this room
    const bookings = await prisma.roomBooking.findMany({
      where: { roomId: params.roomId },
    });

    if (bookings.length > 0) {
      // Option 1: Return an error if the room has bookings
      return handleError({
        message: "Cannot delete room with existing bookings",
        status: 400,
      });

      // Option 2: (Alternative) Delete related bookings first
      // await prisma.roomBooking.deleteMany({
      //   where: { roomId: params.roomId },
      // });
    }

    // Now it's safe to delete the room
    await prisma.room.delete({
      where: { id: params.roomId },
    });

    return handleSuccess({ message: "Room deleted successfully" });
  } catch (error) {
    return handleError(error);
  }
}

import { BookingWithDetails } from "@/types/bookings";
import { PrismaBooking } from "./prismabooking";

export function convertPrismaBookingToInterface(
  prismaBooking: PrismaBooking
): BookingWithDetails {
  return {
    id: prismaBooking.id,
    checkIn: prismaBooking.checkIn.toISOString(),
    checkOut: prismaBooking.checkOut.toISOString(),
    adults: prismaBooking.adults,
    childrens: prismaBooking.childrens,
    status: prismaBooking.status,
    fullName: prismaBooking.fullName,
    email: prismaBooking.email,
    phoneNo: prismaBooking.phoneNo,
    createdAt: prismaBooking.createdAt.toISOString(),
    updatedAt: prismaBooking.updatedAt.toISOString(),
    userId: prismaBooking.userId || undefined,
    hotel: {
      name: prismaBooking.hotel.name,
    },
    location: {
      name: prismaBooking.location.name,
    },
    transaction: prismaBooking.transaction
      ? {
          id: prismaBooking.transaction.id,
          amount: prismaBooking.transaction.amount,
          status: prismaBooking.transaction.status,
          discountAmount: prismaBooking.transaction.discountAmount || undefined,
          currency: prismaBooking.transaction.currency,
          razorpayPaymentId:
            prismaBooking.transaction.razorpayPaymentId || undefined,
        }
      : undefined,
    roomBookings: prismaBooking.roomBookings.map((rb) => ({
      id: rb.id,
      roomId: rb.roomId,
      bookingId: rb.bookingId,
      checkIn: rb.checkIn.toISOString(),
      checkOut: rb.checkOut.toISOString(),
      room: {
        name: rb.room.name,
        price: rb.room.price,
      },
    })),
  };
}

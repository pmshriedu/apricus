// File: /app/bookings/[roomId]/page.tsx
import BookingPaymentForm from "@/components/booking-form/booking-forms";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AuthCheck from "./auth-check";

interface BookingPageProps {
  params: {
    roomId: string;
  };
  searchParams: {
    checkIn: string;
    checkOut: string;
    adults: string;
    childrens: string;
    locationId: string;
    hotelId: string;
    amount: string;
  };
}

export default async function BookingPage({
  params,
  searchParams,
}: BookingPageProps) {
  const room = await prisma.room.findUnique({
    where: { id: params.roomId },
    include: {
      hotel: {
        include: {
          location: true,
        },
      },
    },
  });

  if (!room) {
    notFound();
  }

  // Convert search params to a string for auth check component
  const searchParamsString = new URLSearchParams(
    searchParams as Record<string, string>
  ).toString();

  return (
    <AuthCheck roomId={params.roomId} searchParams={searchParamsString}>
      <div className="container mx-auto py-8">
        <BookingPaymentForm
          roomData={{
            roomId: params.roomId,
            hotelId: searchParams.hotelId,
            locationId: searchParams.locationId,
            roomName: room.name,
            hotelName: room.hotel.name,
            locationName: room.hotel.location.name,
            checkIn: searchParams.checkIn,
            checkOut: searchParams.checkOut,
            adults: parseInt(searchParams.adults),
            childrens: parseInt(searchParams.childrens),
            price: parseFloat(searchParams.amount),
          }}
        />
      </div>
    </AuthCheck>
  );
}

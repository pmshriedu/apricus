import BookingPaymentForm from "@/components/booking-form/booking-forms";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

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
          location: true, // Include the location relation
        },
      },
    },
  });

  if (!room) {
    notFound();
  }

  return (
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
  );
}

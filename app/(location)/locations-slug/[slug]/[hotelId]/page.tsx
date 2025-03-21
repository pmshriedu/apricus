// app/(location)/locations-slug/[slug]/[hotelId]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import RoomList from "@/components/rooms/room-list";

interface HotelPageProps {
  params: {
    slug: string;
    hotelId: string;
  };
  searchParams: {
    checkIn?: string;
    checkOut?: string;
    adults?: string;
    childrens?: string;
    locationId?: string;
  };
}

export default async function HotelPage({
  params,
  searchParams,
}: HotelPageProps) {
  const hotel = await prisma.hotel.findUnique({
    where: {
      id: params.hotelId,
    },
    include: {
      rooms: {
        include: {
          images: true,
          amenities: true,
          bookings: {
            include: {
              booking: true,
            },
          },
        },
      },
      images: true,
      location: true,
    },
  });

  if (!hotel) {
    notFound();
  }

  const bookingDetails = {
    checkIn: searchParams.checkIn || "",
    checkOut: searchParams.checkOut || "",
    adults: parseInt(searchParams.adults || "1"),
    childrens: parseInt(searchParams.childrens || "0"),
    locationId: hotel.locationId,
    hotelId: hotel.id,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-comfortaaBold text-primary mb-4">
            {hotel.name}
          </h1>
          <p className="text-gray-600">
            {hotel.description || "Experience luxury and comfort at our hotel."}
          </p>
        </div>

        <RoomList rooms={hotel.rooms} bookingDetails={bookingDetails} />
      </div>
    </div>
  );
}

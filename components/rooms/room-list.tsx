// components/rooms/room-list.tsx
import { Room, RoomImage, Amenity, RoomBooking } from "@prisma/client";
import RoomCard from "./room-card";

interface RoomWithImagesAndAmenities extends Room {
  images: RoomImage[];
  amenities: Amenity[];
  bookings: RoomBooking[];
}

interface BookingDetails {
  checkIn: string;
  checkOut: string;
  adults: number;
  childrens: number;
  locationId: string;
  hotelId: string;
}

interface RoomListProps {
  rooms: RoomWithImagesAndAmenities[];
  bookingDetails: BookingDetails;
}

export default function RoomList({ rooms, bookingDetails }: RoomListProps) {
  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-xl font-comfortaaMedium text-gray-600">
          No rooms available for this hotel.
        </h3>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-comfortaaSemiBold text-gray-800">
        Available Rooms
      </h2>
      <div className="grid grid-cols-1 gap-8">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} bookingDetails={bookingDetails} />
        ))}
      </div>
    </div>
  );
}

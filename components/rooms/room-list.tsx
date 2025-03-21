"use client";
// components/rooms/room-list.tsx
import {
  Room,
  RoomImage,
  Amenity,
  RoomBooking,
  BookingStatus,
} from "@prisma/client";
import RoomCard from "./room-card";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface RoomWithImagesAndAmenities extends Room {
  images: RoomImage[];
  amenities: Amenity[];
  bookings: (RoomBooking & {
    booking: {
      status: BookingStatus;
    };
  })[];
  availableCount?: number;
  isAvailable?: boolean;
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
  const [roomsWithAvailability, setRoomsWithAvailability] = useState<
    RoomWithImagesAndAmenities[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set loading state when dates change
    if (bookingDetails.checkIn && bookingDetails.checkOut) {
      setLoading(true);
    }

    async function calculateAvailability() {
      if (bookingDetails.checkIn && bookingDetails.checkOut) {
        try {
          // Fetch real-time availability from the API
          const searchParams = new URLSearchParams({
            checkIn: bookingDetails.checkIn,
            checkOut: bookingDetails.checkOut,
          });

          const response = await fetch(
            `/api/hotel/${
              bookingDetails.hotelId
            }/rooms?${searchParams.toString()}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch room availability");
          }

          const data = await response.json();

          if (data.success && Array.isArray(data.data)) {
            // Create a mapping of room IDs to their availability data
            const availabilityMap = data.data.reduce(
              (
                acc: Record<
                  string,
                  { availableCount: number; isAvailable: boolean }
                >,
                room: { id: string; availableCount?: number }
              ) => {
                acc[room.id] = {
                  availableCount: room.availableCount || 0,
                  isAvailable: (room.availableCount || 0) > 0,
                };
                return acc;
              },
              {}
            );

            // Update our room list with availability information
            const updatedRooms = rooms.map((room) => ({
              ...room,
              availableCount: availabilityMap[room.id]?.availableCount || 0,
              isAvailable: availabilityMap[room.id]?.isAvailable || false,
            }));

            setRoomsWithAvailability(updatedRooms);
          } else {
            // If API fails, fall back to client-side calculation
            fallbackCalculation();
          }
        } catch (error) {
          console.error("Error fetching availability:", error);
          // Fall back to client-side calculation if the API fails
          fallbackCalculation();
        } finally {
          setLoading(false);
        }
      } else {
        // If no dates selected, set all rooms to their total count
        const updatedRooms = rooms.map((room) => ({
          ...room,
          availableCount: room.totalCount || 0,
          isAvailable: (room.totalCount || 0) > 0,
        }));

        setRoomsWithAvailability(updatedRooms);
        setLoading(false);
      }
    }

    function fallbackCalculation() {
      if (bookingDetails.checkIn && bookingDetails.checkOut) {
        const checkInDate = new Date(bookingDetails.checkIn);
        const checkOutDate = new Date(bookingDetails.checkOut);

        const updatedRooms = rooms.map((room) => {
          // Count overlapping bookings for this room type
          const overlappingBookings = room.bookings.filter((booking) => {
            if (!booking.booking) return false;
            if (booking.booking.status === "CANCELLED") return false;

            const bookingCheckIn = new Date(booking.checkIn);
            const bookingCheckOut = new Date(booking.checkOut);

            return (
              bookingCheckIn < checkOutDate && bookingCheckOut > checkInDate
            );
          });

          // Calculate available rooms
          const availableCount = Math.max(
            0,
            (room.totalCount || 0) - overlappingBookings.length
          );

          return {
            ...room,
            availableCount,
            isAvailable: availableCount > 0,
          };
        });

        setRoomsWithAvailability(updatedRooms);
      }
    }

    calculateAvailability();
  }, [
    rooms,
    bookingDetails.checkIn,
    bookingDetails.checkOut,
    bookingDetails.hotelId,
  ]);

  if (loading && bookingDetails.checkIn && bookingDetails.checkOut) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-gray-600 font-comfortaaMedium">
          Checking room availability...
        </p>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-xl font-comfortaaMedium text-gray-600">
          No rooms available for this hotel.
        </h3>
      </div>
    );
  }

  // Sort rooms: available ones first, then by price
  const sortedRooms = [...roomsWithAvailability].sort((a, b) => {
    // First sort by availability
    if ((a.availableCount || 0) > 0 && (b.availableCount || 0) <= 0) return -1;
    if ((a.availableCount || 0) <= 0 && (b.availableCount || 0) > 0) return 1;

    // Then sort by price (lowest first)
    return a.price - b.price;
  });

  const hasAvailableRooms = sortedRooms.some(
    (room) => (room.availableCount || 0) > 0
  );

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-comfortaaSemiBold text-gray-800">
        Available Rooms
      </h2>

      {!hasAvailableRooms &&
      bookingDetails.checkIn &&
      bookingDetails.checkOut ? (
        <Alert
          variant="destructive"
          className="bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800"
        >
          <AlertDescription className="font-comfortaaMedium">
            No rooms available for the selected dates. Please try different
            dates or contact us for assistance.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid grid-cols-1 gap-8">
        {sortedRooms.map((room) => (
          <RoomCard key={room.id} room={room} bookingDetails={bookingDetails} />
        ))}
      </div>
    </div>
  );
}

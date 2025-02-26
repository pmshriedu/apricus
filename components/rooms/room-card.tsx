"use client";

import { useState, ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Room, RoomImage, Amenity, RoomBooking } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/currency-formatter";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Bed, Users, Bath, Coffee, Wifi } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Carousel } from "@/components/ui/carousel";

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

interface RoomCardProps {
  room: RoomWithImagesAndAmenities;
  bookingDetails: BookingDetails;
}

const RoomCard = ({ room, bookingDetails }: RoomCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const defaultImage = "/images/placeholder-room.jpg";
  const mainImage =
    !imageError && room.images[0]?.url ? room.images[0].url : defaultImage;

  // Check if room is available for the selected dates
  const isRoomAvailable = () => {
    if (!bookingDetails.checkIn || !bookingDetails.checkOut) return true;

    const checkInDate = new Date(bookingDetails.checkIn);
    const checkOutDate = new Date(bookingDetails.checkOut);

    return !room.bookings.some((booking) => {
      const bookingCheckIn = new Date(booking.checkIn);
      const bookingCheckOut = new Date(booking.checkOut);

      // Check for any overlap
      return bookingCheckIn < checkOutDate && bookingCheckOut > checkInDate;
    });
  };

  const isAvailable = isRoomAvailable();

  const validateBookingDetails = () => {
    if (!bookingDetails.checkIn || !bookingDetails.checkOut) {
      return "Please select check-in and check-out dates";
    }
    if (!bookingDetails.adults || bookingDetails.adults < 1) {
      return "At least one adult is required";
    }
    if (bookingDetails.adults + bookingDetails.childrens > room.capacity) {
      return `This room's capacity (${room.capacity} guests) is not sufficient for your group`;
    }
    if (!isAvailable) {
      return "This room is not available for the selected dates";
    }
    return null;
  };

  const handleBookNow = () => {
    const validationError = validateBookingDetails();
    if (validationError) {
      toast({
        title: "Booking Error",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    const searchParams = new URLSearchParams({
      checkIn: bookingDetails.checkIn,
      checkOut: bookingDetails.checkOut,
      adults: bookingDetails.adults.toString(),
      childrens: bookingDetails.childrens.toString(),
      locationId: bookingDetails.locationId,
      hotelId: bookingDetails.hotelId,
      roomId: room.id,
      amount: room.price.toString(),
    });

    router.push(`/bookings/${room.id}?${searchParams.toString()}`);
  };

  // Calculate nights between check-in and check-out
  const calculateNights = () => {
    if (!bookingDetails.checkIn || !bookingDetails.checkOut) return 0;
    const checkIn = new Date(bookingDetails.checkIn);
    const checkOut = new Date(bookingDetails.checkOut);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const numberOfNights = calculateNights();
  const totalPrice = room.price * numberOfNights;

  // Define a type for the amenity icons
  type AmenityIcons = {
    [key: string]: ReactNode;
  };

  const amenityIcons: AmenityIcons = {
    "Wi-Fi": <Wifi className="w-4 h-4" />,
    "Coffee Maker": <Coffee className="w-4 h-4" />,
    "King Bed": <Bed className="w-4 h-4" />,
    Bathroom: <Bath className="w-4 h-4" />,
  };

  return (
    <Card
      className={`group transition-all duration-300 hover:shadow-lg ${
        !isAvailable ? "opacity-75 grayscale" : ""
      }`}
    >
      <div className="flex flex-col lg:flex-row">
        {/* Image Section */}
        <div className="relative h-72 lg:h-auto lg:w-2/5 overflow-hidden cursor-pointer">
          <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
            <DialogTrigger asChild>
              <div className="relative h-full">
                <Image
                  src={mainImage}
                  alt={room.name}
                  fill
                  className={`object-cover transition-transform duration-300 ${
                    isAvailable ? "group-hover:scale-105" : ""
                  }`}
                  onError={() => setImageError(true)}
                  priority={false}
                  loading="lazy"
                />
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <Carousel>
                {room.images.map((img, index) => (
                  <Image
                    key={index}
                    src={img.url}
                    alt={`Room image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                ))}
              </Carousel>
            </DialogContent>
          </Dialog>

          <div className="absolute top-4 right-4 space-y-2">
            <Badge className="bg-primary text-white font-comfortaaBold block">
              {formatCurrency(room.price)}/night
            </Badge>
            {numberOfNights > 0 && (
              <Badge className="bg-accent text-primary font-comfortaaBold block">
                {formatCurrency(totalPrice)} total
              </Badge>
            )}
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="flex-1 p-6 lg:p-8">
          <div className="flex flex-col h-full justify-between space-y-6">
            {/* Room Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-comfortaaBold text-gray-800 mb-2">
                  {room.name}
                </h3>
                <p className="text-gray-600 font-comfortaaRegular leading-relaxed">
                  {room.description || "No description available"}
                </p>
              </div>

              {/* Room Capacity */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-comfortaaMedium">
                    Up to {room.capacity} guests
                  </span>
                </div>
                {numberOfNights > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="font-comfortaaMedium text-gray-600">
                      {numberOfNights} night{numberOfNights > 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>

              {/* Amenities */}
              <div>
                <h4 className="font-comfortaaSemiBold text-gray-800 mb-3">
                  Room Amenities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity) => (
                    <span
                      key={amenity.id}
                      className="bg-accent/10 text-gray-700 px-3 py-1.5 rounded-full text-sm font-comfortaaRegular flex items-center"
                    >
                      {amenityIcons[amenity.name] && (
                        <span className="mr-1.5">
                          {amenityIcons[amenity.name]}
                        </span>
                      )}
                      {amenity.name}
                    </span>
                  ))}
                  {room.amenities.length === 0 && (
                    <span className="text-gray-500 text-sm italic">
                      No amenities listed
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Availability and Booking */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 ${
                    isAvailable ? "bg-green-500" : "bg-red-500"
                  } rounded-full`}
                ></div>
                <span
                  className={`${
                    isAvailable ? "text-green-600" : "text-red-600"
                  } font-comfortaaMedium`}
                >
                  {isAvailable
                    ? "Available for your dates"
                    : "Not available for selected dates"}
                </span>
              </div>
              <Button
                onClick={handleBookNow}
                disabled={!isAvailable}
                className={`w-full sm:w-auto font-comfortaaBold px-8 py-2.5 ${
                  isAvailable
                    ? "bg-primary hover:bg-primary/90 text-white"
                    : "bg-gray-400 cursor-not-allowed text-white"
                }`}
              >
                {isAvailable ? "Book Now" : "Unavailable"}
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default RoomCard;

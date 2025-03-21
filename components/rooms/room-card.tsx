"use client";

import { useState, ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Room,
  RoomImage,
  Amenity,
  RoomBooking,
  BookingStatus,
} from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/currency-formatter";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Bed, Users, Bath, Coffee, Wifi, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Carousel } from "@/components/ui/carousel";

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

  // Use the provided availableCount from parent component or default to 0
  const availableCount =
    typeof room.availableCount !== "undefined" ? room.availableCount : 0;

  // Use the provided isAvailable flag or calculate based on availableCount
  const isAvailable =
    typeof room.isAvailable !== "undefined"
      ? room.isAvailable
      : availableCount > 0;

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
    if (!isAvailable || availableCount <= 0) {
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

  // // Show dates are selected but no rooms are available
  // const datesSelectedNoRooms =
  //   bookingDetails.checkIn && bookingDetails.checkOut && !isAvailable;

  return (
    <Card
      className={`group transition-all duration-300 hover:shadow-lg ${
        !isAvailable || availableCount <= 0 ? "opacity-75 grayscale" : ""
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
                    isAvailable && availableCount > 0
                      ? "group-hover:scale-105"
                      : ""
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

              {/* Room Capacity and Inventory */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-comfortaaMedium">
                    Up to {room.capacity} guests
                  </span>
                </div>
                {numberOfNights > 0 && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="font-comfortaaMedium text-gray-600">
                      {numberOfNights} night{numberOfNights > 1 ? "s" : ""}
                    </span>
                  </div>
                )}
                {/* Room inventory status */}
                {bookingDetails.checkIn && bookingDetails.checkOut && (
                  <div className="flex items-center space-x-2">
                    <Bed className="w-5 h-5 text-primary" />
                    <span className="font-comfortaaMedium text-gray-600">
                      {availableCount} of {room.totalCount || 0} room
                      {(room.totalCount || 0) > 1 ? "s" : ""} available
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
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
                <div className="w-full sm:w-auto">
                  <div className="mb-3">
                    <h4 className="font-comfortaaSemiBold text-gray-800 text-lg">
                      Room Availability
                    </h4>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-1 rounded-md ${
                        isAvailable && availableCount > 0
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 ${
                          isAvailable && availableCount > 0
                            ? "bg-green-600"
                            : "bg-red-600"
                        } rounded-sm`}
                      ></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-comfortaaBold text-gray-800">
                        {isAvailable && availableCount > 0
                          ? "Available"
                          : "Unavailable"}
                      </span>
                      <span className="text-gray-600 text-sm font-comfortaaRegular">
                        {!bookingDetails.checkIn || !bookingDetails.checkOut
                          ? `${room.totalCount || 0} total room${
                              (room.totalCount || 0) > 1 ? "s" : ""
                            }`
                          : isAvailable && availableCount > 0
                          ? `${availableCount} of ${room.totalCount || 0} room${
                              availableCount > 1 ? "s" : ""
                            } available`
                          : "Not available for selected dates"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-full sm:w-auto flex flex-col">
                  {numberOfNights > 0 && (
                    <span className="text-right mb-2 text-gray-600 font-comfortaaRegular">
                      {formatCurrency(totalPrice)} total for {numberOfNights}{" "}
                      night{numberOfNights > 1 ? "s" : ""}
                    </span>
                  )}
                  <Button
                    onClick={handleBookNow}
                    disabled={!isAvailable || availableCount <= 0}
                    className={`w-full sm:w-auto font-comfortaaBold px-10 py-3 rounded-md ${
                      isAvailable && availableCount > 0
                        ? "bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow transition-all duration-300"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isAvailable && availableCount > 0
                      ? "Reserve Now"
                      : "Unavailable"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default RoomCard;

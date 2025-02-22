import React from "react";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

type Room = {
  image: string;
  title: string;
  description: string;
  price: number;
  amenities: string[];
};

const rooms: Room[] = [
  {
    image: "/images/roomfour.jpeg",
    title: "Deluxe Ocean Suite",
    description: "Spacious suite with panoramic sea views",
    price: 12000,
    amenities: ["Sea View", "Balcony", "Mini Bar", "Room Service"],
  },
  {
    image: "/images/roomone.jpg",
    title: "Premium Garden Room",
    description: "Elegant room overlooking lush gardens",
    price: 8000,
    amenities: ["Garden View", "King Bed", "Workspace", "Breakfast"],
  },
  {
    image: "/images/roomtwo.jpg",
    title: "Luxury Pool Villa",
    description: "Private villa with exclusive pool access",
    price: 15000,
    amenities: ["Private Pool", "Terrace", "Butler Service", "Spa Access"],
  },
  {
    image: "/images/roomthree.jpg",
    title: "Classic Comfort Room",
    description: "Cozy room with modern amenities",
    price: 6000,
    amenities: ["City View", "Queen Bed", "Smart TV", "Tea Station"],
  },
];

const RoomCard = ({ room }: { room: Room }) => (
  <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl bg-white">
    <CardHeader className="p-0 relative">
      <div className="relative h-48 lg:h-56">
        <Image
          src={room.image}
          alt={room.title}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
    </CardHeader>
    <CardContent className="flex-grow p-6">
      <h3 className="font-comfortaaBold text-xl mb-2">{room.title}</h3>
      <p className="text-gray-600 font-comfortaaRegular text-sm mb-4">
        {room.description}
      </p>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {room.amenities.map((amenity, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-comfortaaRegular"
            >
              {amenity}
            </span>
          ))}
        </div>
      </div>
    </CardContent>
    <CardFooter className="p-6 pt-0">
      <div className="w-full flex flex-col gap-4">
        <div className="flex justify-center items-center">
          <p className="font-comfortaaBold text-xl text-primary">
            ₹{room.price.toLocaleString()}
            <span className="text-sm font-comfortaaRegular text-gray-600">
              /night
            </span>
          </p>
        </div>
        {/* <Button className="w-full bg-primary hover:bg-primary/90 text-white font-comfortaaBold">
          Reserve Now
        </Button> */}
      </div>
    </CardFooter>
  </Card>
);

const RoomCards = () => {
  return (
    <section className="py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-comfortaaBold text-3xl lg:text-4xl text-primary mb-4">
            Luxurious Accommodations
          </h2>
          <p className="font-comfortaaRegular text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the pinnacle of comfort in our thoughtfully designed
            rooms and suites, where luxury meets Goan hospitality.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {rooms.map((room, index) => (
            <RoomCard key={index} room={room} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoomCards;

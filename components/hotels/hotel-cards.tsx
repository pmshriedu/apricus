"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface HotelCardProps {
  hotel: {
    id: string;
    name: string;
    description: string;
    images: { url: string }[];
    location: {
      slug: string;
      name: string;
    };
  };
  searchParams?: {
    checkIn?: string;
    checkOut?: string;
    adults?: string;
    childrens?: string;
  };
}

export default function HotelCard({ hotel, searchParams }: HotelCardProps) {
  const [imageError, setImageError] = useState(false);
  const router = useRouter();
  const defaultImage = "/images/placeholder-hotel.jpg";
  const mainImage =
    !imageError && hotel.images[0]?.url ? hotel.images[0].url : defaultImage;

  const handleViewRooms = () => {
    const params = new URLSearchParams(searchParams || {});
    const url = `/locations-slug/${hotel.location.slug}/${hotel.id}${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    router.push(url);
  };

  return (
    <Card className="group transition-all duration-300 hover:shadow-lg bg-white">
      <div className="relative">
        <div className="relative h-72 sm:h-80 overflow-hidden">
          <Image
            src={mainImage}
            alt={hotel.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            priority={false}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <Badge className="bg-primary text-white font-comfortaaMedium mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            {hotel.location.name}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-comfortaaBold text-gray-800 mb-2 line-clamp-1">
            {hotel.name}
          </h3>
          <p className="text-gray-600 font-comfortaaRegular line-clamp-3 leading-relaxed">
            {hotel.description}
          </p>
        </div>

        <div className="pt-2">
          <Button
            onClick={handleViewRooms}
            className="w-full bg-primary hover:bg-primary/90 text-white font-comfortaaBold transition-colors"
          >
            View Available Rooms
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

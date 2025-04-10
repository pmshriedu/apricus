"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  BedDouble,
  Wifi,
  Coffee,
  MapPin,
  Droplets,
  Wine,
  Utensils,
  Car,
  Dumbbell,
  Tv,
  Phone,
  Shield,
  Bath,
  Sun,
  PersonStanding,
  Baby,
  Shirt,
  Music,
  Waves,
  Hospital,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import BGNavigation from "@/components/hotel-nav/bliss-ganga";
import BookingModal from "@/components/checkin-modal/checkin-modal-layout";

interface Amenity {
  icon: React.ReactNode;
  label: string;
}

interface AmenityCategory {
  title: string;
  description: string;
  amenities: {
    icon: React.ReactNode;
    name: string;
    description: string;
  }[];
}

interface Room {
  id: string;
  title: string;
  description: string;
  image: string;
  amenities: Amenity[];
  size: string;
  maxGuests: number;
}

const amenityCategories: AmenityCategory[] = [
  {
    title: "Room Features",
    description: "Premium in-room amenities for your comfort",
    amenities: [
      {
        icon: <BedDouble className="h-6 w-6" />,
        name: "Premium Bedding",
        description: "Luxury linens with premium mattress and pillows",
      },
      {
        icon: <Tv className="h-6 w-6" />,
        name: "Entertainment",
        description: "55-inch Smart TV with streaming services",
      },
      {
        icon: <Bath className="h-6 w-6" />,
        name: "Luxury Bathroom",
        description: "Rain shower, premium toiletries, and plush robes",
      },
      {
        icon: <Coffee className="h-6 w-6" />,
        name: "Mini Kitchen",
        description: "Coffee maker, minibar, and basic kitchen amenities",
      },
    ],
  },
  {
    title: "Hotel Services",
    description: "World-class services for an exceptional stay",
    amenities: [
      {
        icon: <Utensils className="h-6 w-6" />,
        name: "24/7 Room Service",
        description: "Round-the-clock dining and refreshments",
      },
      {
        icon: <Car className="h-6 w-6" />,
        name: "Valet Parking",
        description: "Complimentary valet parking service",
      },
      {
        icon: <Phone className="h-6 w-6" />,
        name: "Concierge",
        description: "24-hour concierge assistance",
      },
      {
        icon: <Shirt className="h-6 w-6" />,
        name: "Laundry Service",
        description: "Same-day laundry and dry cleaning",
      },
    ],
  },
  {
    title: "Recreation & Wellness",
    description: "Facilities for your leisure and wellness",
    amenities: [
      {
        icon: <Waves className="h-6 w-6" />,
        name: "Swimming Pool",
        description: "Temperature-controlled infinity pool",
      },
      {
        icon: <Dumbbell className="h-6 w-6" />,
        name: "Fitness Center",
        description: "State-of-the-art gym equipment",
      },
      {
        icon: <Sun className="h-6 w-6" />,
        name: "Spa Services",
        description: "Full-service spa and wellness center",
      },
      {
        icon: <Music className="h-6 w-6" />,
        name: "Entertainment",
        description: "Live music and evening entertainment",
      },
    ],
  },
  {
    title: "Special Services",
    description: "Extra touches for a memorable stay",
    amenities: [
      {
        icon: <Baby className="h-6 w-6" />,
        name: "Family Services",
        description: "Babysitting and children's activities",
      },
      {
        icon: <PersonStanding className="h-6 w-6" />,
        name: "Butler Service",
        description: "Personal butler for premium suites",
      },
      {
        icon: <Hospital className="h-6 w-6" />,
        name: "Medical Assistance",
        description: "24/7 on-call medical support",
      },
      {
        icon: <Shield className="h-6 w-6" />,
        name: "Security",
        description: "24-hour security and surveillance",
      },
    ],
  },
];

const rooms: Room[] = [
  {
    id: "superior-suite",
    title: "Premium Rooms",
    description:
      "Perfect for families, featuring modern amenities and comfortable spaces with stunning views.",
    image: "/images/bliss/premium.jpg",
    amenities: [
      { icon: <BedDouble className="h-4 w-4" />, label: "King Size Bed" },
      { icon: <Wifi className="h-4 w-4" />, label: "Free High-Speed WiFi" },
      { icon: <Coffee className="h-4 w-4" />, label: "Room Service" },
      { icon: <MapPin className="h-4 w-4" />, label: "Pool View" },
      { icon: <Droplets className="h-4 w-4" />, label: "Rain Shower" },
      { icon: <Wine className="h-4 w-4" />, label: "Mini Bar" },
    ],

    size: "45m²",
    maxGuests: 3,
  },
  {
    id: "deluxe-suite",
    title: "Family Rooms",
    description:
      "Spacious suite with premium furnishings and exclusive benefits for an unforgettable stay.",
    image: "/images/bliss/family.jpg",
    amenities: [
      { icon: <BedDouble className="h-4 w-4" />, label: "2 Queen Beds" },
      { icon: <Wifi className="h-4 w-4" />, label: "Free High-Speed WiFi" },
      { icon: <Coffee className="h-4 w-4" />, label: "24/7 Service" },
      { icon: <MapPin className="h-4 w-4" />, label: "Balcony" },
      { icon: <Droplets className="h-4 w-4" />, label: "Luxury Bathroom" },
      { icon: <Wine className="h-4 w-4" />, label: "Premium Mini Bar" },
    ],

    size: "60m²",
    maxGuests: 6,
  },
  {
    id: "executive-suite",
    title: "Executive Rooms",
    description:
      "Luxury suite with premium amenities and panoramic views for the ultimate experience.",
    image: "/images/bliss/executive.jpg",
    amenities: [
      { icon: <BedDouble className="h-4 w-4" />, label: "Master Bedroom" },
      { icon: <Wifi className="h-4 w-4" />, label: "High-Speed WiFi" },
      { icon: <Coffee className="h-4 w-4" />, label: "Kitchen" },
      { icon: <MapPin className="h-4 w-4" />, label: "Private Terrace" },
      { icon: <Droplets className="h-4 w-4" />, label: "Jacuzzi" },
      { icon: <Wine className="h-4 w-4" />, label: "Premium Bar" },
    ],

    size: "85m²",
    maxGuests: 6,
  },
];

const RoomsPage: React.FC = () => {
  const router = useRouter();
  const locationId = "bliss-rooms-id";
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 font-comfortaaBold">
      {/* Hero Section */}
      <BGNavigation />
      <section className="relative h-[50vh] lg:h-[60vh]">
        <Image
          src="/images/bliss/hero1.jpg"
          alt="Luxury Accommodations"
          layout="fill"
          objectFit="cover"
          priority
          className="brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-accent/80 to-transparent" />
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-center h-full">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4"
            >
              Your Perfect Escape Awaits
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-white/90 max-w-2xl"
            >
              From cozy deluxe rooms to expansive luxury suites, experience
              personalized comfort with premium amenities, designer furnishings,
              and world-class service at your fingertips.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Tabs defaultValue="all-rooms" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="all-rooms">All Rooms</TabsTrigger>
            <TabsTrigger value="gallery">Room Gallery</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
          </TabsList>

          <TabsContent value="all-rooms">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room) => (
                <Card
                  key={room.id}
                  className="group hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={room.image}
                      alt={room.title}
                      layout="fill"
                      objectFit="cover"
                      className="group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-white/90">
                        {room.size} • Up to {room.maxGuests} guests
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-2xl">{room.title}</CardTitle>
                    <CardDescription>{room.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {room.amenities.map((amenity, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          {amenity.icon}
                          <span>{amenity.label}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center mt-10"
            >
              <BookingModal
                defaultLocationId={locationId}
                trigger={
                  <Button
                    size="lg"
                    className="px-8 py-6 text-lg bg-primary hover:bg-primary/90 transition-colors"
                  >
                    Book Your Stay Now
                  </Button>
                }
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="gallery">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="relative aspect-square overflow-hidden rounded-lg"
                >
                  <Image
                    src={room.image}
                    alt={room.title}
                    layout="fill"
                    objectFit="cover"
                    className="hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="amenities" className="py-8">
            <div className="grid grid-cols-1 gap-12">
              {amenityCategories.map((category, idx) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-primary mb-2">
                      {category.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {category.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {category.amenities.map((amenity, index) => (
                      <Card
                        key={index}
                        className="bg-card hover:bg-accent/10  transition-colors"
                      >
                        <CardHeader>
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                              {amenity.icon}
                            </div>
                            <CardTitle className="text-lg">
                              {amenity.name}
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {amenity.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {idx < amenityCategories.length - 1 && (
                    <Separator className="my-8" />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Additional Amenities Information */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-16 p-6 bg-card rounded-lg"
            >
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-2xl font-bold mb-4">
                  Experience Luxury at Every Turn
                </h3>
                <p className="text-muted-foreground mb-6">
                  All our rooms and suites include complimentary access to our
                  premium amenities and services. For special requests or
                  additional services, our concierge team is available 24/7 to
                  assist you.
                </p>
                <Button
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => router.push("/contact-us")}
                >
                  Contact Concierge
                </Button>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </section>
      {/* Add floating Book Now button for mobile - matching the BlissGanga implementation */}
      <div className="fixed bottom-20 left-0 right-0 z-50 px-4 md:hidden">
        <BookingModal
          defaultLocationId={locationId}
          className="w-full"
          trigger={
            <Button className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-full shadow-xl">
              Book Now
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default RoomsPage;

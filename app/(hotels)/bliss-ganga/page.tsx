"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Wifi,
  Clock,
  Utensils,
  Phone,
  Dumbbell,
  Briefcase,
  Users,
  Car,
  Plane,
  MapPin,
  Calendar,
  Mail,
  Building,
} from "lucide-react";
import Image from "next/image";
import BGNavigation from "@/components/hotel-nav/bliss-ganga";
import BookingModal from "@/components/checkin-modal/checkin-modal-layout";

interface ImageData {
  src: string;
  title: string;
  alt?: string;
}

interface Facility {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
}

const TheBlissGangaPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [currentGallerySlide, setCurrentGallerySlide] = useState<number>(0);

  // Define the location ID for Bliss Ganga
  const locationId = "bliss-ganga-id";

  const heroImages: string[] = [
    "/images/bliss/hero1.jpg",
    "/images/bliss/gallery7.jpg",
  ];

  const galleryImages: ImageData[] = [
    {
      src: "/images/bliss/hero1.jpg",
      title: "Bliss Ganga",
      alt: "Bliss Ganga",
    },
    {
      src: "/images/bliss/room1.jpg",
      title: "Bliss Ganga",
      alt: "Bliss Ganga",
    },
    {
      src: "/images/bliss/room2.jpg",
      title: "Bliss Ganga",
      alt: "Bliss Ganga",
    },
    {
      src: "/images/bliss/room3.jpg",
      title: "Bliss Ganga",
      alt: "Bliss Ganga",
    },
    {
      src: "/images/bliss/room4.jpg",
      title: "Bliss Ganga",
      alt: "Bliss Ganga",
    },
    {
      src: "/images/bliss/room5.jpg",
      title: "Bliss Ganga",
      alt: "Bliss Ganga",
    },
  ];

  const roomImages: ImageData[] = [
    {
      src: "/images/bliss/executive.jpg",
      title: "",
      alt: "Luxurious Master Bedroom",
    },
    {
      src: "/images/bliss/executive.jpg",
      title: "",
      alt: "Comfortable Hall",
    },
    {
      src: "/images/bliss/family.jpg",
      title: "",
      alt: "Drawing Room Setup",
    },
  ];

  const facilities: Facility[] = [
    { icon: Clock, name: "24-Hour Front Desk" },
    { icon: Wifi, name: "Free Wi-Fi" },
    { icon: Utensils, name: "Restaurant" },
    { icon: Phone, name: "Room Service" },
    { icon: Dumbbell, name: "Fitness Center" },
    { icon: Briefcase, name: "Business Center" },
    { icon: Users, name: "Conference Rooms" },
    { icon: Car, name: "Parking" },
    { icon: Plane, name: "Airport Shuttle" },
    { icon: Building, name: "Concierge Service" },
  ];

  const handleSlideChange = (
    direction: "next" | "prev",
    current: number,
    setCurrent: React.Dispatch<React.SetStateAction<number>>,
    length: number
  ): void => {
    if (direction === "next") {
      setCurrent((current + 1) % length);
    } else {
      setCurrent((current - 1 + length) % length);
    }
  };

  return (
    <div className="font-comfortaaRegular">
      {/* Hero Section */}
      <BGNavigation />
      <section className="relative h-[40rem]">
        <div className="absolute inset-0 bg-primary opacity-50 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url(${heroImages[currentSlide]})` }}
        />
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-white p-4">
          <h1 className="font-comfortaaBold text-4xl md:text-6xl text-center mb-6">
            Bliss Ganga
          </h1>
          <p className="font-comfortaaLight text-xl md:text-2xl text-center max-w-3xl">
            Experience luxury and comfort in the heart of Rishikesh
          </p>
        </div>
        <div className="absolute bottom-4 left-0 right-0 z-20 flex items-center justify-center px-4 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              handleSlideChange(
                "prev",
                currentSlide,
                setCurrentSlide,
                heroImages.length
              )
            }
            className="text-white hover:bg-white/20 bg-black/30 rounded-full mr-2"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              handleSlideChange(
                "next",
                currentSlide,
                setCurrentSlide,
                heroImages.length
              )
            }
            className="text-white hover:bg-white/20 bg-black/30 rounded-full"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>
        <div className="absolute inset-y-0 left-0 right-0 z-20 hidden md:flex items-center justify-between px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              handleSlideChange(
                "prev",
                currentSlide,
                setCurrentSlide,
                heroImages.length
              )
            }
            className="text-white hover:bg-white/20 bg-black/30 rounded-full"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              handleSlideChange(
                "next",
                currentSlide,
                setCurrentSlide,
                heroImages.length
              )
            }
            className="text-white hover:bg-white/20 bg-black/30 rounded-full"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-16 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-10">
            <h2 className="font-comfortaaBold text-3xl text-gray-900 mb-4">
              Book Your Stay
            </h2>
            <p className="font-comfortaaLight text-gray-600 max-w-2xl mx-auto">
              Experience luxurious beachside living in South Goa tranquil
              paradise. Perfect for holiday seekers looking for a serene coastal
              retreat.
            </p>
          </div>

          <Card className="overflow-hidden shadow-xl">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="font-comfortaaBold text-2xl text-gray-900">
                    Special Offers Available
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                      Early Bird Discount - Book 60 days in advance
                    </li>
                    <li className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                      Extended Stay Benefits - 7 nights or more
                    </li>
                    <li className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                      Complimentary Airport Transfers
                    </li>
                  </ul>

                  {/* Replace the old handleBookNow button with BookingModal */}
                  <BookingModal
                    defaultLocationId={locationId}
                    trigger={
                      <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-lg shadow-md transition-all hover:shadow-xl">
                        <Calendar className="w-5 h-5 mr-2" />
                        Check Availability
                      </Button>
                    }
                  />
                </div>

                <div className="relative h-[300px] rounded-lg overflow-hidden hidden md:block">
                  <Image
                    src="/images/bliss/hero1.jpg"
                    alt="Luxury Villa Booking"
                    layout="fill"
                    objectFit="cover"
                    className="transform transition-transform hover:scale-105 duration-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* About Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-comfortaaBold text-3xl text-gray-900">
                Bliss Ganga
              </h2>
              <p className="font-comfortaaLight text-gray-600 leading-relaxed">
                Bliss Ganga( A Unit of the Falcon Group) is not just a Hotel in
                Rishikesh that will leave you breathless with the enchantment of
                its surroundings, but assists in enabling you to experience both
                physical and mental relaxation and realize the importance of a
                moment of calm and personal space in your everyday life. It is a
                charming 3 star boutique hotel in the sanctums of Rishikesh, a
                land where spirituality and Mother Nature blend into a heady
                concoction
              </p>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/bliss/about.jpg"
                alt="VP Residency"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Room Gallery Grid Section */}
      <section className="pb-20">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="font-comfortaaBold text-3xl text-center mb-12">
            Our Rooms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roomImages.map((room, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg aspect-[4/3] hover:shadow-xl transition-shadow"
              >
                <Image
                  src={room.src}
                  alt={room.alt || room.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4 w-full text-white">
                    <h3 className="font-comfortaaMedium text-lg">
                      {room.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="font-comfortaaBold text-3xl text-center mb-12">
            Gallery
          </h2>
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500"
                style={{
                  transform: `translateX(-${currentGallerySlide * 100}%)`,
                }}
              >
                {galleryImages.map((image, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-2">
                    <div className="relative h-[500px] rounded-lg overflow-hidden">
                      <Image
                        src={image.src}
                        alt={image.title}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  handleSlideChange(
                    "prev",
                    currentGallerySlide,
                    setCurrentGallerySlide,
                    galleryImages.length
                  )
                }
                className="text-primary hover:bg-primary/20 bg-white/80 rounded-full shadow-lg"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  handleSlideChange(
                    "next",
                    currentGallerySlide,
                    setCurrentGallerySlide,
                    galleryImages.length
                  )
                }
                className="text-primary hover:bg-primary/20 bg-white/80 rounded-full shadow-lg"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="font-comfortaaBold text-3xl text-center mb-12">
            Facilities
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {facilities.map((facility, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <facility.icon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-comfortaaMedium text-gray-800">
                    {facility.name}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Full-width Map Section */}
      <section className="h-96 w-full relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3456.7890123456789!2d78.31234567890123!3d30.12345678901234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDA3JzM0LjQiTiA3OMKwMTgnNDQuNCJF!5e0!3m2!1sen!2sin!4v1635789012345!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          title="The Center Court Goa Location Map"
        ></iframe>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="font-comfortaaBold text-3xl text-gray-900 mb-4">
              Contact Us
            </h2>
            <p className="font-comfortaaLight text-gray-600">
              Get in touch with us for any inquiries or special requests
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-comfortaaMedium text-lg mb-2">Location</h3>
                <p className="text-gray-600">
                  Tapovan risikesh, Near Laxman Jhula Chowk NH-58
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Phone className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-comfortaaMedium text-lg mb-2">Phone</h3>
                <p className="text-gray-600">
                  Mob: 8956593947 | Landline: 8788981627
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-comfortaaMedium text-lg mb-2">Email</h3>
                <p className="text-gray-600">crs@apricushotels.com</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Floating Book Now Button - Fixed on mobile */}
      <div className="fixed bottom-20 left-0 right-0 z-50 px-4 md:hidden">
        {/* Replace the old handleBookNow button with BookingModal */}
        <BookingModal
          defaultLocationId={locationId}
          className="w-full"
          trigger={
            <Button className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-full shadow-xl">
              <Calendar className="w-5 h-5 mr-2" />
              Book Now
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default TheBlissGangaPage;

"use client";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Wifi,
  Car,
  Home,
  Tv,
  Wind,
  Waves,
  Warehouse,
  MapPin,
  Calendar,
  Phone,
  Mail,
} from "lucide-react";
import Image from "next/image";
import BMNavigation from "@/components/hotel-nav/bisra";

interface ImageData {
  src: string;
  title: string;
  alt?: string;
}

interface Facility {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
}

const BrisaMarinaPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [currentGallerySlide, setCurrentGallerySlide] = useState<number>(0);

  // Add video refs and state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Video play/pause handler
  const handleVideoPlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  const heroImages: string[] = [
    "/images/brisa/hero1.jpg",
    "/images/brisa/hero2.jpg",
    "/images/brisa/hero3.jpg",
  ];

  const galleryImages: ImageData[] = [
    {
      src: "/images/brisa/gallery1.jpg",
      title: "Villa Exterior",
      alt: "Villa Exterior View",
    },
    {
      src: "/images/brisa/gallery2.jpg",
      title: "Living Area",
      alt: "Living Room Interior",
    },
    {
      src: "/images/brisa/gallery3.jpg",
      title: "Pool View",
      alt: "Swimming Pool Area",
    },
    {
      src: "/images/brisa/gallery4.jpg",
      title: "Bedroom",
      alt: "Master Bedroom",
    },
    {
      src: "/images/brisa/gallery5.jpg",
      title: "Dining Area",
      alt: "Dining Room",
    },
    {
      src: "/images/brisa/gallery6.jpg",
      title: "Beach View",
      alt: "Beach View from Villa",
    },
  ];

  const roomImages: ImageData[] = [
    {
      src: "/images/brisa/room1.jpg",
      title: "Master Bedroom",
      alt: "Luxurious Master Bedroom",
    },
    {
      src: "/images/brisa/room2.jpg",
      title: "Hall",
      alt: "Comfortable Hall",
    },
    {
      src: "/images/brisa/room3.jpg",
      title: "Drawing Room",
      alt: "Drawing Room Setup",
    },
  ];

  const facilities: Facility[] = [
    { icon: Wind, name: "Air Conditioned" },
    { icon: Wifi, name: "Complimentary WiFi" },
    { icon: Waves, name: "Private Pool" },
    { icon: Warehouse, name: "Private Balcony" },
    { icon: Car, name: "Car Parking" },
    { icon: Home, name: "House Keeping" },
    { icon: Warehouse, name: "Balconies" },
    { icon: Tv, name: "Smart TV" },
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

  const handleBookNow = () => {
    window.location.href =
      "https://asiatech.in/booking_engine/index3?token=NjAxMg==";
  };

  return (
    <div className="font-comfortaaRegular">
      {/* Hero Section */}
      <BMNavigation />
      <section className="relative h-[40rem]">
        <div className="absolute inset-0 bg-primary opacity-50 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url(${heroImages[currentSlide]})` }}
        />
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-white p-4">
          <h1 className="font-comfortaaBold text-4xl md:text-6xl text-center mb-6">
            Apricus Brisa Marina
          </h1>
          <p className="font-comfortaaLight text-xl md:text-2xl text-center max-w-3xl">
            Luxury Villas in Benaulim, South Goa
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
              Experience luxury living in our carefully crafted villas. Book now
              to secure your perfect getaway in South Goa.
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
                  <Button
                    onClick={handleBookNow}
                    className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-lg shadow-md transition-all hover:shadow-xl"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Check Availability
                  </Button>
                </div>

                <div className="relative h-[300px] rounded-lg overflow-hidden hidden md:block">
                  <Image
                    src="/images/brisa/gallery1.jpg"
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
                Welcome to Brisa Marina
              </h2>
              <p className="font-comfortaaLight text-gray-600 leading-relaxed">
                Experience luxury living just 250 metres away from the famous
                Benaulim Beach. Our property features 11 luxurious 3 & 4 bedroom
                villas, combining relaxed living with trend-setting
                environmental practices. Each villa is equipped with smart home
                automation, walk-in closets, and floor-to-ceiling windows
                overlooking pristine natural surroundings.
              </p>
              <div className="space-y-2 text-gray-600">
                <p>• 7 kms from Margao railway station</p>
                <p>• 25 kms from Goa Dabolim airport</p>
                <p>• 39 kms from Panjim, Capital of Goa</p>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/brisa/about.jpg"
                alt="Brisa Marina Villa"
                layout="fill"
                objectFit="cover"
              />
            </div>
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

      {/* Room Gallery Grid Section */}
      <section className="py-20">
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

      {/* Video Section */}
      <section className="py-20 bg-gray-50">
        <div className="text-center mb-12">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="font-comfortaaBold text-3xl text-gray-900">
              Experience Brisa Marina
            </h2>
            <p className="font-comfortaaLight text-gray-600 mt-4 max-w-2xl mx-auto">
              Take a virtual tour of our luxurious property and experience the
              serenity of Benaulim Beach
            </p>
          </div>
        </div>

        {/* Full Width Video Container */}
        <div
          className="relative w-full aspect-video mb-16"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            poster="/images/video-thumbnail.png"
            playsInline
          >
            <source src="/videos/brisa-marina-tour.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Overlay Controls - Only visible on hover or when video is paused */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              isHovering || !isPlaying ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Play/Pause Button */}
            <button
              onClick={handleVideoPlayPause}
              className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/20 transition-all duration-300"
            >
              <div
                className={`w-16 h-16 rounded-full bg-white/90 flex items-center justify-center transform transition-all duration-300 ${
                  isHovering ? "scale-100 opacity-100" : "scale-95 opacity-0"
                }`}
              >
                {isPlaying ? (
                  <div className="w-4 h-8 flex items-center justify-center">
                    <div className="w-1 h-8 bg-primary mr-1"></div>
                    <div className="w-1 h-8 bg-primary"></div>
                  </div>
                ) : (
                  <div className="w-0 h-0 border-t-[10px] border-b-[10px] border-l-[16px] border-transparent border-l-primary ml-1"></div>
                )}
              </div>
            </button>

            {/* Bottom Controls Bar */}
            <div
              className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ${
                isHovering ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="container mx-auto max-w-6xl flex items-center justify-between text-white">
                <button
                  onClick={handleVideoPlayPause}
                  className="flex items-center space-x-2 hover:text-primary transition-colors text-sm"
                >
                  <span>{isPlaying ? "Pause" : "Play"}</span>
                </button>
                <div className="text-sm">Brisa Marina Virtual Tour</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section Below Video */}
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Home className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-comfortaaBold text-xl text-gray-900 mb-3">
                Virtual Property Tour
              </h4>
              <p className="text-gray-600">
                Explore our luxurious villas and amenities from the comfort of
                your home
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Waves className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-comfortaaBold text-xl text-gray-900 mb-3">
                Beachfront Location
              </h4>
              <p className="text-gray-600">
                Experience the stunning views of Benaulim Beach and its
                surroundings
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Wind className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-comfortaaBold text-xl text-gray-900 mb-3">
                Modern Amenities
              </h4>
              <p className="text-gray-600">
                Discover our state-of-the-art facilities and premium services
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Button
              onClick={handleBookNow}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg shadow-md transition-all hover:shadow-xl inline-flex items-center"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Your Stay
            </Button>
          </div>
        </div>
      </section>

      {/* Full-width Map Section */}
      <section className="h-96 w-full relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3848.5518557553747!2d73.91214331484253!3d15.279067989340872!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfb0f9f2a2f1a7%3A0x4a6a7f7f7f7f7f7f!2sColva%2C%20Goa!5e0!3m2!1sen!2sin!4v1635789012345!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          title="Location Map"
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
                  Benaulim Beach Road, Benaulim,
                  <br />
                  South Goa, India
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Phone className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-comfortaaMedium text-lg mb-2">Phone</h3>
                <p className="text-gray-600">
                  +91 123 456 7890
                  <br />
                  +91 098 765 4321
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-comfortaaMedium text-lg mb-2">Email</h3>
                <p className="text-gray-600">
                  info@brisamarina.com
                  <br />
                  reservations@brisamarina.com
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Floating Book Now Button - Fixed on mobile */}
      <div className="fixed bottom-20 left-0 right-0 z-50 px-4 md:hidden">
        <Button
          onClick={handleBookNow}
          className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-full shadow-xl"
        >
          <Calendar className="w-5 h-5 mr-2" />
          Book Now
        </Button>
      </div>
    </div>
  );
};

export default BrisaMarinaPage;

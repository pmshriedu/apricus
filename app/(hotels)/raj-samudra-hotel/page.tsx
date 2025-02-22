"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Utensils,
  GlassWater,
  Phone,
  Mail,
  MapPin,
  Globe,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
type SlideState = number;
type SlideSetter = React.Dispatch<React.SetStateAction<SlideState>>;
const RajSamudraHotelPage = () => {
  const [currentSlide, setCurrentSlide] = useState<SlideState>(0);
  const [currentRoomSlide, setCurrentRoomSlide] = useState<SlideState>(0);
  const [currentCuisineSlide, setCurrentCuisineSlide] = useState<SlideState>(0);

  const heroImages = [
    "/images/roomone.jpg",
    "/images/roomtwo.jpg",
    "/images/roomthree.jpg",
  ];

  const roomImages = [
    { src: "/images/roomone.jpg", title: "Deluxe Room" },
    { src: "/images/roomtwo.jpg", title: "Executive Room" },
    { src: "/images/roomthree.jpg", title: "Premium Room" },
  ];

  const cuisineImages = [
    { src: "/images/swim.jpg", title: "Indian Cuisine" },
    { src: "/api/placeholder/800/600", title: "Continental Cuisine" },
    { src: "/api/placeholder/800/600", title: "Goan Specialties" },
  ];

  const nextSlide = (
    current: SlideState,
    setCurrent: SlideSetter,
    length: number
  ) => {
    setCurrent((current + 1) % length);
  };

  const prevSlide = (
    current: SlideState,
    setCurrent: SlideSetter,
    length: number
  ) => {
    setCurrent((current - 1 + length) % length);
  };

  return (
    <div className="font-comfortaaRegular">
      {/* Hero Section with Image Slider */}
      <section className="relative h-[50vh] sm:h-[70vh] md:h-screen">
        <div className="absolute inset-0 bg-primary opacity-70 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 ease-in-out"
          style={{ backgroundImage: `url(${heroImages[currentSlide]})` }}
        />
        {/* Content */}
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-white text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <h1 className="font-comfortaaBold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-4 sm:mb-6 leading-tight">
            Raj Samudra Hotel and Spa by Apricus
          </h1>
          <p className="font-comfortaaLight text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 max-w-3xl mx-auto">
            Defining a new dimension of Comfort and Luxury !!
          </p>
          <Button
            size="lg"
            className="font-comfortaaBold bg-white text-primary hover:bg-white/90"
          >
            Book Now
          </Button>
        </div>
        {/* Navigation Buttons */}
        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center z-20 px-4 sm:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              prevSlide(currentSlide, setCurrentSlide, heroImages.length)
            }
            className="text-white hover:bg-white/20 bg-black/30 rounded-full mr-4"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              nextSlide(currentSlide, setCurrentSlide, heroImages.length)
            }
            className="text-white hover:bg-white/20 bg-black/30 rounded-full"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
        {/* Desktop Navigation Buttons */}
        <div className="absolute inset-0 items-center justify-between z-20 px-4 hidden sm:flex">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              prevSlide(currentSlide, setCurrentSlide, heroImages.length)
            }
            className="text-white hover:bg-white/20 bg-black/30 rounded-full"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              nextSlide(currentSlide, setCurrentSlide, heroImages.length)
            }
            className="text-white hover:bg-white/20 bg-black/30 rounded-full"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-16 container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl">
          <CardContent className="p-8 sm:p-10">
            <h2 className="font-comfortaaBold text-3xl mb-6 text-gray-900">
              Welcome to Raj Samudra Hotel and Spa
            </h2>
            <p className="font-comfortaaLight text-gray-600 text-lg leading-relaxed">
              Beautiful & breathtaking at the Raj Samudra Hotel and Spa by
              Apricus. We are open to welcome our guests. Experience a luxurious
              stay at Colva South Goa. 30 room property with delux and executive
              rooms nearly 1.2 kms from famous Club Margrita of south Goa.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Room Categories Section with Slider */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-comfortaaBold text-3xl mb-8 text-center text-gray-900">
            Our Rooms
          </h2>
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentRoomSlide * 100}%)`,
                }}
              >
                {roomImages.map((room, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-2">
                    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl">
                      <CardContent className="p-0">
                        <div className="relative h-64 sm:h-80 md:h-96">
                          <Image
                            src={room.src}
                            alt={room.title}
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-comfortaaBold text-xl text-center">
                            {room.title}
                          </h3>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                prevSlide(
                  currentRoomSlide,
                  setCurrentRoomSlide,
                  roomImages.length
                )
              }
              className="absolute top-1/2 left-0 transform -translate-y-1/2 text-primary hover:bg-primary/20 bg-white/80 rounded-full shadow-md"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                nextSlide(
                  currentRoomSlide,
                  setCurrentRoomSlide,
                  roomImages.length
                )
              }
              className="absolute top-1/2 right-0 transform -translate-y-1/2 text-primary hover:bg-primary/20 bg-white/80 rounded-full shadow-md"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>
          <div className="mt-8 text-center">
            <p className="font-comfortaaLight text-gray-600">
              Total Rooms: 30 | Floors: Ground + 1 | Twin Bed Rooms Available
            </p>
          </div>
        </div>
      </section>

      {/* Food & Beverage Section with Cuisine Slider */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-comfortaaBold text-3xl mb-8 text-center text-gray-900">
            Food & Beverage
          </h2>
          <div className="relative mb-12">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentCuisineSlide * 100}%)`,
                }}
              >
                {cuisineImages.map((cuisine, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-2">
                    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl">
                      <CardContent className="p-0">
                        <div className="relative h-64 sm:h-80 md:h-96">
                          <Image
                            src={cuisine.src}
                            alt={cuisine.title}
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-comfortaaBold text-xl text-center">
                            {cuisine.title}
                          </h3>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                prevSlide(
                  currentCuisineSlide,
                  setCurrentCuisineSlide,
                  cuisineImages.length
                )
              }
              className="absolute top-1/2 left-0 transform -translate-y-1/2 text-primary hover:bg-primary/20 bg-white/80 rounded-full shadow-md"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                nextSlide(
                  currentCuisineSlide,
                  setCurrentCuisineSlide,
                  cuisineImages.length
                )
              }
              className="absolute top-1/2 right-0 transform -translate-y-1/2 text-primary hover:bg-primary/20 bg-white/80 rounded-full shadow-md"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-6">
                <Utensils className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-comfortaaBold text-xl mb-4">
                  Multi-Cuisine Restaurant
                </h3>
                <ul className="font-comfortaaLight text-gray-600">
                  <li>Breakfast: 08:00 AM TO 10:30 PM</li>
                  <li>Lunch: 12:30 PM TO 02:30 PM</li>
                  <li>Evening Snacks: 04:00 PM TO 07:00 P.M</li>
                  <li>Dinner: 08:00 PM TO 10:30 P.M</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-6">
                <GlassWater className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-comfortaaBold text-xl mb-4">Bar</h3>
                <p className="font-comfortaaLight text-gray-600">
                  Timings: 10:00 AM TO 10:30 PM
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-comfortaaBold text-3xl mb-8 text-center text-gray-900">
            Facilities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              "Swimming Pool",
              "Bar",
              "Ayurvedic Spa",
              "24 Hour Front Desk",
              "24-Hour Room Service",
              "24-Hour Security",
              "Air Conditioned",
              "Beauty Salon",
              "Body Treatment",
              "Boutique",
              "Board Room",
              "Catering Services",
              "High-speed WIFI Connectivity",
              "Laundry Service",
              "Dry Cleaning Paid",
              "Airport Shuttle Paid",
              "Free Newspaper On Request",
              "Free Parking",
              "Housekeeping Daily",
              "Massage Services",
              "Guest Laundromat",
              "Outdoor swimming pool",
              "Restaurant",
              "Halal Food",
              "Pool Snack Bar",
              "Transportation Services",
              "Wedding Services",
              "Phone Service",
              "Video Cameras for security in public areas",
            ].map((facility, index) => (
              <div
                key={index}
                className="flex items-center p-2 bg-white rounded-lg shadow-sm"
              >
                <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                <span className="font-comfortaaLight text-sm">{facility}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Attractions Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-comfortaaBold text-3xl mb-8 text-center text-gray-900">
            Nearby Attractions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Colva Beach",
                distance: "1.7 km",
                description:
                  "Colva beach stretches for around 2.4 km, part of a beach consisting of about 25 km of powder white sand, lined along its shore by coconut palms, and extending as far as Bogmalo Beach to the north and Cabo de Rama Beach to South Goa's coastline.",
              },
              {
                title: "Our Lady of Mercy",
                distance: "1.8 km",
                description:
                  "Our Lady Of Mercy Church, located in Colva, is a colonial church founded in 1630. It was earlier known as Nossa Senhora de Merces. The church houses a statue of infant Jesus Christ which is believed to be found on the Mozambique coast by Fr Bento Ferreira who brought it to Goa and installed it in the church in 1648.",
              },
              {
                title: "Club Margrita",
                distance: "1.2 km",
                description:
                  "Club Margarita is definitely worth a visit. The costs are very affordable and the crowd is as cosmopolitan as it gets. To get to Club Margarita, get a cab from Panjim, Vasco, or Margao. If you're based in North Goa, ask for Colva beach, though the ride is a little long.",
              },
              {
                title: "Madgaon Railway Station",
                distance: "8 km",
                description:
                  "Madgaon Junction railway station is a railway junction and major station on the Indian Railways network, specifically on the South Western Railway line to Vasco da Gama, Goa, and the Konkan Railway, in Madgaon, Goa, India.",
              },
              {
                title: "Goa International Airport",
                distance: "19 km",
                description:
                  "Dabolim Airport is the international airport in Dabolim, Goa, India. It is operated by the Airports Authority of India as a civil enclave in an Indian Navy naval airbase named INS Hansa.",
              },
            ].map((attraction, index) => (
              <Card
                key={index}
                className="overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                <CardContent className="p-6">
                  <h3 className="font-comfortaaBold text-xl mb-2">
                    {attraction.title}
                  </h3>
                  <p className="font-comfortaaMedium text-primary mb-2">
                    {attraction.distance}
                  </p>
                  <p className="font-comfortaaLight text-gray-600">
                    {attraction.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-comfortaaBold text-3xl mb-8 text-center text-gray-900">
            Contact Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-start mb-4">
                  <MapPin className="w-6 h-6 text-primary mr-2 flex-shrink-0" />
                  <p className="font-comfortaaLight text-gray-600">
                    31/4 gandaulim, Colva, Salcete, South Goa
                  </p>
                </div>
                <div className="flex items-center mb-4">
                  <Phone className="w-6 h-6 text-primary mr-2" />
                  <p className="font-comfortaaLight text-gray-600">
                    Mob: 8956593947 | Landline: 8788981627
                  </p>
                </div>
                <div className="flex items-center mb-4">
                  <Mail className="w-6 h-6 text-primary mr-2" />
                  <p className="font-comfortaaLight text-gray-600">
                    crs@apricushotels.com
                  </p>
                </div>
                <div className="flex items-center">
                  <Globe className="w-6 h-6 text-primary mr-2" />
                  <a
                    href="https://apricushotels.com"
                    className="font-comfortaaLight text-primary hover:underline"
                  >
                    https://apricushotels.com
                  </a>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-6">
                <h3 className="font-comfortaaBold text-xl mb-4">
                  Send us a message
                </h3>
                <form>
                  <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="block text-sm font-comfortaaMedium text-gray-700 mb-1"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-comfortaaMedium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="message"
                      className="block text-sm font-comfortaaMedium text-gray-700 mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    ></textarea>
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Full-width Map Section */}
      <section className="h-96 w-full">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3848.5518557553747!2d73.91214331484253!3d15.279067989340872!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfb0f9f2a2f1a7%3A0x4a6a7f7f7f7f7f7f!2sColva%2C%20Goa!5e0!3m2!1sen!2sin!4v1635789012345!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
        ></iframe>
      </section>
    </div>
  );
};

export default RajSamudraHotelPage;

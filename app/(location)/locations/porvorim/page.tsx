"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Wifi,
  Car,
  Wind,
  Hotel,
  House,
  Clock,
  Sun,
  Umbrella,
  Briefcase,
  Plane,
  LayoutGrid,
  Dumbbell,
} from "lucide-react";

const PorvorimLocation = () => {
  const router = useRouter();

  const facilities = [
    { icon: Wind, name: "Air Conditioned" },
    { icon: Wifi, name: "Free Wi-Fi" },
    { icon: Hotel, name: "Restaurant" },
    { icon: House, name: "Room Service" },
    { icon: Dumbbell, name: "Fitness Center" },
    { icon: Briefcase, name: "Business Center" },
    { icon: LayoutGrid, name: "Conference Rooms" },
    { icon: Car, name: "Parking" },
    { icon: Plane, name: "Airport Shuttle" },
    { icon: House, name: "Concierge Service" },
  ];

  const highlights = [
    {
      icon: Sun,
      title: "Prime Location",
      description: "Situated in the bustling heart of the city",
    },
    {
      icon: Clock,
      title: "Nearby Attractions",
      description:
        "Close to City Center Mall, Central Park, Museum of Modern Art, and business district",
    },
    {
      icon: Umbrella,
      title: "Luxury & Comfort",
      description:
        "Offering a perfect blend of luxury and comfort for business and leisure travelers",
    },
  ];

  const handleVPResidencyClick = () => {
    router.push("/vp-residency");
  };

  return (
    <div className="font-comfortaaRegular">
      {/* Hero Section with Parallax Effect */}
      <section className="relative h-[40rem]">
        <div className="absolute inset-0">
          <img
            src="/images/hero-porvorim.jpg"
            alt="Benaulim Beach"
            className="w-full h-full object-cover object-center brightness-75 grayscale-[50%] transition-all duration-700 group-hover:brightness-100 group-hover:grayscale-0"
          />
        </div>
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-white p-4">
          <h1 className="font-comfortaaBold text-5xl md:text-7xl text-center mb-6 animate-fade-in">
            Porvorim, North Goa
          </h1>
          <p className="font-comfortaaLight text-xl md:text-3xl text-center max-w-3xl mb-8">
            Where Luxury Meets Convenience
          </p>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-24 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <CardContent className="space-y-4">
                  <highlight.icon className="w-12 h-12 text-primary" />
                  <h3 className="font-comfortaaBold text-xl">
                    {highlight.title}
                  </h3>
                  <p className="font-comfortaaLight text-gray-600">
                    {highlight.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section with Image Grid */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="font-comfortaaBold text-4xl text-gray-900">
                Welcome to VP Residency
              </h2>
              <p className="font-comfortaaLight text-gray-600 text-lg leading-relaxed">
                VP Residency by Apricus offers a perfect blend of luxury and
                comfort in the bustling heart of the city. With our prime
                location, state-of-the-art amenities, and exceptional service,
                we ensure that your stay is nothing short of extraordinary.
                Whether you&apos;re here for business or leisure, VP Residency
                is your home away from home.
              </p>
              <div className="space-y-4">
                <p className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 text-primary mr-3" />
                  0.5 km from City Center Mall
                </p>
                <p className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 text-primary mr-3" />1 km from
                  Central Park
                </p>
                <p className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 text-primary mr-3" />
                  1.5 km from Museum of Modern Art
                </p>
                <p className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 text-primary mr-3" />2 km from
                  Business District
                </p>
                <p className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 text-primary mr-3" />
                  10 km from City Airport
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/images/vp/room1.jpg"
                alt="VP Residency Room"
                className="rounded-lg h-64 w-full object-cover"
              />
              <img
                src="/images/vp/room2.jpg"
                alt="VP Residency Lobby"
                className="rounded-lg h-64 w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Property Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-12">
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div>
                    <h3 className="font-comfortaaBold text-3xl text-gray-900 mb-4">
                      VP Residency
                    </h3>
                    <p className="font-comfortaaLight text-gray-600 text-lg leading-relaxed">
                      VP Residency by Apricus offers a perfect blend of luxury
                      and comfort in the bustling heart of the city. With our
                      prime location, state-of-the-art amenities, and
                      exceptional service, we ensure that your stay is nothing
                      short of extraordinary.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {facilities.map((facility, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 text-gray-700 p-2 hover:bg-primary/5 rounded-lg transition-colors"
                      >
                        <facility.icon className="w-6 h-6 text-primary" />
                        <span className="font-comfortaaLight">
                          {facility.name}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={handleVPResidencyClick}
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-lg w-full md:w-auto"
                  >
                    Explore Hotel Details
                  </Button>
                </div>
                <div className="relative h-[400px] rounded-xl overflow-hidden group">
                  <img
                    src="/images/vp/about.jpg"
                    alt="VP Residency Exterior"
                    className="object-cover w-full h-full transform transition-transform group-hover:scale-110 duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="font-comfortaaBold text-4xl text-gray-900 mb-4">
              Location
            </h2>
            <p className="font-comfortaaLight text-gray-600 max-w-2xl mx-auto">
              Conveniently located near the city&apos;s top attractions and
              business district
            </p>
          </div>
          <div className="h-[500px] rounded-xl overflow-hidden shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.5859604923314!2d73.80863431355588!3d15.507721889309578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfb496b3f8a295%3A0xf58a12df41d1dd8b!2sVP%20Residency%20by%20Apricus!5e0!3m2!1sen!2sin!4v1680123456789!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              title="VP Residency Location Map"
            />
          </div>
        </div>
      </section>

      {/* Floating CTA for Mobile */}
      <div className="fixed bottom-20 left-0 right-0 z-50 px-4 md:hidden">
        <Button
          onClick={handleVPResidencyClick}
          className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-full shadow-2xl"
        >
          View Hotel Details
        </Button>
      </div>
    </div>
  );
};

export default PorvorimLocation;

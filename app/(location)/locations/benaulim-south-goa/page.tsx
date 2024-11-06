"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Wifi,
  Tv,
  Car,
  Wind,
  Home,
  Waves,
  Hotel,
  House,
  Clock,
  Sun,
  Umbrella,
} from "lucide-react";

const BenaulimLocation = () => {
  const router = useRouter();

  const facilities = [
    { icon: Wind, name: "Air Conditioned" },
    { icon: Wifi, name: "Complimentary WiFi" },
    { icon: Waves, name: "Private Pool" },
    { icon: Hotel, name: "Private Balcony" },
    { icon: Car, name: "Car Parking" },
    { icon: House, name: "House Keeping" },
    { icon: Home, name: "Balconies" },
    { icon: Tv, name: "Smart TV" },
  ];

  const highlights = [
    {
      icon: Sun,
      title: "Beach Access",
      description: "Just 250 meters from pristine Benaulim Beach",
    },
    {
      icon: Clock,
      title: "Prime Location",
      description: "Easy access to major attractions and transport hubs",
    },
    {
      icon: Umbrella,
      title: "Exclusive Living",
      description: "11 luxury villas with modern amenities",
    },
  ];

  const handleVillaClick = () => {
    router.push("/villa/brisa-marina");
  };

  return (
    <div className="font-comfortaaRegular">
      {/* Hero Section with Parallax Effect */}
      <section className="relative h-[40rem]">
        <div className="absolute inset-0">
          <img
            src="/images/hero-benaulim.jpg"
            alt="Benaulim Beach"
            className="w-full h-full object-cover object-center brightness-75 grayscale-[50%] transition-all duration-700 group-hover:brightness-100 group-hover:grayscale-0"
          />
        </div>
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-white p-4">
          <h1 className="font-comfortaaBold text-5xl md:text-7xl text-center mb-6 animate-fade-in">
            Benaulim, South Goa
          </h1>
          <p className="font-comfortaaLight text-xl md:text-3xl text-center max-w-3xl mb-8">
            Where Luxury Meets Paradise
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
                Discover Benaulim
              </h2>
              <p className="font-comfortaaLight text-gray-600 text-lg leading-relaxed">
                A serene coastal paradise where traditional Goan charm meets
                modern luxury. Nestled along the pristine coastline of South
                Goa, Benaulim offers an escape into tranquility while
                maintaining easy access to vibrant local culture and modern
                amenities.
              </p>
              <div className="space-y-4">
                <p className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 text-primary mr-3" />7 kms from
                  Margao railway station
                </p>
                <p className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 text-primary mr-3" />
                  25 kms from Goa Dabolim airport
                </p>
                <p className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 text-primary mr-3" />
                  39 kms from Panjim, Capital of Goa
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/images/brisa/room1.jpg"
                alt="Benaulim Beach"
                className="rounded-lg h-64 w-full object-cover"
              />
              <img
                src="/images/brisa/gallery1.jpg"
                alt="Villa Exterior"
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
                      Brisa Marina Villa
                    </h3>
                    <p className="font-comfortaaLight text-gray-600 text-lg leading-relaxed">
                      Experience luxury living in our meticulously designed
                      villas. Each residence combines sophisticated aesthetics
                      with sustainable living, offering the perfect blend of
                      comfort and consciousness.
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
                    onClick={handleVillaClick}
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-lg w-full md:w-auto"
                  >
                    Explore Villa Details
                  </Button>
                </div>
                <div className="relative h-[400px] rounded-xl overflow-hidden group">
                  <img
                    src="/images/brisa/about.jpg"
                    alt="Brisa Marina Villa"
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
              Perfectly situated for both serenity and convenience
            </p>
          </div>
          <div className="h-[500px] rounded-xl overflow-hidden shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15374.997851781792!2d73.90833!3d15.2676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfb53a71f33b6f%3A0x883c8a802a9a0285!2sBenaulim%2C%20Goa!5e0!3m2!1sen!2sin!4v1680123456789!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              title="Benaulim Location Map"
            />
          </div>
        </div>
      </section>

      {/* Floating CTA for Mobile */}
      <div className="fixed bottom-20 left-0 right-0 z-50 px-4 md:hidden">
        <Button
          onClick={handleVillaClick}
          className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-full shadow-2xl"
        >
          View Villa Details
        </Button>
      </div>
    </div>
  );
};

export default BenaulimLocation;

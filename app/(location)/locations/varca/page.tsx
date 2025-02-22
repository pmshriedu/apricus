"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
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
  Flower,
  CoffeeIcon,
  GlassWater,
  UtensilsCrossed,
  Leaf,
} from "lucide-react";

const VarcaLocation = () => {
  const router = useRouter();

  const facilities = [
    { icon: Wind, name: "Air Conditioned" },
    { icon: Wifi, name: "Complimentary WiFi" },
    { icon: Waves, name: "Private Pool" },
    { icon: Hotel, name: "Luxurious Rooms" },
    { icon: Car, name: "Ample Parking" },
    { icon: House, name: "24-Hour Room Service" },
    { icon: Home, name: "Landscaped Gardens" },
    { icon: Tv, name: "Smart TV" },
    { icon: GlassWater, name: "Bar" },
    { icon: CoffeeIcon, name: "Coffee Shop" },
    { icon: Flower, name: "Spa Services" },
  ];

  const highlights = [
    {
      icon: Sun,
      title: "Prime Beach Location",
      description: "Just minutes from Varca & Fatrade beaches",
    },
    {
      icon: Clock,
      title: "Convenient Access",
      description: "35/40 mins from Goa airport, 15 mins from Madgaon station",
    },
    {
      icon: Umbrella,
      title: "Luxury Boutique Hotel",
      description: "Thoughtfully designed rooms with pool view and sit-out",
    },
  ];

  const handleVillaClick = () => {
    router.push("/the-center-court");
  };

  const handleDiningClick = () => {
    router.push("/dinings");
  };

  return (
    <div className="font-comfortaaRegular">
      {/* Hero Section with Parallax Effect */}
      <section className="relative h-[40rem]">
        <div className="absolute inset-0">
          <img
            src="/images/hero-varca.jpg"
            alt="Benaulim Beach"
            className="w-full h-full object-cover object-center brightness-75 grayscale-[50%] transition-all duration-700 group-hover:brightness-100 group-hover:grayscale-0"
          />
        </div>
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-white p-4">
          <h1 className="font-comfortaaBold text-5xl md:text-7xl text-center mb-6 animate-fade-in">
            Varca, South Goa
          </h1>
          <p className="font-comfortaaLight text-xl md:text-3xl text-center max-w-3xl mb-8">
            Where Luxury Meets Serenity
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
                Welcome to The Center Court
              </h2>
              <p className="font-comfortaaLight text-gray-600 text-lg leading-relaxed">
                The Center Court is the best boutique hotel in Goa for families
                seeking luxury and convenience. Nestled amidst lush coconut,
                mango, and other trees, our thoughtfully designed rooms offer a
                pool view and a luxurious sit-out. Located near Varca & Fatrade
                beaches—Goa&apos;s cleanest with the softest silver sands—we are
                the epitome of a luxury hotel in Goa near the beach.
              </p>
              <p className="font-comfortaaLight text-gray-600 text-lg leading-relaxed">
                Only 35/40 minutes from the airport and 15 minutes from Madgaon
                railway station, our prime location ensures easy access.
                Experience the best of Goa&apos;s hospitality at The Center
                Court, where comfort meets elegance.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/images/center/room1.jpg"
                alt="Center Court Room"
                className="rounded-lg h-64 w-full object-cover"
              />
              <img
                src="/images/center/room2.jpg"
                alt="Center Court Pool"
                className="rounded-lg h-64 w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="font-comfortaaBold text-4xl text-gray-900 mb-4">
              Dining Excellence
            </h2>
            <p className="font-comfortaaLight text-gray-600 max-w-2xl mx-auto">
              Experience the finest vegetarian cuisine at our signature
              restaurant
            </p>
          </div>

          <Card className="overflow-hidden max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <Leaf className="w-8 h-8 text-primary" />
                  <h3 className="font-comfortaaBold text-3xl">
                    Veggie Delight
                  </h3>
                </div>
                <p className="font-comfortaaLight text-gray-600 text-lg leading-relaxed">
                  Immerse yourself in a culinary journey of flavors at Veggie
                  Delight, our signature restaurant offering exquisite
                  vegetarian cuisine. From traditional Indian delicacies to
                  international favorites, each dish is crafted with fresh,
                  locally-sourced ingredients.
                </p>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-3">
                    <UtensilsCrossed className="w-5 h-5 text-primary" />
                    <span className="font-comfortaaLight text-gray-600">
                      All-day dining available
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Leaf className="w-5 h-5 text-primary" />
                    <span className="font-comfortaaLight text-gray-600">
                      Pure vegetarian cuisine
                    </span>
                  </div>
                </div>
                <Button
                  onClick={handleDiningClick}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-lg w-full md:w-auto"
                >
                  Explore
                </Button>
              </div>
              <div className="relative h-[300px] rounded-xl overflow-hidden group">
                <img
                  src="/images/veggie.png"
                  alt="Veggie Delight Restaurant"
                  className="w-full h-full object-cover transition-transform duration-500 "
                />
              </div>
            </div>
          </Card>
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
                      The Center Court
                    </h3>
                    <p className="font-comfortaaLight text-gray-600 text-lg leading-relaxed">
                      Welcome to The Center Court, the best boutique hotel in
                      Goa for families seeking luxury and convenience. Nestled
                      amidst lush coconut, mango, and other trees, our
                      thoughtfully designed rooms offer a pool view and a
                      luxurious sit-out.
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
                    Explore Hotel Details
                  </Button>
                </div>
                <div className="relative h-[400px] rounded-xl overflow-hidden group">
                  <img
                    src="/images/center/about.jpg"
                    alt="The Center Court"
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
              Conveniently located near Goa&apos;s best beaches and attractions
            </p>
          </div>
          <div className="h-[500px] rounded-xl overflow-hidden shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3824.453945374384!2d73.91769901358629!3d15.212430989237492!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfb7cc3453d7fb%3A0xfdcdfe4fe4bf3da5!2sThe%20Center%20Court%2C%20Goa!5e0!3m2!1sen!2sin!4v1680123456789!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              title="The Center Court Location Map"
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
          View Hotel Details
        </Button>
      </div>
    </div>
  );
};

export default VarcaLocation;

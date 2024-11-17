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
  Ship,
  Clock,
  Sun,
  Palmtree,
  CoffeeIcon,
  GlassWater,
  UtensilsCrossed,
  Leaf,
  ShoppingBag,
  ShipIcon,
} from "lucide-react";

const CavelossimLocation = () => {
  const router = useRouter();

  const facilities = [
    { icon: Wind, name: "Air Conditioning" },
    { icon: Wifi, name: "High-Speed WiFi" },
    { icon: Waves, name: "River View" },
    { icon: Hotel, name: "Premium Rooms" },
    { icon: Car, name: "Free Parking" },
    { icon: Ship, name: "River Cruises" },
    { icon: Home, name: "Riverside Garden" },
    { icon: Tv, name: "Smart TV" },
    { icon: GlassWater, name: "Lounge Bar" },
    { icon: CoffeeIcon, name: "Coffee House" },
    { icon: ShoppingBag, name: "Shopping Arcade" },
    { icon: ShipIcon, name: "Water Sports" },
  ];

  const highlights = [
    {
      icon: Palmtree,
      title: "Riverside Paradise",
      description: "Stunning views of the Sal River and Arabian Sea",
    },
    {
      icon: Clock,
      title: "Strategic Location",
      description: "30 mins from airport, 10 mins from Cavelossim Beach",
    },
    {
      icon: Sun,
      title: "Premium Resort",
      description: "Elegant rooms with river views and private balconies",
    },
  ];

  const handleHotelClick = () => {
    router.push("/apricus-inn");
  };

  const handleDiningClick = () => {
    router.push("/dinings");
  };

  return (
    <div className="font-comfortaaRegular">
      <section className="relative h-[40rem]">
        <div className="absolute inset-0">
          <img
            src="/images/hero-cavelossim.jpg"
            alt="Cavelossim Riverside"
            className="w-full h-full object-cover object-center brightness-90 grayscale-[30%] transition-all duration-700 group-hover:brightness-100 group-hover:grayscale-0"
          />
        </div>
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-white p-4 bg-black/30">
          <h1 className="font-comfortaaBold text-5xl md:text-7xl text-center mb-6 animate-fade-in">
            Cavelossim, South Goa
          </h1>
          <p className="font-comfortaaLight text-xl md:text-3xl text-center max-w-3xl mb-8">
            Where the River Meets the Sea
          </p>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-shadow duration-300"
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

      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="font-comfortaaBold text-4xl text-gray-900">
                Welcome to Apricus Inn Riverside
              </h2>
              <p className="font-comfortaaLight text-gray-600 text-lg leading-relaxed">
                Apricus Inn Riverside is a premium boutique resort where luxury
                meets nature. Positioned along the serene Sal River, our
                property offers breathtaking views of both the river and the
                Arabian Sea. Each room is thoughtfully designed with private
                balconies, perfect for watching stunning sunsets over the water.
              </p>
              <p className="font-comfortaaLight text-gray-600 text-lg leading-relaxed">
                Just a 30-minute drive from Goa International Airport and 10
                minutes from the pristine Cavelossim Beach, we offer the perfect
                blend of convenience and tranquility. Experience the charm of
                South Goa while enjoying modern luxuries and warm hospitality.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/images/apricus/room1.jpg"
                alt="Apricus Inn Room"
                className="rounded-lg h-64 w-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <img
                src="/images/apricus/room2.jpg"
                alt="Apricus Inn View"
                className="rounded-lg h-64 w-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="font-comfortaaBold text-4xl text-gray-900 mb-4">
              Culinary Excellence
            </h2>
            <p className="font-comfortaaLight text-gray-600 max-w-2xl mx-auto">
              Savor the finest global cuisine at our signature restaurant
            </p>
          </div>

          <Card className="overflow-hidden max-w-4xl mx-auto hover:shadow-xl transition-shadow duration-300">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <UtensilsCrossed className="w-8 h-8 text-primary" />
                  <h3 className="font-comfortaaBold text-3xl">
                    Craft Kitchen and Bar
                  </h3>
                </div>
                <p className="font-comfortaaLight text-gray-600 text-lg leading-relaxed">
                  Experience culinary artistry at Craft Kitchen, where our
                  expert chefs blend local Goan flavors with international
                  cuisine. Enjoy your meal with panoramic views of the river,
                  creating an unforgettable dining experience.
                </p>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="font-comfortaaLight text-gray-600">
                      Open for breakfast, lunch & dinner
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Leaf className="w-5 h-5 text-primary" />
                    <span className="font-comfortaaLight text-gray-600">
                      Fresh local ingredients
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
                  src="/images/apricus/bar2.jpg"
                  alt="Craft Kitchen Restaurant"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-12">
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div>
                    <h3 className="font-comfortaaBold text-3xl text-gray-900 mb-4">
                      Apricus Inn Riverside
                    </h3>
                    <p className="font-comfortaaLight text-gray-600 text-lg leading-relaxed">
                      Discover luxury living at Apricus Inn Riverside, where
                      every room offers stunning views of the Sal River.
                      Experience the perfect blend of modern amenities and
                      natural beauty in our thoughtfully designed spaces.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {facilities.map((facility, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 text-gray-700 p-2 hover:bg-primary/5 rounded-lg transition-colors duration-300"
                      >
                        <facility.icon className="w-6 h-6 text-primary" />
                        <span className="font-comfortaaLight">
                          {facility.name}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={handleHotelClick}
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-lg w-full md:w-auto"
                  >
                    Explore Hotel Details
                  </Button>
                </div>
                <div className="relative h-[400px] rounded-xl overflow-hidden group">
                  <img
                    src="/images/apricus/gallery3.jpg"
                    alt="Apricus Inn Riverside"
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="font-comfortaaBold text-4xl text-gray-900 mb-4">
              Location
            </h2>
            <p className="font-comfortaaLight text-gray-600 max-w-2xl mx-auto">
              Perfectly situated between the Sal River and Cavelossim Beach
            </p>
          </div>
          <div className="h-[500px] rounded-xl overflow-hidden shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3848.7246789012345!2d73.94000001234567!3d15.17000098765432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDEwJzEyLjAiTiA3M8KwNTYnMjQuMCJF!5e0!3m2!1sen!2sin!4v1680123456789!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              title="Apricus Inn Riverside Location Map"
            />
          </div>
        </div>
      </section>

      <div className="fixed bottom-20 left-0 right-0 z-50 px-4 md:hidden">
        <Button
          onClick={handleHotelClick}
          className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-full shadow-2xl"
        >
          View Hotel Details
        </Button>
      </div>
    </div>
  );
};

export default CavelossimLocation;

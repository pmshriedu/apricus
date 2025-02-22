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
  Mountain,
  Utensils,
  LayoutGrid,
  Users,
  Coffee,
  Luggage,
} from "lucide-react";

const ShivalikHillsMussoorieLocation = () => {
  const router = useRouter();

  const facilities = [
    { icon: Wind, name: "Air Conditioned" },
    { icon: Wifi, name: "Free Wi-Fi" },
    { icon: Hotel, name: "Premium Restaurant" },
    { icon: House, name: "Room Service" },
    { icon: Coffee, name: "Coffee Shop" },
    { icon: Utensils, name: "Dining Area" },
    { icon: LayoutGrid, name: "Conference Hall" },
    { icon: Car, name: "Parking" },
    { icon: Users, name: "Banquet Hall" },
    { icon: Luggage, name: "Travel Desk" },
  ];

  const highlights = [
    {
      icon: Mountain,
      title: "Scenic Location",
      description:
        "Nestled in the beautiful Himalayan foothills with panoramic views",
    },
    {
      icon: Clock,
      title: "Nearby Attractions",
      description:
        "Minutes away from Mall Road, Lal Tibba, Gun Hill, and Kempty Falls",
    },
    {
      icon: Sun,
      title: "Premium Luxury",
      description:
        "45 ultra luxury rooms offering elegant comfort and modern amenities",
    },
  ];

  const handleShivalikHillsClick = () => {
    router.push("/shivalik-hills-mussoorie");
  };

  return (
    <div className="font-comfortaaRegular">
      <section className="relative h-[40rem]">
        <div className="absolute inset-0">
          <img
            src="/images/muss/hero1.jpg"
            alt="Mussoorie Hills"
            className="w-full h-full object-cover object-center brightness-75 grayscale-[50%] transition-all duration-700 group-hover:brightness-100 group-hover:grayscale-0"
          />
        </div>
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-white p-4">
          <h1 className="font-comfortaaBold text-5xl md:text-7xl text-center mb-6 animate-fade-in">
            Mussoorie, Uttarakhand
          </h1>
          <p className="font-comfortaaLight text-xl md:text-3xl text-center max-w-3xl mb-8">
            The Queen of Hills
          </p>
        </div>
      </section>

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

      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="font-comfortaaBold text-4xl text-gray-900">
                Welcome to Shivalik Hills Mussoorie
              </h2>
              <p className="font-comfortaaLight text-gray-600 text-lg leading-relaxed">
                If we talk about blessed places in the world, Mussoorie comes
                almost on top. Best connectivity from National Capital Delhi and
                State Capital Dehradun by Air, Rail and Road makes Mussoorie one
                of the best holiday destinations in the world. Green hills,
                beautiful falls and British Era Heritage makes Mussoorie a
                holiday destination for everyone who&apos;s looking for
                wonderful holidays. Shivalik Hills Mussoorie By Royal Collection
                Hotels is one of the elegantly designed luxury hotels in
                Mussoorie, offering premium luxury in Stay with 45 ultra luxury
                rooms.
              </p>
              <div className="space-y-4">
                <p className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 text-primary mr-3" />
                  0.5 km from Mall Road
                </p>
                <p className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 text-primary mr-3" />2 km from Lal
                  Tibba
                </p>
                <p className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 text-primary mr-3" />
                  1.5 km from Gun Hill
                </p>
                <p className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 text-primary mr-3" />5 km from
                  Kempty Falls
                </p>
                <p className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 text-primary mr-3" />
                  35 km from Dehradun Airport
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/images/muss/room1.jpg"
                alt="Shivalik Hills Room"
                className="rounded-lg h-64 w-full object-cover"
              />
              <img
                src="/images/muss/room2.jpg"
                alt="Shivalik Hills View"
                className="rounded-lg h-64 w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-12">
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div>
                    <h3 className="font-comfortaaBold text-3xl text-gray-900 mb-4">
                      Shivalik Hills Mussoorie
                    </h3>
                    <p className="font-comfortaaLight text-gray-600 text-lg leading-relaxed">
                      Shivalik Hills Mussoorie By Royal Collection Hotels is a
                      special attraction for families, corporates, honeymooners
                      and leisure groups. Experience premium luxury with our 45
                      ultra luxury rooms, each designed to provide the perfect
                      blend of comfort and elegance with stunning mountain
                      views.
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
                    onClick={handleShivalikHillsClick}
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-lg w-full md:w-auto"
                  >
                    Explore Hotel Details
                  </Button>
                </div>
                <div className="relative h-[400px] rounded-xl overflow-hidden group">
                  <img
                    src="/images/muss/about.jpg"
                    alt="Shivalik Hills Exterior"
                    className="object-cover w-full h-full transform transition-transform group-hover:scale-110 duration-700"
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
              Perfectly situated near Mussoorie&apos;s prime attractions and
              scenic viewpoints
            </p>
          </div>
          <div className="h-[500px] rounded-xl overflow-hidden shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3456.789012345678!2d78.12345678901234!3d30.45678901234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDA3JzM0LjQiTiA3OMKwMDcnMzQuNCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              title="Shivalik Hills Location Map"
            />
          </div>
        </div>
      </section>

      <div className="fixed bottom-20 left-0 right-0 z-50 px-4 md:hidden">
        <Button
          onClick={handleShivalikHillsClick}
          className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-full shadow-2xl"
        >
          View Hotel Details
        </Button>
      </div>
    </div>
  );
};

export default ShivalikHillsMussoorieLocation;

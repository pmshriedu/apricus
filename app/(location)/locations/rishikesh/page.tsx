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
  Utensils,
  LayoutGrid,
  Heart,
  LeafyGreen,
} from "lucide-react";

const RishikeshLocation = () => {
  const router = useRouter();

  const facilities = [
    { icon: Wind, name: "Air Conditioned" },
    { icon: Wifi, name: "Free Wi-Fi" },
    { icon: Hotel, name: "Restaurant" },
    { icon: House, name: "Room Service" },
    { icon: LeafyGreen, name: "Yoga Classes" },
    { icon: Utensils, name: "Dining Area" },
    { icon: LayoutGrid, name: "Event Space" },
    { icon: Car, name: "Parking" },
    { icon: Heart, name: "Spa Services" },
    { icon: House, name: "Concierge Service" },
  ];

  const highlights = [
    {
      icon: Sun,
      title: "Spiritual Location",
      description: "Nestled in the spiritual heart of Rishikesh",
    },
    {
      icon: Clock,
      title: "Nearby Attractions",
      description:
        "Close to Triveni Ghat, Ram Jhula, Parmarth Niketan, and various ashrams",
    },
    {
      icon: Umbrella,
      title: "Tranquil Comfort",
      description:
        "Experience physical and mental relaxation with breathtaking views of the Ganges",
    },
  ];

  const handleBlissGangaClick = () => {
    router.push("/bliss-ganga");
  };

  return (
    <div className="font-comfortaaRegular">
      <section className="relative h-[40rem]">
        <div className="absolute inset-0">
          <img
            src="/images/rishikesh.jpg"
            alt="Rishikesh Ganges"
            className="w-full h-full object-cover object-center brightness-75 grayscale-[50%] transition-all duration-700 group-hover:brightness-100 group-hover:grayscale-0"
          />
        </div>
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-white p-4">
          <h1 className="font-comfortaaBold text-5xl md:text-7xl text-center mb-6 animate-fade-in">
            Rishikesh, Uttarakhand
          </h1>
          <p className="font-comfortaaLight text-xl md:text-3xl text-center max-w-3xl mb-8">
            Where Spirituality Meets Serenity
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
                Welcome to Bliss Ganga
              </h2>
              <p className="font-comfortaaLight text-gray-600 text-lg leading-relaxed">
                Bliss Ganga (A Unit of the Falcon Group) is not just a Hotel in
                Rishikesh that will leave you breathless with the enchantment of
                its surroundings, but assists in enabling you to experience both
                physical and mental relaxation and realize the importance of a
                moment of calm and personal space in your everyday life. It is a
                charming 3 star boutique hotel in the sanctums of Rishikesh, a
                land where spirituality and Mother Nature blend into a heady
                concoction.
              </p>
              <div className="space-y-4">
                <p className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 text-primary mr-3" />
                  0.5 km from Triveni Ghat
                </p>
                <p className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 text-primary mr-3" />1 km from Ram
                  Jhula
                </p>
                <p className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 text-primary mr-3" />
                  1.5 km from Parmarth Niketan
                </p>
                <p className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 text-primary mr-3" />2 km from
                  Laxman Jhula
                </p>
                <p className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 text-primary mr-3" />
                  35 km from Jolly Grant Airport
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/images/bliss/room1.jpg"
                alt="Bliss Ganga Room"
                className="rounded-lg h-64 w-full object-cover"
              />
              <img
                src="/images/bliss/room2.jpg"
                alt="Bliss Ganga View"
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
                      Bliss Ganga Hotel
                    </h3>
                    <p className="font-comfortaaLight text-gray-600 text-lg leading-relaxed">
                      Experience the perfect blend of modern comfort and
                      spiritual tranquility at Bliss Ganga. Our boutique hotel
                      offers breathtaking views of the Ganges, comfortable
                      accommodations, and a serene environment perfect for both
                      relaxation and spiritual awakening.
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
                    onClick={handleBlissGangaClick}
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-lg w-full md:w-auto"
                  >
                    Explore Hotel Details
                  </Button>
                </div>
                <div className="relative h-[400px] rounded-xl overflow-hidden group">
                  <img
                    src="/images/bliss/about.jpg"
                    alt="Bliss Ganga Exterior"
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
              Strategically located near Rishikesh&apos;s spiritual landmarks
              and the holy Ganges
            </p>
          </div>
          <div className="h-[500px] rounded-xl overflow-hidden shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3456.789012345678!2d78.12345678901234!3d30.12345678901234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDA3JzM0LjQiTiA3OMKwMDcnMzQuNCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              title="Bliss Ganga Location Map"
            />
          </div>
        </div>
      </section>

      <div className="fixed bottom-20 left-0 right-0 z-50 px-4 md:hidden">
        <Button
          onClick={handleBlissGangaClick}
          className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-full shadow-2xl"
        >
          View Hotel Details
        </Button>
      </div>
    </div>
  );
};

export default RishikeshLocation;

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Adventure = () => {
  return (
    <section className="py-16 md:py-20 bg-white px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 order-2 md:order-1">
            <div className="space-y-2">
              <h2 className="font-comfortaaBold text-4xl md:text-5xl text-primary tracking-tight">
                Your Goan Adventure Starts Here
              </h2>
              <h3 className="font-comfortaaRegular text-2xl md:text-3xl text-gray-600">
                Experience Luxury & Comfort
              </h3>
            </div>
            <div className="space-y-4">
              <p className="font-comfortaaRegular text-base md:text-lg text-gray-600 leading-relaxed">
                Immerse yourself in the perfect blend of luxury and Goan
                hospitality. Our rooms are thoughtfully designed to provide you
                with the utmost comfort while maintaining the charm of local
                architecture.
              </p>
              <p className="font-comfortaaRegular text-base md:text-lg text-gray-600 leading-relaxed">
                From beach-view suites to garden-facing deluxe rooms, each space
                is crafted to make your stay memorable. Enjoy modern amenities,
                personalized service, and the warmth of Apricus hospitality.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-primary hover:bg-primary/90 text-white font-comfortaaBold text-lg px-8 py-6">
                Book Your Stay
              </Button>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white font-comfortaaBold text-lg px-8 py-6"
              >
                Explore Rooms
              </Button>
            </div>
          </div>
          <div className="relative h-80 md:h-[600px] order-1 md:order-2">
            <div className="relative h-full w-full overflow-hidden rounded-xl">
              <Image
                src="/images/slidertwo.jpg"
                alt="Luxury Hotel Room"
                layout="fill"
                objectFit="cover"
                className="rounded-xl transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                    <span className="font-comfortaaBold text-2xl">
                      Premium Suites
                    </span>
                    <span className="font-comfortaaRegular text-sm">
                      Starting from ₹12,000/night
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Adventure;

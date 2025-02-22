"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const places = [
  {
    image: "/images/exterior.jpg",
    title: "Oceanfront Serenity",
    description: "Experience breathtaking views of the Arabian Sea",
  },
  {
    image: "/images/roomtwo.jpg",
    title: "Sunset Terrace",
    description: "Unwind in our elegant east-facing terrace",
  },
  {
    image: "/images/proptwo.jpg",
    title: "Panoramic Vistas",
    description: "Enjoy panoramic views from our rooftop terrace",
  },
  {
    image: "/images/slidertwo.jpg",
    title: "Luxury Suites",
    description: "Indulge in our meticulously designed rooms",
  },

  {
    image: "/images/swim.jpg",
    title: "Infinity Pool",
    description: "Relax by our infinity pool at sunset",
  },
];

const PlacesSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideInterval, setSlideInterval] = useState<NodeJS.Timeout>();

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % places.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + places.length) % places.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    setSlideInterval(interval);
    return () => clearInterval(interval);
  }, []);

  const handleMouseEnter = () => {
    if (slideInterval) clearInterval(slideInterval);
  };

  const handleMouseLeave = () => {
    const interval = setInterval(nextSlide, 5000);
    setSlideInterval(interval);
  };

  return (
    <section className="py-20 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="text-center mb-12">
          <h2 className="font-comfortaaBold text-4xl md:text-5xl mb-4">
            Discover Apricus Experiences
          </h2>
          <p className="font-comfortaaRegular text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Immerse yourself in the luxury and comfort of our carefully curated
            spaces. Each corner of Apricus Hotels tells a story of elegance and
            Goan hospitality.
          </p>
        </div>

        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {places.map((place, index) => (
                <div key={index} className="w-full flex-shrink-0 px-2">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl">
                    <div className="relative h-64 md:h-96">
                      <Image
                        src={place.image}
                        alt={place.title}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="font-comfortaaBold text-2xl md:text-3xl mb-2">
                          {place.title}
                        </h3>
                        <p className="font-comfortaaRegular text-sm md:text-base text-white/90">
                          {place.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="ghost"
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex justify-center mt-6 space-x-2">
          {places.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-white w-4" : "bg-white/50"
              }`}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-white hover:bg-white/90 text-primary font-comfortaaBold text-lg px-8 py-6">
            Explore All Experiences
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PlacesSlider;

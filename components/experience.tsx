"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  { src: "/images/sliderone.jpg", alt: "Apricus Hotel Exterior" },
  { src: "/images/slidertwo.jpg", alt: "Apricus Hotel Interior" },
  { src: "/images/sliderthree.jpg", alt: "Apricus Hotel Pool" },
];

const Experience = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const timer = setInterval(nextImage, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-primary text-white py-20 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="font-comfortaaBold text-4xl md:text-5xl tracking-tight">
                WELCOME TO APRICUS
              </h2>
              <h3 className="font-comfortaaRegular text-2xl md:text-3xl text-white/90">
                Apricus Group Of Hotels
              </h3>
            </div>
            <div className="space-y-4">
              <p className="font-comfortaaRegular text-base md:text-lg leading-relaxed">
                The word &apos;Apricus&apos; has its roots in the Latin dialect.
                It means lots of sunshine. Just as the sun shines to remove the
                darkness, Apricus Hotels brighten your life, offering a
                wonderful stay!
              </p>
              <p className="font-comfortaaRegular text-base md:text-lg leading-relaxed">
                Tucked among the serene locales of Goa, Apricus Hotels and
                Resorts Pvt. Ltd offers you the best facilities and exceptional
                service, thus paving way for a beautiful experience.
              </p>
            </div>
            <Button className="bg-white hover:bg-white/90 text-primary font-comfortaaBold text-lg px-8 py-6">
              Discover More
            </Button>
          </div>
          <div className="relative h-80 md:h-[500px] group">
            <div className="relative h-full w-full overflow-hidden rounded-xl">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentImage ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-xl"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={24} />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImage ? "bg-white w-4" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;

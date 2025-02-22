"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import BGNavigation from "@/components/hotel-nav/bliss-ganga";

const GalleryPage = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const images = [
    "/images/bliss/about.jpg",
    "/images/bliss/executive.jpg",
    "/images/bliss/premium.jpg",
    "/images/bliss/web1.jpeg",
    "/images/bliss/web2.jpeg",
    "/images/bliss/hero-main.jpeg",
    "/images/bliss/res1.jpg",
    "/images/bliss/res2.jpg",
    "/images/bliss/room1.jpg",
    "/images/bliss/room2.jpg",
    "/images/bliss/room3.jpg",
    "/images/bliss/hero1.jpg",
  ];

  const categories = [
    "Sacred Spaces",
    "Accommodations",
    "Events & Gatherings",
    "Dining & Leisure",
  ];

  const handlePrevious = () => {
    setSelectedImage((prev) =>
      prev === null ? null : prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedImage((prev) =>
      prev === null ? null : prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 font-comfortaaBold">
      {/* Hero Section */}
      <BGNavigation />
      <section className="relative h-[40vh] min-h-[300px]">
        <Image
          src="/images/bliss/about.jpg"
          alt="Bliss Ganga Hotel Gallery"
          layout="fill"
          objectFit="cover"
          priority
          className="brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-accent/80 to-transparent" />
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-center h-full">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Gallery
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-white/90 max-w-2xl"
            >
              Experience the divine beauty of the Ganges and our serene
              accommodations
            </motion.p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-4 justify-center">
          {categories.map((category, index) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              {category}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative aspect-square cursor-pointer group"
              onClick={() => setSelectedImage(index)}
            >
              <Image
                src={src}
                alt={`Bliss Ganga Hotel - ${categories[Math.floor(index / 3)]}`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-lg" />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                <p className="text-white text-sm">
                  {categories[Math.floor(index / 3)]}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full md:w-4/5 md:h-4/5">
              <Image
                src={images[selectedImage]}
                alt={`Bliss Ganga Hotel - ${
                  categories[Math.floor(selectedImage / 3)]
                }`}
                layout="fill"
                objectFit="contain"
                className="p-4"
              />
            </div>
          </div>

          {/* Navigation Controls */}
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 px-4 py-2 rounded-full text-white">
            {selectedImage + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;

"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";

const NorthGoaPage = () => {
  const locations = [
    {
      id: "porvorim",
      name: "Porvorim",
      image: "/images/hero-porvorim.jpg",
      description:
        "Experience the vibrant energy of Porvorim, a bustling suburb connecting Panaji and Mapusa. Our Apricus property in Porvorim offers luxurious comfort with easy access to North Goa's most popular beaches, markets, and cultural attractions, all while providing a serene retreat amidst lush greenery.",
      href: "/locations/porvorim",
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh]">
        <Image
          src="/images/north-goa-hero.jpg"
          alt="North Goa"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center px-4">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-comfortaaBold text-white mb-4"
            >
              North Goa
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="w-24 h-1 bg-primary mx-auto mb-6"
            ></motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-white text-lg md:text-xl max-w-3xl mx-auto"
            >
              Discover the vibrant culture and lively atmosphere of North Goa
              with Apricus Hotels & Resorts
            </motion.p>
          </div>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-comfortaaBold text-gray-800 mb-6">
            Discover North Goa
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            North Goa is known for its vibrant atmosphere, lively beaches, and
            rich cultural tapestry. From bustling markets and exciting nightlife
            to historical forts and Portuguese architecture, this region offers
            an energetic yet culturally rich experience. Apricus Hotels &
            Resorts invites you to explore North Goa&apos;s dynamic charm while
            enjoying the comfort and luxury of our carefully curated property in
            Porvorim.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full">
              <MapPin className="w-4 h-4 mr-2" />
              <span>Vibrant Beaches</span>
            </div>
            <div className="flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full">
              <MapPin className="w-4 h-4 mr-2" />
              <span>Luxury Accommodation</span>
            </div>
            <div className="flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full">
              <MapPin className="w-4 h-4 mr-2" />
              <span>Cultural Heritage</span>
            </div>
            <div className="flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full">
              <MapPin className="w-4 h-4 mr-2" />
              <span>Gourmet Experiences</span>
            </div>
          </div>
        </motion.div>

        {/* Locations Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mt-16"
        >
          <h2 className="text-3xl md:text-4xl font-comfortaaBold text-gray-800 text-center mb-12">
            Our Location in North Goa
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8 max-w-2xl mx-auto">
            {locations.map((location) => (
              <motion.div
                key={location.id}
                variants={fadeInUp}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-64">
                  <Image
                    src={location.image}
                    alt={location.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-comfortaaBold text-gray-800 mb-3">
                    {location.name}
                  </h3>
                  <p className="text-gray-600 mb-6">{location.description}</p>
                  <Link
                    href={location.href}
                    className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Explore {location.name}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Experience Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center max-w-4xl mx-auto mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-comfortaaBold text-gray-800 mb-6">
              The North Goa Experience
            </h2>
            <p className="text-gray-600 text-lg">
              North Goa offers a perfect blend of vibrant energy and rich
              cultural heritage. From lively beaches and bustling markets to
              historical forts and churches, the region presents diverse
              experiences that cater to all types of travelers, from adventure
              seekers to history enthusiasts.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-comfortaaBold text-gray-800 mb-4">
                Beaches & Activities
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Vibrant beaches with water sports and beach shacks
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Adventure activities including parasailing and jet skiing
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Scenic river cruises on the Mandovi River
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Lush spice plantations and nature walks
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-comfortaaBold text-gray-800 mb-4">
                Heritage & Nightlife
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Historic forts and Portuguese colonial architecture
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Vibrant night markets and beach parties
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Gourmet restaurants serving authentic Goan cuisine
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Cultural events and traditional performances
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-primary/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-comfortaaBold text-gray-800 mb-6">
              Ready to Experience North Goa?
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-3xl mx-auto">
              Book your stay at our Apricus property in Porvorim and discover
              the perfect balance of luxury, comfort, and the vibrant energy
              that North Goa is famous for.
            </p>
            <Link
              href="/contact-us"
              className="inline-block bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-md transition-colors"
            >
              Contact Us for Bookings
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NorthGoaPage;

"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";

const SouthGoaPage = () => {
  const locations = [
    {
      id: "benaulim",
      name: "Benaulim",
      image: "/images/hero-benaulim.jpg",
      description:
        "Discover the serene beauty of Benaulim, a tranquil coastal village in South Goa known for its pristine beaches, rich cultural heritage, and relaxed atmosphere. Experience authentic Goan hospitality at our Apricus properties nestled in this idyllic location.",
      href: "/locations/benaulim-south-goa",
    },
    {
      id: "cavelossim",
      name: "Cavelossim",
      image: "/images/hero-cavelossim.jpg",
      description:
        "Cavelossim offers a perfect blend of luxury and natural beauty with its white sandy beaches and the scenic Sal River. Our Apricus properties in Cavelossim provide an exclusive retreat amidst coconut groves and stunning ocean views.",
      href: "/locations/cavelossim",
    },
    {
      id: "varca",
      name: "Varca",
      image: "/images/hero-varca.jpg",
      description:
        "Varca Beach is one of South Goa's most pristine stretches of coastline, offering a peaceful escape from the crowds. Our Apricus properties in Varca provide the perfect base to explore this beautiful location with its fishing villages and golden sands.",
      href: "/locations/varca",
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
          src="/images/south-goa-hero.jpeg"
          alt="South Goa"
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
              South Goa
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
              Experience the tranquil beauty and laid-back charm of South Goa
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
            Discover South Goa
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            South Goa represents the quieter, more laid-back side of
            India&apos;s smallest state. With its pristine beaches, swaying palm
            trees, and charming fishing villages, this region offers a perfect
            escape from the hustle and bustle of everyday life. Apricus Hotels &
            Resorts invites you to experience the authentic Goan lifestyle in
            our carefully selected properties across South Goa&apos;s most
            beautiful locations.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full">
              <MapPin className="w-4 h-4 mr-2" />
              <span>Pristine Beaches</span>
            </div>
            <div className="flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full">
              <MapPin className="w-4 h-4 mr-2" />
              <span>Luxury Accommodation</span>
            </div>
            <div className="flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full">
              <MapPin className="w-4 h-4 mr-2" />
              <span>Rich Cultural Experience</span>
            </div>
            <div className="flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full">
              <MapPin className="w-4 h-4 mr-2" />
              <span>Authentic Cuisine</span>
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
            Our Locations in South Goa
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              The South Goa Experience
            </h2>
            <p className="text-gray-600 text-lg">
              South Goa offers a unique blend of relaxation, adventure, and
              cultural immersion. From tranquil beaches perfect for sunbathing
              to water sports for the adventurous, from ancient temples to
              Portuguese colonial architecture, the region presents a diverse
              range of experiences for every traveler.
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
                Beaches & Nature
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Pristine white sandy beaches with crystal-clear waters
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Dolphin watching tours in the Arabian Sea
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Lush green paddy fields and coconut groves
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Bird watching at the Salim Ali Bird Sanctuary
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
                Culture & Cuisine
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Portuguese colonial heritage and architecture
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Traditional Goan seafood cuisine
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Local markets with authentic handicrafts
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Cultural performances featuring folk music and dance
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
              Ready to Experience South Goa?
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-3xl mx-auto">
              Book your stay at one of our Apricus properties in South Goa and
              immerse yourself in the perfect blend of luxury, comfort, and
              authentic Goan experiences.
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

export default SouthGoaPage;

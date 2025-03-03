"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";

const UttarakhandPage = () => {
  const locations = [
    {
      id: "mussoorie",
      name: "Mussoorie",
      image: "/images/muss/hero1.jpg",
      description:
        "Discover the enchanting beauty of Mussoorie, the 'Queen of Hills,' with its panoramic Himalayan views, colonial charm, and refreshing mountain air. Our Apricus property in Mussoorie offers a luxurious mountain retreat with breathtaking vistas of the Doon Valley and snow-capped Himalayan peaks.",
      href: "/locations/mussoorie",
    },
    {
      id: "rishikesh",
      name: "Rishikesh",
      image: "/images/rishikesh.jpg",
      description:
        "Experience the spiritual and adventure hub of Rishikesh, nestled along the sacred Ganges River at the foothills of the Himalayas. Our Apricus property offers a serene sanctuary where you can rejuvenate your mind and body while exploring the yoga capital of the world.",
      href: "/locations/rishikesh",
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
          src="/images/uttarakhand-hero.webp"
          alt="Uttarakhand"
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
              Uttarakhand
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
              Embrace the majestic Himalayas and spiritual sanctuaries of
              Uttarakhand with Apricus Hotels & Resorts
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
            Discover Uttarakhand
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Uttarakhand, known as the &apos;Land of Gods,&apos; offers a perfect
            blend of spiritual sanctuaries, adventure opportunities, and
            breathtaking natural landscapes. From snow-capped Himalayan peaks
            and lush valleys to sacred rivers and ancient temples, this northern
            Indian state is a paradise for nature lovers, spiritual seekers, and
            adventure enthusiasts alike. Apricus Hotels & Resorts invites you to
            experience the magic of Uttarakhand at our premium properties in
            Mussoorie and Rishikesh.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full">
              <MapPin className="w-4 h-4 mr-2" />
              <span>Himalayan Vistas</span>
            </div>
            <div className="flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full">
              <MapPin className="w-4 h-4 mr-2" />
              <span>Luxury Mountain Retreats</span>
            </div>
            <div className="flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full">
              <MapPin className="w-4 h-4 mr-2" />
              <span>Spiritual Experiences</span>
            </div>
            <div className="flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full">
              <MapPin className="w-4 h-4 mr-2" />
              <span>Adventure Activities</span>
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
            Our Locations in Uttarakhand
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
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
              The Uttarakhand Experience
            </h2>
            <p className="text-gray-600 text-lg">
              Uttarakhand offers a diverse range of experiences that satisfy the
              soul, invigorate the body, and captivate the mind. From spiritual
              enlightenment and cultural immersion to adrenaline-pumping
              adventures and serene nature retreats, this Himalayan state
              promises unforgettable memories for every type of traveler.
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
                Nature & Adventure
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Panoramic Himalayan vistas and mountain trails
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  White water rafting on the Ganges River
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Trekking through lush valleys and dense forests
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Wildlife spotting in national parks and sanctuaries
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
                Culture & Spirituality
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Ancient temples and spiritual retreats
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Yoga and meditation practices in their birthplace
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Traditional Garhwali and Kumaoni cuisine
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Cultural festivals and local handicrafts
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
              Ready to Experience Uttarakhand?
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-3xl mx-auto">
              Book your stay at one of our Apricus properties in Uttarakhand and
              embark on a journey of spiritual discovery, natural wonder, and
              luxurious comfort in the embrace of the magnificent Himalayas.
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

export default UttarakhandPage;

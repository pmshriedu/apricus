"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Clock,
  Phone,
  Utensils,
  Globe,
  Coffee,
  Star,
  Mountain,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BGNavigation from "@/components/hotel-nav/bliss-ganga";

const restaurants = [
  {
    name: "Ambrosia",
    subtitle: "The Multi Cuisine Restaurant",
    description:
      "A speciality multi-cuisine restaurant offering a wide and varied choice of both International and Indian cuisine.",
    image: "/images/bliss/res1.jpg",
    features: [
      {
        icon: <Globe className="h-6 w-6" />,
        title: "International Cuisine",
        description: "Wide variety of global dishes",
      },
      {
        icon: <Utensils className="h-6 w-6" />,
        title: "Indian Specialties",
        description: "Authentic Indian flavors",
      },
      {
        icon: <Star className="h-6 w-6" />,
        title: "Fine Dining",
        description: "Elegant atmosphere and service",
      },
      {
        icon: <Clock className="h-6 w-6" />,
        title: "All-Day Dining",
        description: "Breakfast, lunch and dinner service",
      },
    ],
  },
  {
    name: "Bliss Cafe",
    subtitle: "Rooftop Cafe & Lounge",
    description:
      "Our Rooftop cafe offers a glimpse of Haridwar. A rejuvenating evening, complete with delicious food and piping hot beverages, awaits you at Bliss Cafe.",
    image: "/images/bliss/res2.jpg",
    features: [
      {
        icon: <Mountain className="h-6 w-6" />,
        title: "Rooftop Views",
        description: "Panoramic views of Haridwar",
      },
      {
        icon: <Coffee className="h-6 w-6" />,
        title: "Cafe Specialties",
        description: "Fresh beverages and snacks",
      },
      {
        icon: <Star className="h-6 w-6" />,
        title: "Evening Ambiance",
        description: "Perfect for relaxing evenings",
      },
      {
        icon: <Clock className="h-6 w-6" />,
        title: "Flexible Hours",
        description: "Open throughout the day",
      },
    ],
  },
];

const DiningPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10 font-comfortaaBold">
      <BGNavigation />
      {/* Hero Section */}
      <section className="relative h-[60vh]">
        <Image
          src="/images/bliss/res1.jpg"
          alt="Hotel Bliss Ganga Dining"
          layout="fill"
          objectFit="cover"
          priority
          className="brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-accent/80 to-transparent" />

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-center h-full pt-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 text-center"
            >
              Dining at Hotel Bliss Ganga
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto text-center"
            >
              Experience culinary excellence with our diverse dining options
            </motion.p>
          </div>
        </div>
      </section>

      {/* Restaurants Sections */}
      {restaurants.map((restaurant, restaurantIndex) => (
        <section
          key={restaurant.name}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: restaurantIndex % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className={`${restaurantIndex % 2 === 1 ? "lg:order-2" : ""}`}
            >
              <h2 className="text-3xl font-bold mb-2">{restaurant.name}</h2>
              <h3 className="text-xl text-muted-foreground mb-4">
                {restaurant.subtitle}
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                {restaurant.description}
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="gap-2">
                  <Phone className="w-4 h-4" />
                  Reserve a Table
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  <Utensils className="w-4 h-4" />
                  View Menu
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: restaurantIndex % 2 === 0 ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className={`relative h-[400px] rounded-lg overflow-hidden ${
                restaurantIndex % 2 === 1 ? "lg:order-1" : ""
              }`}
            >
              <Image
                src={restaurant.image}
                alt={restaurant.name}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </motion.div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {restaurant.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-card hover:bg-accent/10 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {feature.icon}
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default DiningPage;

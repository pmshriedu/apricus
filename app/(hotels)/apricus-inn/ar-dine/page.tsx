"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Clock,
  Phone,
  MapPin,
  Utensils,
  Globe,
  Award,
  Shell,
  GlassWater,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import ARNavigation from "@/components/hotel-nav/apricus-in";

const features = [
  {
    icon: <Shell className="h-6 w-6" />,
    title: "Local Flavors",
    description: "Authentic Goan cuisine with a contemporary twist",
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "International Cuisine",
    description: "Global dishes crafted with local ingredients",
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "Master Chefs",
    description: "Culinary experts with international experience",
  },
  {
    icon: <GlassWater className="h-6 w-6" />,
    title: "River View",
    description: "Panoramic views of the serene Goan waters",
  },
];

const CraftKitchenPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10 font-comfortaaBold">
      <ARNavigation />
      <section className="relative h-[60vh]">
        <Image
          src="/images/apricus/dine1.jpg"
          alt="Craft Kitchen Restaurant and Bar"
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
              Craft Kitchen
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto text-center"
            >
              Where Goan flavors meet international cuisine
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col md:flex-row justify-center gap-4 mt-8 px-4 md:px-0"
            >
              <Badge
                variant="secondary"
                className="bg-white/90 text-base md:text-lg px-3 py-1.5 md:px-4 md:py-2 w-full md:w-auto flex justify-center items-center"
              >
                <Clock className="w-4 h-4 mr-2" />
                Open Daily 07:00 AM - 02:00 AM
              </Badge>
              <Badge
                variant="secondary"
                className="bg-white/90 text-base md:text-lg px-3 py-1.5 md:px-4 md:py-2 w-full md:w-auto flex justify-center items-center"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Cavelossim, South Goa
              </Badge>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6">
              Culinary Artistry Meets Riverside Dining
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Experience culinary artistry at Craft Kitchen , where our expert
              chefs blend local Goan flavors with international cuisine. Enjoy
              your meal with panoramic views of the river, creating an
              unforgettable dining experience.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="gap-2">
                <Phone className="w-4 h-4" />
                Make a Reservation
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Utensils className="w-4 h-4" />
                Explore Menu
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative h-[400px] rounded-lg overflow-hidden"
          >
            <Image
              src="/images/apricus/bar2.jpg"
              alt="Craft Kitchen Interior"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
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
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CraftKitchenPage;

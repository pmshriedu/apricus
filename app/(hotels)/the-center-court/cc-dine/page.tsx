"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Clock,
  Phone,
  MapPin,
  Utensils,
  Leaf,
  Crown,
  Coffee,
  Wine,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CCNavigation from "@/components/hotel-nav/center-court";

const features = [
  {
    icon: <Leaf className="h-6 w-6" />,
    title: "100% Vegetarian",
    description: "Pure vegetarian cuisine crafted with fresh ingredients",
  },
  {
    icon: <Crown className="h-6 w-6" />,
    title: "Award Winning",
    description: "Recognized for culinary excellence in Goan ",
  },
  {
    icon: <Coffee className="h-6 w-6" />,
    title: "All-Day Dining",
    description: "Breakfast, lunch, dinner, and beverages served daily",
  },
  {
    icon: <Wine className="h-6 w-6" />,
    title: "Mocktail Bar",
    description: "Innovative alcohol-free beverages and fresh juices",
  },
];

const VeggieDelightPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10 font-comfortaaBold">
      {/* Hero Section */}
      <CCNavigation />
      <section className="relative h-[60vh]">
        <Image
          src="/images/center/gallery7.jpg"
          alt="Veggie Delight Restaurant"
          layout="fill"
          objectFit="cover"
          priority
          className="brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-accent/80 to-transparent" />

        {/* Logo Overlay */}
        {/* <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-32 h-32">
          <Image
            src="/images/veggie.png"
            alt="Veggie Delight Logo"
            layout="fill"
            objectFit="contain"
            priority
          />
        </div> */}

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-center h-full pt-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 text-center"
            >
              Veggie Delight
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto text-center"
            >
              Experience the finest vegetarian cuisine in Varca, Goa
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
                Open Daily 7:00 AM - 11:00 PM
              </Badge>
              <Badge
                variant="secondary"
                className="bg-white/90 text-base md:text-lg px-3 py-1.5 md:px-4 md:py-2 w-full md:w-auto flex justify-center items-center"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Varca, Goa
              </Badge>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6">
              A Vegetarian Paradise in Goa
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Veggie Delight brings you an extraordinary dining experience that
              celebrates the rich flavors of vegetarian cuisine. Nestled in the
              heart of Varca, our restaurant combines traditional Indian recipes
              with modern culinary techniques to create dishes that delight both
              locals and tourists alike.
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative h-[400px] rounded-lg overflow-hidden"
          >
            <Image
              src="/images/center/gallery8.jpg"
              alt="Restaurant Interior"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </motion.div>
        </div>

        {/* Features Grid */}
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

export default VeggieDelightPage;

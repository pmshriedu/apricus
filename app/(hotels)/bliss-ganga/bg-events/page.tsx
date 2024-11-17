"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, PhoneCall, Briefcase, Heart } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BGNavigation from "@/components/hotel-nav/bliss-ganga";

interface EventType {
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  capacity: string;
  features: string[];
}

const eventTypes: EventType[] = [
  {
    title: "Spiritual Weddings",
    description:
      "Create magical moments with a traditional wedding ceremony overlooking the sacred Ganges river",
    icon: <Heart className="h-6 w-6" />,
    image: "/images/bliss/web1.jpeg",
    capacity: "Up to 200 guests",
    features: [
      "Riverside venue",
      "Traditional ceremonies",
      "Customized décor",
      "Ganga aarti arrangements",
    ],
  },
  {
    title: "Business Conferences",
    description:
      "Modern conference facilities with a serene backdrop of the Ganges for productive business meetings",
    icon: <Briefcase className="h-6 w-6" />,
    image: "/images/bliss/web2.jpeg",
    capacity: "10-100 attendees",
    features: [
      "High-speed WiFi",
      "AV equipment",
      "River view hall",
      "Break-out areas",
    ],
  },
];

const EventsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 font-comfortaaBold">
      {/* Hero Section */}
      <BGNavigation />
      <section className="relative h-[60vh] min-h-[400px]">
        <Image
          src="/images/bliss/hero-main.jpeg"
          alt="Bliss Ganga Events"
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
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight"
            >
              Sacred Events by the Ganges
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl leading-relaxed"
            >
              Experience the perfect blend of spiritual tranquility and modern
              comfort for your special occasions
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 mt-8"
            >
              <Button
                size="lg"
                className="w-full sm:w-auto text-sm sm:text-base gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                Contact Event Team
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto text-sm sm:text-base gap-2"
              >
                <Calendar className="w-4 h-4" />
                Check Availability
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Event Types Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Create Timeless Memories</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            From spiritual weddings to corporate conferences, Bliss Ganga offers
            an unparalleled setting with breathtaking views of the sacred Ganges
            river
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {eventTypes.map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90">
                      {event.capacity}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {event.icon}
                    </div>
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                  </div>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {event.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full">Learn More</Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 p-8 bg-card rounded-lg text-center"
        >
          <h3 className="text-2xl font-bold mb-4">
            Plan Your Event at Bliss Ganga
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Let our experienced team help you create the perfect event by the
            sacred Ganges. Whether it&apos;s a spiritual wedding ceremony or a
            corporate conference, we&apos;ll ensure every detail is perfect.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="gap-2">
              <PhoneCall className="w-4 h-4" />
              Contact Us
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default EventsPage;

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import StringLights from "@/components/lights";
import Image from "next/image";

const eventData = [
  {
    id: 1,
    title: "Wedding Planning",
    description:
      "Create your dream wedding with our expert planning services. From intimate ceremonies to grand celebrations, we handle every detail with precision.",
    image: "/images/events/wed.webp",
    link: "/services/wedding-planning",
  },
  {
    id: 2,
    title: "Corporate Events",
    description:
      "Professional corporate event planning for conferences, seminars, team building, and company celebrations.",
    image: "/images/events/cor.jpg",
    link: "/services/corporate-events",
  },
  {
    id: 3,
    title: "Private Parties",
    description:
      "Make your special occasions memorable with our private party planning services. Birthday parties, anniversaries, and celebrations.",
    image: "/images/events/private.jpg",
    link: "/services/private-parties",
  },
  {
    id: 4,
    title: "Catering Services",
    description:
      "Exquisite catering solutions for all types of events. Our culinary team creates memorable dining experiences.",
    image: "/images/events/cate.webp",
    link: "/services/catering",
  },
  {
    id: 5,
    title: "Venue Selection",
    description:
      "Find the perfect venue for your event. We partner with premium locations to offer you the best options.",
    image: "/images/events/proptwo.jpg",
    link: "/services/venues",
  },
  {
    id: 6,
    title: "Event Design",
    description:
      "Transform your event space with our creative design services. From decor to lighting, we create stunning atmospheres.",
    image: "/images/events/about.jpg",
    link: "/services/design",
  },
];

const EventsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <header className="relative bg-primary min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Decorative Lights */}
        <StringLights />

        {/* Header Content */}
        <div className="relative z-10 text-center px-4 py-20 max-w-7xl mx-auto">
          <h1 className="font-comfortaaBold text-4xl md:text-6xl lg:text-7xl text-white mb-6 drop-shadow-lg">
            Events & Catering
          </h1>
          <p className="font-comfortaaBold text-lg md:text-xl text-white/90 mb-8">
            Creating Memorable Events with Style & Perfection
          </p>
          <Button
            asChild
            className="bg-white text-primary hover:bg-white/90 px-8 py-6 rounded-full font-comfortaaBold text-lg shadow-lg"
          >
            <Link href="#services">Explore Our Services</Link>
          </Button>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent" />
      </header>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-comfortaaBold text-primary mb-4">
              Our Event Services
            </h2>
            <div className="w-24 h-1 bg-primary/20 mx-auto mb-6" />
            <p className="text-gray-600 max-w-2xl mx-auto font-comfortaaRegular">
              Discover our comprehensive range of event services designed to
              make your special occasions truly memorable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventData.map((event) => (
              <Link href={event.link} key={event.id} className="block">
                <Card className="h-full transition-all duration-300 hover:shadow-lg border-primary/10 group">
                  <CardHeader className="p-0">
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={event.image}
                        alt={event.title}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="font-comfortaaBold text-xl text-primary mb-3">
                      {event.title}
                    </CardTitle>
                    <CardDescription className="font-comfortaaRegular text-gray-600 line-clamp-3">
                      {event.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-2xl md:text-3xl font-comfortaaBold mb-6">
            Ready to Plan Your Next Event?
          </h3>
          <p className="text-white/90 mb-8 font-comfortaaRegular">
            Contact us today to discuss how we can make your event
            extraordinary.
          </p>
          <Button
            asChild
            className="bg-white text-primary hover:bg-white/90 px-8 py-6 rounded-full font-comfortaaBold text-lg shadow-lg"
          >
            <Link href="/contact-us">Contact Us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;

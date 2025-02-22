"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Linkedin,
  Sun,
  Utensils,
  Wind,
  Video,
  Wifi,
  Tv,
  Shirt,
  PlayCircle,
  CarTaxiFront,
  Waves,
  X,
  FileDown,
  Mail,
} from "lucide-react";

type Service = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

type Property = {
  name: string;
  description: string;
};

type BusinessOpportunity = {
  title: string;
  description: string;
};

const services: Service[] = [
  {
    icon: <CarTaxiFront className="w-8 h-8" />,
    title: "Airport Transfer",
    description: "Complimentary airport pickup and drop-off service",
  },
  {
    icon: <Utensils className="w-8 h-8" />,
    title: "All Inclusive",
    description: "Full-board accommodation with all meals included",
  },
  {
    icon: <Wind className="w-8 h-8" />,
    title: "Air-conditioned",
    description: "Climate-controlled rooms for your comfort",
  },
  {
    icon: <Video className="w-8 h-8" />,
    title: "Under Protection",
    description: "24/7 security and surveillance for your safety",
  },
  {
    icon: <Waves className="w-8 h-8" />,
    title: "Private Pools",
    description: "Access to exclusive swimming pools",
  },
  {
    icon: <Wifi className="w-8 h-8" />,
    title: "Free Wi-Fi",
    description: "High-speed internet throughout the property",
  },
  {
    icon: <Tv className="w-8 h-8" />,
    title: "Smart TV",
    description: "Modern entertainment systems in every room",
  },
  {
    icon: <Shirt className="w-8 h-8" />,
    title: "Laundry",
    description: "Professional laundry and dry-cleaning services",
  },
];

const properties: Property[] = [
  {
    name: "Apricus",
    description: "Our flagship property offering unparalleled luxury",
  },
  {
    name: "Apricus Residency",
    description: "Urban sophistication meets traditional hospitality",
  },
  {
    name: "Apricus Inn",
    description: "Comfortable stays with a touch of elegance",
  },
  {
    name: "Apricus Villas and Homes",
    description: "Experience authentic Goan hospitality",
  },
  {
    name: "Apricus Express",
    description:
      "Quick, convenient stays with modern amenities and reliable service",
  },
  {
    name: "Craft Kitchen by Apricus",
    description:
      "Artisanal dining experience with innovative culinary creations",
  },
];

const businessOpportunities: BusinessOpportunity[] = [
  {
    title: "Management Opportunities",
    description:
      "Partner with us to maximize profits in a brief period through our expert management services.",
  },
  {
    title: "Franchise Opportunity",
    description:
      "Leverage our management expertise to transform struggling properties into profitable ventures.",
  },
  {
    title: "Revenue Share Model",
    description:
      "Join our flexible partnership model where risks and rewards are shared, ensuring mutual growth and success.",
  },
];

const AboutUs: React.FC = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const openVideo = () => setIsVideoOpen(true);
  const closeVideo = () => setIsVideoOpen(false);
  return (
    <div className="bg-gray-50">
      {/* Hero Section - Now with primary background */}
      <div className="bg-primary text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Sun className="w-16 h-16 mx-auto mb-4" />
            <h1 className="font-comfortaaBold text-4xl lg:text-5xl mb-6">
              Welcome to Apricus Hotels
            </h1>
            <p className="font-comfortaaRegular text-lg max-w-2xl mx-auto">
              Where luxury meets tranquility in the heart of Goa
            </p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="font-comfortaaBold text-3xl text-primary mb-6">
              Our Story
            </h2>
            <p className="font-comfortaaRegular text-gray-600 mb-4">
              The word &apos;Apricus&apos; has its roots in the Latin dialect,
              meaning &apos;lots of sunshine.&apos; Just as the sun shines to
              remove darkness, Apricus Hotels brighten your life, offering a
              wonderful stay!
            </p>
            <p className="font-comfortaaRegular text-gray-600 mb-4">
              Tucked among the serene locales of Goa, Apricus Hotels and Resorts
              Pvt. Ltd offers you the best facilities and exceptional service,
              paving the way for a beautiful experience.
            </p>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src="/images/roomone.jpg"
              alt="Apricus Hotel Exterior"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Our Properties Section - With alternating background */}
        <div className="bg-primary/5 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-comfortaaBold text-3xl text-primary mb-8 text-center">
              Our Brands
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <Card
                  key={property.name}
                  className="bg-white hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <h3 className="font-comfortaaBold text-xl text-primary">
                      {property.name}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="font-comfortaaRegular text-gray-600">
                      {property.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        {/* Business Opportunities Section - With primary background */}
        <div className="bg-primary/5 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-comfortaaBold text-3xl text-primary mb-8 text-center">
              Business Opportunities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {businessOpportunities.map((opportunity, index) => (
                <Card
                  key={index}
                  className="bg-white hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <h3 className="font-comfortaaBold text-xl text-primary mb-4">
                      {opportunity.title}
                    </h3>
                    <p className="font-comfortaaRegular text-gray-600">
                      {opportunity.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        {/* Brochure Download Section */}
        <div className="bg-primary/5 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="font-comfortaaBold text-3xl text-primary mb-4">
                    Download Our Brochure
                  </h2>
                  <p className="font-comfortaaRegular text-gray-600 mb-6">
                    Explore our complete portfolio of properties, services, and
                    business opportunities. Get detailed insights into what
                    makes Apricus Hotels the perfect choice for luxury
                    hospitality in Goa.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600">
                      <Sun className="w-5 h-5 mr-3 text-primary" />
                      <span>Comprehensive Property Overview</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Utensils className="w-5 h-5 mr-3 text-primary" />
                      <span>Detailed Amenities List</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <CarTaxiFront className="w-5 h-5 mr-3 text-primary" />
                      <span>Services & Special Features</span>
                    </div>
                  </div>
                  <a
                    href="/apricus-brochure.pdf"
                    download="Apricus_Hotels_Brochure.pdf"
                    className="inline-block mt-8"
                  >
                    <Button
                      className="bg-primary hover:bg-primary/90 text-white font-comfortaaBold flex items-center gap-2"
                      onClick={() => {
                        // Optional: Add analytics tracking here
                        console.log("Brochure download initiated");
                      }}
                    >
                      <FileDown className="w-5 h-5" />
                      Download Brochure
                    </Button>
                  </a>
                </div>
                <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
                  <Image
                    src="/apricus-brochure_preview.jpg"
                    alt="Apricus Hotels Brochure Preview"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg transition-transform duration-300 hover:scale-105"
                  />
                  {/* Optional: Add a preview overlay */}
                  <div className="absolute inset-0 bg-black/5 hover:bg-black/0 transition-colors duration-300">
                    <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg px-4 py-2">
                      <p className="text-sm font-comfortaaRegular text-gray-600">
                        PDF • 14.8 MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What We Offer Section */}
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="font-comfortaaBold text-3xl lg:text-4xl text-primary mb-4">
              What We Offer For You
            </h2>
            <p className="font-comfortaaRegular text-lg text-gray-600 max-w-2xl mx-auto">
              Experience unparalleled luxury with our comprehensive range of
              services and amenities
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card
                key={index}
                className="bg-white hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6 text-center">
                  <div className="text-primary mb-4">{service.icon}</div>
                  <h3 className="font-comfortaaBold text-lg mb-2">
                    {service.title}
                  </h3>
                  <p className="font-comfortaaRegular text-gray-600 text-sm">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Video Section - Now with full-width background */}
        <div className="bg-primary text-white w-full py-16 rounded-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-comfortaaBold text-3xl mb-6">
                  Experience Apricus
                </h2>
                <p className="font-comfortaaRegular mb-6">
                  Take a virtual tour of our luxurious properties and discover
                  the perfect blend of comfort, elegance, and Goan hospitality.
                  Immerse yourself in the Apricus experience before you even
                  arrive.
                </p>
                <Button className="bg-white text-primary hover:bg-gray-100 font-comfortaaBold">
                  Book Your Stay
                </Button>
              </div>
              <div
                className="relative h-[200px] sm:h-[300px] md:h-[400px] bg-gray-200 rounded-lg overflow-hidden group cursor-pointer"
                onClick={openVideo}
              >
                <Image
                  src="/images/sliderone.jpg"
                  alt="Hotel Video Thumbnail"
                  layout="fill"
                  objectFit="cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-50 transition-all">
                  <PlayCircle className="w-12 h-12 sm:w-16 sm:h-16 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Modal */}
        {isVideoOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl aspect-video">
              <Button
                className="absolute -top-10 right-0 bg-transparent hover:bg-white/10"
                onClick={closeVideo}
              >
                <X className="w-6 h-6" />
              </Button>
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Replace with your actual video URL
                title="Apricus Hotels Virtual Tour"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        {/* Leadership Team Section */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="font-comfortaaBold text-3xl text-primary mb-4">
                Leadership Team
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto"></div>
            </div>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Image Section */}
                  <div className="relative h-[400px] lg:h-full min-h-[400px] lg:min-h-[600px]">
                    <Image
                      src="/images/yogesh-kumar.jpg"
                      alt="Mr. Yogesh Kumar"
                      layout="fill"
                      objectFit="cover"
                      priority
                      className="transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent lg:hidden"></div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="border-l-4 border-primary pl-6 mb-8">
                      <p className="font-comfortaaBold text-accent mb-2">
                        Founder and Director
                      </p>
                      <h3 className="font-comfortaaBold text-2xl sm:text-3xl text-primary">
                        Mr. Yogesh Kumar
                      </h3>
                    </div>

                    <div className="mb-8">
                      <p className="font-comfortaaRegular text-gray-600 leading-relaxed">
                        With 20 years of expertise in the hospitality industry,
                        Mr. Kumar excels in brand building, public relations,
                        and sales. His journey began after graduating in hotel
                        management, leading to associations with renowned names
                        like Radisson Worldwide, The Lemon Tree Hotel Group, and
                        more.
                      </p>
                    </div>

                    {/* Professional Highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="font-comfortaaBold text-primary mb-1">
                          Experience
                        </div>
                        <div className="font-comfortaaRegular text-gray-600">
                          17+ Years
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="font-comfortaaBold text-primary mb-1">
                          Expertise
                        </div>
                        <div className="font-comfortaaRegular text-gray-600">
                          Hospitality Management
                        </div>
                      </div>
                    </div>

                    {/* Contact Section */}
                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                      <button className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                        <Mail size={20} />
                      </button>
                      <button className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                        <Linkedin size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Win-Win Philosophy Section */}
        <div className="text-center py-16">
          <h2 className="font-comfortaaBold text-3xl text-primary mb-4">
            Our Win-Win Philosophy
          </h2>
          <p className="font-comfortaaRegular text-lg text-gray-600 max-w-2xl mx-auto">
            We believe in creating mutual success. Partnering with Apricus
            Hotels will surely prove to be a great advantage for your business
            journey.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

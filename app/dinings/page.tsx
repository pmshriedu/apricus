"use client";
import React from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Utensils } from "lucide-react";
import { useRouter } from "next/navigation";

interface Property {
  title: string;
  subtitle?: string;
  imageUrl: string;
  content: string;
  address: string;
  hours?: string;
  cuisine?: string;
  url?: string;
}

const properties: Property[] = [
  {
    title: "Craft Kitchen and Bar",
    imageUrl: "/images/apricus/bar2.jpg",
    content:
      "Experience culinary artistry at Craft Kitchen, where our expert chefs blend local Goan flavors with international cuisine. Enjoy your meal with panoramic views of the river, creating an unforgettable dining experience. Our master chefs combine traditional techniques with modern innovation to bring you the best of both worlds.",
    address: "Cavelossim, South Goa",
    hours: "7am - 2am",
    cuisine: "Goan, International",
    url: "/apricus-inn/ar-dine",
  },
  {
    title: "Zuki Club",
    imageUrl: "/images/zuki.jpg",
    content:
      "Located in the heart of Candolim, ZUKI brings you an unforgettable nightlife experience where the party never stops! Our iconic club is designed to captivate with vibrant energy, pulsating beats, and an ambiance that attracts fun-lovers from all over the world.",
    address: "At Hotel Acacia, Candolim, Goa",

    url: "/contact-us",
  },
  // {
  //   title: "Veggie Delight Varca",
  //   imageUrl: "/images/dining1.jpg",
  //   content:
  //     "Indulge in a culinary journey at our beautifully designed restaurant, The Veggie Delight, where every dining experience is special. Savor multi-cuisine vegetarian and non-vegetarian dishes prepared with the freshest local ingredients.",
  //   address: "Varca, Goa",
  //   hours: "11am - 10pm",
  //   cuisine: "Multi-Cuisine, Vegetarian",
  //   url: "/the-center-court/cc-dine",
  // },
  // {
  //   title: "Ambrosia",
  //   subtitle: "The Multi Cuisine Restaurant",
  //   imageUrl: "/images/bliss/res1.jpg",
  //   content:
  //     "A speciality multi-cuisine restaurant offering a wide and varied choice of both International and Indian cuisine. Experience the perfect blend of flavors in an elegant dining atmosphere, where each dish is crafted to perfection by our expert chefs.",
  //   address: "Hotel Bliss Ganga, Rishikesh",
  //   hours: "7:00 AM - 11:00 PM",
  //   cuisine: "International, Indian",
  //   url: "/bliss-ganga/bg-dine",
  // },
  // {
  //   title: "Bliss Cafe",
  //   subtitle: "Rooftop Cafe & Lounge",
  //   imageUrl: "/images/bliss/res2.jpg",
  //   content:
  //     "Our Rooftop cafe offers a glimpse of Haridwar. A rejuvenating evening, complete with delicious food and piping hot beverages, awaits you at Bliss Cafe. Enjoy panoramic views while savoring our carefully curated menu of beverages and light meals.",
  //   address: "Rooftop, Hotel Bliss Ganga",
  //   hours: "8:00 AM - 10:00 PM",
  //   cuisine: "Cafe, Beverages, Light Meals",
  //   url: "/bliss-ganga/bg-dine",
  // },
  // {
  //   title: "Veggie Delight Varca",
  //   imageUrl: "/images/dining1.jpg",
  //   content:
  //     "Indulge in a culinary journey at our beautifully designed restaurant, The Veggie Delight, where every dining experience is special. Savor multi-cuisine vegetarian and non-vegetarian dishes prepared with the freshest local ingredients.",
  //   address: "Varca, Goa",
  //   hours: "11am - 10pm",
  //   cuisine: "Multi-Cuisine, Vegetarian",
  //   url: "/the-center-court/cc-dine",
  // },
];

const DiningPage: React.FC = () => {
  const router = useRouter();

  const handleExplore = (url?: string) => {
    if (url) {
      router.push(url);
    }
  };

  return (
    <>
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-primary/90">
        <div className="absolute inset-0 bg-[url('/dining-hero.jpg')] bg-cover bg-center opacity-50" />
        <div className="relative z-20 text-white text-center px-4">
          <h1 className="font-comfortaaBold text-5xl mb-4">
            Culinary Excellence
          </h1>
          <p className="font-comfortaaRegular text-xl max-w-2xl mx-auto mb-6">
            Embark on a gastronomic journey through our exceptional dining
            venues. From authentic local flavors to international cuisines, each
            restaurant offers a unique culinary experience crafted with passion
            and precision.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-12 font-comfortaaRegular">
        {properties.map((property, index) => (
          <div key={index} className="mb-12">
            <Card
              className={`flex flex-col md:flex-row items-stretch ${
                index % 2 === 0 ? "" : "md:flex-row-reverse"
              }`}
            >
              <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                <Image
                  src={property.imageUrl}
                  alt={property.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={index === 0}
                />
              </div>
              <div className="w-full md:w-1/2 p-6">
                <CardHeader>
                  <CardTitle className="text-3xl font-comfortaaBold text-accent">
                    {property.title}
                    {property.subtitle && (
                      <span className="block text-lg text-muted-foreground mt-1">
                        {property.subtitle}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-muted-foreground">
                    {property.content}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="text-accent" />
                      <span>{property.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {property.hours && <Clock className="text-accent" />}
                      <span>{property?.hours}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {property.cuisine && <Utensils className="text-accent" />}
                      <span>{property?.cuisine}</span>
                    </div>
                  </div>
                  <Button
                    className="bg-primary text-white hover:bg-accent"
                    onClick={() => handleExplore(property.url)}
                    disabled={!property.url}
                  >
                    Explore {property.title}
                  </Button>
                </CardContent>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
};

export default DiningPage;

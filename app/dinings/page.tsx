import React from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Utensils } from "lucide-react";

interface Property {
  title: string;
  imageUrl: string;
  content: string;
  address: string;
  hours: string;
  cuisine: string;
}

const properties: Property[] = [
  {
    title: "Veggie Delight Varca",
    imageUrl: "/images/dining1.jpg",
    content:
      "Indulge in a culinary journey at our beautifully designed restaurant, The Veggie Delight, where every dining experience is special. Savor multi-cuisine vegetarian and non-vegetarian dishes prepared with the freshest local ingredients.",
    address: "Varca, Goa",
    hours: "11am - 10pm",
    cuisine: "Multi-Cuisine, Vegetarian",
  },
];

const DiningPage: React.FC = () => {
  return (
    <>
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-primary/90">
        <div className="absolute inset-0 bg-[url('/dining-hero.jpg')] bg-cover bg-center opacity-50" />
        <div className="relative z-20 text-white text-center px-4">
          <h1 className="font-comfortaaBold text-5xl mb-4">
            Culinary Excellence
          </h1>
          <p className="font-comfortaaLight text-xl max-w-2xl mx-auto mb-6">
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
              className={`flex flex-col md:flex-row items-center ${
                index % 2 === 0 ? "" : "md:flex-row-reverse"
              }`}
            >
              <div className="md:w-1/2">
                <Image
                  src={property.imageUrl}
                  alt={property.title}
                  width={400}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
              <div className="md:w-1/2 p-6">
                <CardHeader>
                  <CardTitle className="text-3xl font-comfortaaBold text-accent">
                    {property.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{property.content}</p>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="text-accent" />
                      <span>{property.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="text-accent" />
                      <span>{property.hours}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Utensils className="text-accent" />
                      <span>{property.cuisine}</span>
                    </div>
                  </div>
                  <Button className="bg-primary text-white hover:bg-accent">
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

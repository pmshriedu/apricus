"use client";
import React from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { MapPin, Clock, Utensils, Phone, Star, Users } from "lucide-react";

const CraftKitchenPage: React.FC = () => {
  // Featured dishes data

  // Special events data

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary bg-cover bg-center" />
        <div className="absolute" />
        <div className="relative z-20 text-white text-center px-4">
          <h1 className="font-comfortaaBold text-5xl md:text-6xl mb-4">
            Craft Kitchen and Bar
          </h1>
          <p className="font-comfortaaRegular text-xl max-w-2xl mx-auto">
            A culinary journey through Goan and international flavors
          </p>
        </div>
      </section>

      {/* Info Section */}
      <section className="container mx-auto py-12 font-comfortaaRegular">
        {/* About Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-3xl font-comfortaaBold text-accent">
              About Craft Kitchen and Bar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="mb-4 text-muted-foreground">
                  Experience culinary artistry at Craft Kitchen, where our
                  expert chefs blend local Goan flavors with international
                  cuisine. Enjoy your meal with panoramic views of the river,
                  creating an unforgettable dining experience. Our master chefs
                  combine traditional techniques with modern innovation to bring
                  you the best of both worlds.
                </p>
                <p className="mb-4 text-muted-foreground">
                  Nestled in the serene landscapes of Cavelossim in South Goa,
                  Craft Kitchen and Bar offers a refreshing escape from the
                  ordinary. Our restaurant is designed to provide a seamless
                  blend of comfort and elegance, making it the perfect setting
                  for any occasion—from intimate dinners to celebratory
                  gatherings.
                </p>
                <p className="text-muted-foreground">
                  We take pride in sourcing the freshest local ingredients,
                  supporting Goan farmers and fishermen to bring authentic
                  flavors to your plate while ensuring sustainability. Our team
                  is dedicated to providing exceptional service and creating
                  memorable experiences for all our guests.
                </p>

                <div className="mt-6 flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Utensils className="text-accent" />
                    <span>Goan, International</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="text-accent" />
                    <span>Capacity: 120 seats</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="text-accent" />
                    <span>4.8/5 Rating</span>
                  </div>
                </div>
              </div>
              <div className="relative h-64 md:h-auto min-h-72">
                <Image
                  src="/images/apricus/bar2.jpg"
                  alt="Craft Kitchen Interior"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <MapPin className="text-accent h-6 w-6" />
                <div>
                  <h3 className="font-comfortaaBold text-lg">Location</h3>
                  <p className="text-muted-foreground">Cavelossim, South Goa</p>
                  <p className="text-muted-foreground">Near River Front</p>
                </div>
              </div>
              {/* <Button className="w-full bg-primary text-white hover:bg-accent">
                Get Directions
              </Button> */}
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Clock className="text-accent h-6 w-6" />
                <div>
                  <h3 className="font-comfortaaBold text-lg">Opening Hours</h3>
                  <p className="text-muted-foreground">Daily: 7am - 2am</p>
                  <p className="text-muted-foreground">Breakfast: 7am - 11am</p>
                </div>
              </div>
              {/* <Button className="w-full bg-primary text-white hover:bg-accent">
                Reserve a Table
              </Button> */}
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Phone className="text-accent h-6 w-6" />
                <div>
                  <h3 className="font-comfortaaBold text-lg">Contact Us</h3>
                  <p className="text-muted-foreground">+91 832 555 7890</p>
                  <p className="text-muted-foreground">crs@apricushotels.com</p>
                </div>
              </div>
              {/* <Button className="w-full bg-primary text-white hover:bg-accent">
                Contact Now
              </Button> */}
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-primary text-white rounded-lg p-8 text-center">
          <h2 className="font-comfortaaBold text-3xl mb-4">
            Ready for a Culinary Adventure?
          </h2>
          <p className="font-comfortaaRegular text-lg mb-6 max-w-2xl mx-auto">
            Whether you&quot;re planning a romantic dinner, family celebration,
            or just craving exceptional food, we&quot;d love to welcome you to
            Craft Kitchen and Bar.
          </p>
          {/* <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-white text-primary hover:bg-accent hover:text-white">
              Book a Table
            </Button>
            <Button className="bg-transparent border border-white hover:bg-white hover:text-primary">
              View Full Menu
            </Button>
          </div> */}
        </div>
      </section>
    </>
  );
};

export default CraftKitchenPage;

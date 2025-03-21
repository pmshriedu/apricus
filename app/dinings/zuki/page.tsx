"use client";
import React from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { MapPin, Clock, Phone, Music, Users, Instagram } from "lucide-react";

const ZukiClubPage: React.FC = () => {
  // Upcoming events data

  // Bottle service packages

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/zuki.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <div className="relative z-20 text-white text-center px-4">
          <h1 className="font-comfortaaBold text-5xl md:text-6xl mb-4">
            ZUKI CLUB
          </h1>
          <p className="font-comfortaaRegular text-xl max-w-2xl mx-auto mb-8">
            Goa&quot;s Premier Nightlife Experience
          </p>
          {/* <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-primary text-white hover:bg-accent">
              Book a Table
            </Button>
            <Button className="bg-transparent border border-white hover:bg-white hover:text-primary">
              Upcoming Events
            </Button>
          </div> */}
        </div>
      </section>

      {/* Info Cards */}
      <section className="container mx-auto py-12 font-comfortaaRegular">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <MapPin className="text-accent h-6 w-6" />
                <div>
                  <h3 className="font-comfortaaBold text-lg">Location</h3>
                  <p className="text-muted-foreground">At Hotel Acacia</p>
                  <p className="text-muted-foreground">Candolim, Goa</p>
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
                  <h3 className="font-comfortaaBold text-lg">Club Hours</h3>
                  <p className="text-muted-foreground">Wed to Sun: 9pm - 4am</p>
                  <p className="text-muted-foreground">Mon & Tue: Closed</p>
                </div>
              </div>
              {/* <Button className="w-full bg-primary text-white hover:bg-accent">
                Plan Your Visit
              </Button> */}
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Phone className="text-accent h-6 w-6" />
                <div>
                  <h3 className="font-comfortaaBold text-lg">Contact Us</h3>
                  <p className="text-muted-foreground">+91 832 666 8888</p>
                  <p className="text-muted-foreground">crs@apricushotels.com</p>
                </div>
              </div>
              {/* <Button className="w-full bg-primary text-white hover:bg-accent">
                VIP Reservations
              </Button> */}
            </CardContent>
          </Card>
        </div>

        {/* About Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-3xl font-comfortaaBold text-accent">
              Experience ZUKI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="mb-4 text-muted-foreground">
                  Located in the heart of Candolim, ZUKI brings you an
                  unforgettable nightlife experience where the party never
                  stops! Our iconic club is designed to captivate with vibrant
                  energy, pulsating beats, and an ambiance that attracts
                  fun-lovers from all over the world.
                </p>
                <p className="mb-4 text-muted-foreground">
                  With state-of-the-art sound systems, mesmerizing light shows,
                  and a spacious dance floor, ZUKI has established itself as
                  Goa&quot;s premier nightclub destination. Our resident DJs
                  keep the energy high with the latest tracks, while
                  international guest performers regularly grace our decks.
                </p>
                <p className="text-muted-foreground">
                  Beyond the music, ZUKI offers a premium bar experience
                  featuring expertly crafted cocktails, an extensive collection
                  of spirits, and VIP bottle service. Our trained mixologists
                  are ready to surprise you with signature creations that
                  perfectly complement your night out.
                </p>

                <div className="mt-6 flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Music className="text-accent" />
                    <span>Electronic, Hip-Hop, Commercial</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="text-accent" />
                    <span>Capacity: 500 people</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Instagram className="text-accent" />
                    <span>@zukiclubgoa</span>
                  </div>
                </div>
              </div>
              <div className="relative h-64 md:h-auto min-h-72">
                <Image
                  src="/images/zuki.jpg"
                  alt="Zuki Club Interior"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <Card className="mb-12 bg-primary text-white">
          <CardHeader>
            <CardTitle className="text-3xl font-comfortaaBold text-center">
              What Clubbers Say
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur">
                <p className="italic mb-4">
                  &quot;Absolutely electric atmosphere! The DJ kept the energy
                  high all night. ZUKI is definitely the best club in North
                  Goa.&quot;
                </p>
                <p className="font-comfortaaBold">- Sarah J., London</p>
              </div>
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur">
                <p className="italic mb-4">
                  &quot;The VIP service was exceptional. Great music, excellent
                  drinks, and the staff made sure we had an amazing time. Will
                  be back!&quot;
                </p>
                <p className="font-comfortaaBold">- Raj M., Mumbai</p>
              </div>
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur">
                <p className="italic mb-4">
                  &quot;ZUKI knows how to throw a party! The sound system is
                  incredible and the crowd is always vibrant. A must-visit for
                  anyone in Goa.&quot;
                </p>
                <p className="font-comfortaaBold">- Alex P., Berlin</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="bg-primary text-white rounded-lg p-8 text-center">
          <h2 className="font-comfortaaBold text-3xl mb-4">
            Ready to Experience ZUKI?
          </h2>
          <p className="font-comfortaaRegular text-lg mb-6 max-w-2xl mx-auto">
            Join us for an unforgettable night of music, dancing, and premium
            hospitality. Skip the line with VIP reservations and bottle service.
          </p>
          {/* <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-accent text-white hover:bg-accent/80">
              Book VIP Table
            </Button>
            <Button className="bg-transparent border border-white hover:bg-white hover:text-black">
              General Admission
            </Button>
          </div> */}
        </div>
      </section>
    </>
  );
};

export default ZukiClubPage;

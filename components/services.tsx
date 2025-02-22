"use client";
import React, { useState } from "react";
import { Utensils, Snowflake, Shield, Shuffle, MapPin } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ServiceItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

interface Location {
  name: string;
  address: string;
  mapUrl: string;
}

const locations: Location[] = [
  {
    name: "Benaulim, South Goa",
    address: "Benaulim, South Goa, South Goa",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30762.631673583765!2d73.90491367910156!3d15.261699899999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfb4a7decf0acd%3A0x833284524ccf06a8!2sBenaulim%2C%20Goa!5e0!3m2!1sen!2sin!4v1682615614973!5m2!1sen!2sin",
  },
  {
    name: "Varca, Goa",
    address: "Varca, Goa",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30766.186791373787!2d73.91651362910156!3d15.230699899999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfb56cd3e0e06f%3A0x3ac7707cae6cc8e6!2sVarca%2C%20Goa!5e0!3m2!1sen!2sin!4v1682615715234!5m2!1sen!2sin",
  },
  {
    name: "Porvorim",
    address:
      "H No. 400/5, de, Alto Betim, Porvorim, Pilerne, Porvorim, Goa - 403521",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30780.956158948804!2d73.7944581!3d15.4941609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfc05487e1215b%3A0x9f5ea86ff1cd7c7e!2sPorvorim%2C%20Goa!5e0!3m2!1sen!2sin!4v1634567890123!5m2!1sen!2sin",
  },
];

const ServiceItem: React.FC<ServiceItemProps> = ({
  icon: Icon,
  title,
  description,
}) => (
  <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105">
    <CardHeader>
      <div className="flex items-center space-x-4">
        <Icon className="w-8 h-8 text-primary" />
        <h3 className="font-comfortaaBold text-xl text-primary">{title}</h3>
      </div>
    </CardHeader>
    <CardContent>
      <p className="font-comfortaaRegular text-gray-600">{description}</p>
    </CardContent>
  </Card>
);

const LocationMap: React.FC<{ location: Location }> = ({ location }) => (
  <div className="space-y-4">
    <h3 className="font-comfortaaBold text-xl text-primary">{location.name}</h3>
    <p className="font-comfortaaRegular text-sm text-gray-600">
      {location.address}
    </p>
    <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px]">
      <iframe
        src={location.mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
      ></iframe>
    </div>
  </div>
);

const ViewMap: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className=" left-0 top-[40rem] md:top-[35rem] transform -translate-y-1/2 z-50 bg-primary text-white rounded-none rounded-r-md shadow-md hover:bg-accent transition-colors duration-300"
        variant="default"
        size="icon"
      >
        <MapPin className="w-6 h-6" />
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] overflow-hidden p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 bg-primary text-white flex justify-between items-center">
              <h2 className="font-comfortaaBold text-2xl">Our Locations</h2>
            </div>
            <Tabs
              defaultValue={locations[0].name}
              className="flex-grow overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row h-full">
                <ScrollArea className="h-20 sm:h-auto sm:w-48 lg:w-64">
                  <TabsList className="h-full flex flex-row sm:flex-col items-stretch space-x-2 sm:space-x-0 sm:space-y-2 p-4 bg-gray-100">
                    {locations.map((location) => (
                      <TabsTrigger
                        key={location.name}
                        value={location.name}
                        className="w-full text-left justify-start data-[state=active]:bg-primary data-[state=active]:text-white font-comfortaaRegular"
                      >
                        {location.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </ScrollArea>
                <div className="flex-grow p-4 overflow-y-auto">
                  {locations.map((location) => (
                    <TabsContent key={location.name} value={location.name}>
                      <LocationMap location={location} />
                    </TabsContent>
                  ))}
                </div>
              </div>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const Services: React.FC = () => {
  const services = [
    {
      icon: Shuffle,
      title: "Airport Transfer",
      description:
        "Fast and convenient airport transfers to and from the hotel.",
    },
    {
      icon: Utensils,
      title: "All Inclusive",
      description: "Enjoy a fully inclusive stay with all amenities covered.",
    },
    {
      icon: Snowflake,
      title: "Air-Conditioned",
      description: "Relax in fully air-conditioned rooms and public spaces.",
    },
    {
      icon: Shield,
      title: "Under Protection",
      description:
        "Stay safe with our 24/7 security and surveillance services.",
    },
  ];

  return (
    <section className="bg-gray-100 py-16 relative">
      <ViewMap />
      <div className="container mx-auto px-4">
        <h2 className="font-comfortaaBold text-3xl text-center mb-12 text-primary">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ServiceItem key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

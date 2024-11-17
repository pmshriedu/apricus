"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sun,
  Hotel,
  Handshake,
  Trophy,
  Users,
  TrendingUp,
  CheckCircle2,
  BookOpen,
  BarChart,
  Zap,
  Settings,
} from "lucide-react";

type BusinessOpportunity = {
  title: string;
  description: string;
};
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
const PartnershipPage = () => {
  return (
    <div className="font-comfortaaRegular">
      {/* Hero Section */}
      <section className="relative min-h-[400px] lg:h-[70vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-primary  z-10" />
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center bg-no-repeat" />
        <div className="relative z-20 text-white text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <h1 className="font-comfortaaBold text-4xl sm:text-5xl lg:text-6xl mb-6 leading-tight">
            Elevate Your Hospitality Journey with Apricus Hotels
          </h1>
          <p className="font-comfortaaLight text-lg sm:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto">
            Join a legacy of excellence in hospitality management and
            franchising
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              className="font-comfortaaBold bg-white text-primary hover:bg-white hover:text-primary "
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-4 bg-primary/10 px-4 py-2 rounded-full">
            <Sun className="w-5 h-5 text-primary mr-2" />
            <span className="font-comfortaaMedium text-primary uppercase tracking-wider text-sm">
              The Apricus Experience
            </span>
          </div>
          <h2 className="font-comfortaaLight text-3xl sm:text-4xl lg:text-5xl text-gray-900 max-w-4xl mx-auto leading-tight">
            Setting New Standards in Hospitality Excellence
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[
            {
              icon: Hotel,
              title: "Premium Properties",
              description:
                "From luxury resorts to boutique hotels, our diverse portfolio caters to discerning travelers seeking exceptional experiences.",
            },
            {
              icon: Handshake,
              title: "Strategic Partnerships",
              description:
                "Leverage our expertise with flexible partnership models designed to maximize returns and ensure sustainable growth.",
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className="overflow-hidden transition-all duration-300 hover:shadow-xl group"
            >
              <CardContent className="p-8 sm:p-10">
                <feature.icon className="w-12 h-12 text-primary mb-6 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-comfortaaBold text-2xl mb-4 text-gray-900">
                  {feature.title}
                </h3>
                <p className="font-comfortaaLight text-gray-600 text-lg leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Detailed Benefits Section - New Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-comfortaaBold text-3xl sm:text-4xl text-gray-900 mb-6">
              Apricus Benefits in Nutshell
            </h2>
            <p className="font-comfortaaLight text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive advantages that set us apart in the hospitality
              industry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Users, text: "Efficient sales and marketing team" },
              {
                icon: Trophy,
                text: "Extensive experience in hotel operations",
              },
              { icon: TrendingUp, text: "Great network of suppliers" },
              {
                icon: CheckCircle2,
                text: "Adherence to established policies and procedures right from the top management",
              },
              { icon: Users, text: "Highly motivated and skilled workforce" },
              {
                icon: BookOpen,
                text: "Intense focus on customer feedback and customer satisfaction",
              },
              {
                icon: Settings,
                text: "In-house training and a well-established Human Resources division",
              },
              {
                icon: Zap,
                text: "Offering technical and pre-opening services to all the associated hotels",
              },
              {
                icon: BarChart,
                text: "Ability to adapt quickly to the changing market trends",
              },
              { icon: CheckCircle2, text: "Proven SOPs and training manuals" },
              { icon: Users, text: "Dedicated revenue management team" },
            ].map((benefit, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <benefit.icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <p className="font-comfortaaLight text-gray-700">
                  {benefit.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
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
      {/* Original Benefits Section - Now showing key highlights */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 sm:p-12 lg:p-16 bg-white shadow-lg">
            <div className="text-center mb-16">
              <h2 className="font-comfortaaBold text-3xl sm:text-4xl text-gray-900 mb-6">
                Key Partnership Highlights
              </h2>
              <p className="font-comfortaaLight text-xl text-gray-600 max-w-2xl mx-auto">
                Discover what makes Apricus Hotels the ideal partner for your
                hospitality venture
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {[
                {
                  icon: Users,
                  title: "Expert Team",
                  text: "Access our dedicated sales and marketing professionals",
                },
                {
                  icon: Trophy,
                  title: "Proven Excellence",
                  text: "Benefit from our decades of operational expertise",
                },
                {
                  icon: TrendingUp,
                  title: "Growth Focus",
                  text: "Partner with a brand committed to continuous improvement",
                },
                {
                  icon: CheckCircle2,
                  title: "Quality Assurance",
                  text: "Implement industry-leading policies and procedures",
                },
                {
                  icon: Settings,
                  title: "Operational Support",
                  text: "Leverage our technical and pre-opening services",
                },
                {
                  icon: BarChart,
                  title: "Revenue Optimization",
                  text: "Work with our dedicated revenue management team",
                },
              ].map((benefit, index) => (
                <div key={index} className="flex flex-col items-start">
                  <div className="bg-primary/10 p-3 rounded-lg mb-4">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-comfortaaBold text-xl mb-2 text-gray-900">
                    {benefit.title}
                  </h4>
                  <p className="font-comfortaaLight text-gray-600">
                    {benefit.text}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-16 sm:py-24">
        <div className="absolute inset-0 bg-primary opacity-90 z-10" />
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center bg-fixed" />
        <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-white text-center max-w-4xl mx-auto">
            <h2 className="font-comfortaaBold text-3xl sm:text-4xl lg:text-5xl mb-6 leading-tight">
              Ready to Transform Your Hospitality Vision?
            </h2>
            <p className="font-comfortaaLight text-xl sm:text-2xl mb-8">
              Partner with Apricus Hotels and be part of our growth story
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnershipPage;

"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const RefundPolicyPage = () => {
  return (
    <div className="font-comfortaaRegular">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary/90 z-10" />
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center" />
        <div className="relative z-20 text-white text-center px-4">
          <h1 className="font-comfortaaBold text-5xl mb-4">Refund Policy</h1>
          <p className="font-comfortaaLight text-xl max-w-2xl mx-auto mb-6">
            Understanding our booking and cancellation terms
          </p>
          <div className="flex justify-center space-x-2 text-sm">
            <span className="text-white/60">Home</span>
            <ArrowRight className="w-4 h-4 text-white/60" />
            <span>Refund Policy</span>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="space-y-8">
                <div>
                  <h2 className="font-comfortaaBold text-2xl mb-4">
                    Cancellation & Refund Policy
                  </h2>
                  <p className="text-gray-600">
                    At Apricus Hotels and Resorts Private Limited, we understand
                    that plans can change. Our refund policy is designed to be
                    fair and transparent while maintaining our operational
                    efficiency.
                  </p>
                </div>

                <div>
                  <h2 className="font-comfortaaBold text-2xl mb-4">
                    Standard Bookings
                  </h2>
                  <div className="space-y-4">
                    <h3 className="font-comfortaaBold text-xl">
                      Cancellation Timeline
                    </h3>
                    <ul className="list-disc pl-6 text-gray-600 space-y-2">
                      <li>
                        More than 72 hours before check-in: Full refund minus
                        processing fees
                      </li>
                      <li>48-72 hours before check-in: 75% refund</li>
                      <li>24-48 hours before check-in: 50% refund</li>
                      <li>Less than 24 hours before check-in: No refund</li>
                      <li>No-show: No refund</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h2 className="font-comfortaaBold text-2xl mb-4">
                    Special Season Bookings
                  </h2>
                  <p className="text-gray-600 mb-4">
                    During peak seasons (December 20 - January 10, and other
                    designated periods):
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>More than 7 days before check-in: 75% refund</li>
                    <li>3-7 days before check-in: 50% refund</li>
                    <li>Less than 3 days before check-in: No refund</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-comfortaaBold text-2xl mb-4">
                    Payment Processing
                  </h2>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      All payments are processed through Razorpay. Refunds will
                      be processed:
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 space-y-2">
                      <li>Within 5-7 business days for domestic payments</li>
                      <li>
                        Within 7-14 business days for international payments
                      </li>
                      <li>To the original payment method used for booking</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h2 className="font-comfortaaBold text-2xl mb-4">
                    Processing Fees
                  </h2>
                  <p className="text-gray-600">
                    A processing fee of 2% of the booking amount applies to all
                    refunds to cover payment gateway charges.
                  </p>
                </div>

                <div>
                  <h2 className="font-comfortaaBold text-2xl mb-4">
                    Force Majeure
                  </h2>
                  <p className="text-gray-600">
                    In cases of natural disasters, government restrictions, or
                    other circumstances beyond our control, we will offer:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Full refund, or</li>
                    <li>Booking modification to alternative dates</li>
                    <li>Credit for future stay valid for 12 months</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-comfortaaBold text-2xl mb-4">
                    Early Departure
                  </h2>
                  <p className="text-gray-600">
                    No refunds will be provided for early departure or unused
                    nights of confirmed bookings.
                  </p>
                </div>

                <div>
                  <h2 className="font-comfortaaBold text-2xl mb-4">
                    How to Request a Refund
                  </h2>
                  <p className="text-gray-600 mb-4">To request a refund:</p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Log into your account on our website</li>
                    <li>Navigate to your booking</li>
                    <li>Click on the &quot;Cancel Booking&quot; button</li>
                    <li>Follow the prompts to complete the cancellation</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-comfortaaBold text-2xl mb-4">
                    Contact Us
                  </h2>
                  <p className="text-gray-600">
                    For any queries regarding refunds, please contact:
                    <br />
                    Email: crs@apricushotels.com
                    <br />
                    Phone: +91 8956593946
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm">
                    Last updated: June 21, 2024
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default RefundPolicyPage;

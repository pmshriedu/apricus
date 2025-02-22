"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const TermsOfServicePage = () => {
  return (
    <div className="font-comfortaaRegular">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary/90 z-10" />
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center" />
        <div className="relative z-20 text-white text-center px-4">
          <h1 className="font-comfortaaBold text-5xl mb-4">Terms of Service</h1>
          <p className="font-comfortaaLight text-xl max-w-2xl mx-auto mb-6">
            Please read these terms carefully before using our services
          </p>
          <div className="flex justify-center space-x-2 text-sm">
            <span className="text-white/60">Home</span>
            <ArrowRight className="w-4 h-4 text-white/60" />
            <span>Terms of Service</span>
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
                    1. Agreement to Terms
                  </h2>
                  <p className="text-gray-600">
                    By accessing or using the services of Apricus Hotels and
                    Resorts Private Limited (&quot;Company,&quot;
                    &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you
                    agree to be bound by these Terms of Service. If you disagree
                    with any part of these terms, you may not access our
                    services.
                  </p>
                </div>

                <div>
                  <h2 className="font-comfortaaBold text-2xl mb-4">
                    2. Booking and Reservations
                  </h2>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      When making a reservation through our platform:
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 space-y-2">
                      <li>
                        You must be at least 18 years old to make a booking
                      </li>
                      <li>
                        You agree to provide accurate and current information
                      </li>
                      <li>
                        Reservations are subject to availability and
                        confirmation
                      </li>
                      <li>
                        You agree to pay all charges at the rates displayed plus
                        applicable taxes
                      </li>
                      <li>
                        Special requests are subject to availability and cannot
                        be guaranteed
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h2 className="font-comfortaaBold text-2xl mb-4">
                    3. Check-in and Check-out
                  </h2>
                  <div className="space-y-4">
                    <ul className="list-disc pl-6 text-gray-600 space-y-2">
                      <li>Standard check-in time is 2:00 PM local time</li>
                      <li>Standard check-out time is 11:00 AM local time</li>
                      <li>
                        Early check-in and late check-out are subject to
                        availability and additional charges
                      </li>
                      <li>
                        Valid government-issued photo identification is required
                        at check-in
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h2 className="font-comfortaaBold text-2xl mb-4">
                    4. Payment Terms
                  </h2>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      We use Razorpay as our payment processor. By making a
                      payment:
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 space-y-2">
                      <li>You authorize us to charge your payment method</li>
                      <li>
                        You confirm that you are the authorized user of the
                        payment method
                      </li>
                      <li>
                        All rates are in Indian Rupees unless otherwise
                        specified
                      </li>
                      <li>
                        Additional charges may apply for extra services or
                        amenities
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h2 className="font-comfortaaBold text-2xl mb-4">
                    5. House Rules
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Guests must comply with our house rules, including:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>
                      No smoking in non-smoking rooms (₹10,000 cleaning fee
                      applies)
                    </li>
                    <li>No unregistered guests in rooms</li>
                    <li>Quiet hours from 10:00 PM to 7:00 AM</li>
                    <li>Proper attire required in all public areas</li>
                    <li>
                      Pet policy varies by location (additional charges may
                      apply)
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-comfortaaBold text-2xl mb-4">
                    6. Liability and Damages
                  </h2>
                  <div className="space-y-4">
                    <p className="text-gray-600">Guests are responsible for:</p>
                    <ul className="list-disc pl-6 text-gray-600 space-y-2">
                      <li>Any damage to hotel property during their stay</li>
                      <li>The behavior of their accompanying guests</li>
                      <li>
                        Securing their personal belongings (hotel safe provided)
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h2 className="font-comfortaaBold text-2xl mb-4">
                    7. Intellectual Property
                  </h2>
                  <p className="text-gray-600">
                    All content on our website and mobile applications,
                    including text, graphics, logos, and images, is our property
                    and protected by copyright laws.
                  </p>
                </div>

                <div>
                  <h2 className="font-comfortaaBold text-2xl mb-4">
                    8. Prohibited Activities
                  </h2>
                  <p className="text-gray-600 mb-4">
                    The following activities are strictly prohibited:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Using our services for illegal purposes</li>
                    <li>
                      Attempting to gain unauthorized access to our systems
                    </li>
                    <li>Interfering with or disrupting our services</li>
                    <li>Reselling or transferring reservations</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-comfortaaBold text-2xl mb-4">
                    9. Force Majeure
                  </h2>
                  <p className="text-gray-600">
                    We are not liable for any failure to perform due to causes
                    beyond our reasonable control, including natural disasters,
                    acts of government, or pandemic-related restrictions.
                  </p>
                </div>

                <div>
                  <h2 className="font-comfortaaBold text-2xl mb-4">
                    10. Modifications to Terms
                  </h2>
                  <p className="text-gray-600">
                    We reserve the right to modify these terms at any time.
                    Changes will be effective immediately upon posting to our
                    website. Your continued use of our services constitutes
                    acceptance of modified terms.
                  </p>
                </div>

                <div>
                  <h2 className="font-comfortaaBold text-2xl mb-4">
                    11. Governing Law
                  </h2>
                  <p className="text-gray-600">
                    These terms are governed by the laws of India. Any disputes
                    shall be subject to the exclusive jurisdiction of the courts
                    in Mumbai, Maharashtra.
                  </p>
                </div>

                <div>
                  <h2 className="font-comfortaaBold text-2xl mb-4">
                    12. Contact Information
                  </h2>
                  <p className="text-gray-600">
                    For questions about these Terms of Service, please contact
                    us at:
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

export default TermsOfServicePage;

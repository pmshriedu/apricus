"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const PrivacyPolicyPage = () => {
  return (
    <div className="font-comfortaaRegular">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary/90 z-10" />
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center" />
        <div className="relative z-20 text-white text-center px-4">
          <h1 className="font-comfortaaBold text-5xl mb-4">Privacy Policy</h1>
          <p className="font-comfortaaLight text-xl max-w-2xl mx-auto mb-6">
            We value your privacy and are committed to protecting your personal
            information
          </p>
          <div className="flex justify-center space-x-2 text-sm">
            <span className="text-white/60">Home</span>
            <ArrowRight className="w-4 h-4 text-white/60" />
            <span>Privacy Policy</span>
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
                    Introduction
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Apricus Hotels and Resorts Private Limited (&quot;we,&quot;
                    &quot;our,&quot; or &quot;us&quot;) is committed to
                    protecting your privacy. This Privacy Policy explains how we
                    collect, use, disclose, and safeguard your information when
                    you visit our website or use our services.
                  </p>
                </div>

                <div>
                  <h2 className="font-comfortaaBold text-2xl mb-4">
                    Information We Collect
                  </h2>
                  <div className="space-y-4">
                    <h3 className="font-comfortaaBold text-xl">
                      Personal Information
                    </h3>
                    <p className="text-gray-600">
                      We collect personal information that you voluntarily
                      provide to us when you:
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 space-y-2">
                      <li>Make a reservation or booking</li>
                      <li>Create an account</li>
                      <li>Sign up for our newsletter</li>
                      <li>Contact us through our website</li>
                      <li>Participate in our loyalty program</li>
                    </ul>
                    <p className="text-gray-600">
                      This information may include your name, email address,
                      phone number, postal address, payment information, and
                      identification documents.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="font-comfortaaBold text-2xl mb-4">
                    How We Use Your Information
                  </h2>
                  <p className="text-gray-600 mb-4">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Process your reservations and payments</li>
                    <li>Communicate with you about your bookings</li>
                    <li>
                      Send you marketing communications (with your consent)
                    </li>
                    <li>Improve our services and website</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-comfortaaBold text-2xl mb-4">
                    Payment Information
                  </h2>
                  <p className="text-gray-600 mb-4">
                    We use Razorpay as our payment gateway provider. When you
                    make a payment:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Your payment data is processed directly by Razorpay</li>
                    <li>
                      We do not store your complete credit card information
                    </li>
                    <li>
                      Transactions are encrypted and secured using
                      industry-standard protocols
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-comfortaaBold text-2xl mb-4">
                    Data Security
                  </h2>
                  <p className="text-gray-600">
                    We implement appropriate technical and organizational
                    measures to protect your personal information. However, no
                    method of transmission over the Internet is 100% secure, and
                    we cannot guarantee absolute security.
                  </p>
                </div>

                <div>
                  <h2 className="font-comfortaaBold text-2xl mb-4">
                    Your Rights
                  </h2>
                  <p className="text-gray-600 mb-4">You have the right to:</p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Access your personal information</li>
                    <li>Correct inaccurate information</li>
                    <li>Request deletion of your information</li>
                    <li>Withdraw consent for marketing communications</li>
                    <li>Lodge a complaint with supervisory authorities</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-comfortaaBold text-2xl mb-4">
                    Contact Us
                  </h2>
                  <p className="text-gray-600">
                    If you have any questions about this Privacy Policy, please
                    contact us at:
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

export default PrivacyPolicyPage;

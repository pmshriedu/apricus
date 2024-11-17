"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Globe, ArrowRight } from "lucide-react";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      console.log(name, email, message);

      if (!response.ok) {
        throw new Error("Failed to submit the form");
      }

      setSubmitStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-comfortaaRegular">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary/90 z-10" />
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center" />
        <div className="relative z-20 text-white text-center px-4">
          <h1 className="font-comfortaaBold text-5xl mb-4">Contact Us</h1>
          <p className="font-comfortaaLight text-xl max-w-2xl mx-auto mb-6">
            Experience luxury and tranquility at Apricus Hotels. We&apos;re here
            to make your stay unforgettable.
          </p>
          <div className="flex justify-center space-x-2 text-sm">
            <span className="text-white/60">Home</span>
            <ArrowRight className="w-4 h-4 text-white/60" />
            <span>Contact</span>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-24 relative z-30">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-comfortaaBold text-xl mb-4">Visit Us</h3>
              <p className="text-gray-600 font-comfortaaLight">
                B3, Ground Floor, H.No. 31/N/S,
                <br />
                CD Symphony, Seraulim,
                <br />
                Colva, South Goa 403708
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-comfortaaBold text-xl mb-4">Call Us</h3>
              <p className="text-gray-600 font-comfortaaLight">
                Main: +91 8956593947
                <br />
                Reservations: 8956593946
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-comfortaaBold text-xl mb-4">Email Us</h3>
              <p className="text-gray-600 font-comfortaaLight">
                crs@apricushotels.com
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Regional Offices */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-comfortaaBold text-3xl text-center mb-12">
            Regional Offices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                city: "Mumbai",
                phone: "+91 9028062731",
                email: "rso.mumbai@apricushotels.com",
              },
              {
                city: "Goa",
                phone: "+91 8956593948",
                email: "crs@apricushotels.com",
              },
              {
                city: "Delhi",
                phone: "+91 8956593946",
                email: "rso.delhi@apricushotels.com",
              },
              {
                city: "Ahmedabad",
                phone: "+91 8956593946",
                email: "rso.ahmd@apricushotels.com",
              },
            ].map((office, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-comfortaaBold text-xl mb-4">
                    {office.city}
                  </h3>
                  <p className="font-comfortaaLight text-gray-600 mb-2">
                    {office.phone}
                  </p>
                  <p className="font-comfortaaLight text-gray-600">
                    {office.email}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="bg-primary p-8 text-white">
                <h2 className="font-comfortaaBold text-3xl mb-6">
                  Get in Touch
                </h2>
                <p className="font-comfortaaLight mb-8">
                  We&apos;d love to hear from you. Please fill out this form and
                  we&apos;ll get back to you as soon as possible.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: Phone, text: "+91 8956593946" },
                    { icon: Mail, text: "crs@apricushotels.com" },
                    { icon: Globe, text: "apricushotels.com" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <item.icon className="w-5 h-5" />
                      <span className="font-comfortaaLight">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <Input
                      type="text"
                      placeholder="Your Name"
                      className="font-comfortaaRegular"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                      type="email"
                      placeholder="Your Email"
                      className="font-comfortaaRegular"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <Textarea
                    placeholder="Your Message"
                    rows={5}
                    className="font-comfortaaRegular"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 font-comfortaaMedium"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                  {submitStatus === "success" && (
                    <p className="text-green-600 text-center">
                      Message sent successfully!
                    </p>
                  )}
                  {submitStatus === "error" && (
                    <p className="text-red-600 text-center">
                      Failed to send message. Please try again.
                    </p>
                  )}
                </form>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;

// app/maintenance.tsx
"use client";

import React, { useEffect, useState } from "react";
import { CalendarClock, Mail } from "lucide-react";

export default function MaintenancePage() {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Set the launch date to 3 days from now (changed from 7 days)
  useEffect(() => {
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 3); // Changed to 3 days

    const timer = setInterval(() => {
      const now = new Date();
      const difference = launchDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Animate background pattern
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => (prev + 0.2) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#121212] text-white overflow-hidden relative">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C68D07' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundPosition: `${offset}px ${offset}px`,
        }}
      />

      <div className="container mx-auto px-4 py-12 relative z-10 ">
        <div className="flex flex-col items-center justify-center min-h-[90vh]">
          {/* Main Content */}
          <div className="bg-black/50 backdrop-blur-lg p-8 rounded-lg border border-primary/20 w-full max-w-3xl">
            <h2 className="text-2xl md:text-4xl font-comfortaaBold text-center mb-4">
              We&apos;re Making Something
              <span className="text-primary"> Beautiful</span>
            </h2>

            <p className="text-center text-gray-300 mb-8 font-comfortaaRegular">
              Our website is currently undergoing scheduled maintenance to
              enhance your experience. We&apos;ll be back online shortly with a
              refreshed look and exciting new features.
            </p>

            {/* Countdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[
                { label: "Days", value: countdown.days },
                { label: "Hours", value: countdown.hours },
                { label: "Minutes", value: countdown.minutes },
                { label: "Seconds", value: countdown.seconds },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center bg-black/50 p-4 rounded-lg border border-primary/30"
                >
                  <span className="text-3xl md:text-4xl font-comfortaaBold text-primary">
                    {item.value.toString().padStart(2, "0")}
                  </span>
                  <span className="text-sm text-gray-400 font-comfortaaLight">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Contact Information */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-primary" />
                <span className="font-comfortaaRegular">
                  crs@apricushotel.com
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarClock size={18} className="text-primary" />
                <span className="font-comfortaaRegular">Opening Soon</span>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-8">
              <h3 className="text-center text-lg font-comfortaaMedium mb-4">
                Get notified when we&apos;re back online
              </h3>
              <form className="flex flex-col md:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow p-3 bg-black/50 border border-primary/30 rounded-lg focus:outline-none focus:border-primary transition-all"
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/80 text-white font-comfortaaBold py-3 px-6 rounded-lg transition-all"
                >
                  Notify Me
                </button>
              </form>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-gray-400 font-comfortaaLight">
            <p>
              &copy; {new Date().getFullYear()} Apricus Hotel & Resort. All
              rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

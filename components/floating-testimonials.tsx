"use client";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function FloatingTestimonialButton() {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Show toast only once when component mounts
    setShowToast(true);
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Link
        href="/testimonials"
        className="fixed left-4 bottom-4 md:left-6 md:bottom-6 z-40 group"
        aria-label="View Testimonials"
      >
        <div className="flex items-center">
          {/* The floating button */}
          <div className="bg-primary shadow-lg rounded-full p-3 md:p-4 text-white hover:bg-primary/90 transition-all duration-300 hover:scale-110">
            <div className="relative">
              <MessageCircle className="h-6 w-6 md:h-7 md:w-7" />
              {/* Animated dot for attention */}
              <span className="absolute -top-1 -right-1 h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
              </span>
            </div>
          </div>

          {/* Tooltip that appears on hover - desktop only */}
          <div className="hidden md:block absolute left-full ml-2 -translate-y-1/2 top-1/2">
            <div className="bg-white shadow-lg rounded-lg px-4 py-2 transform scale-0 group-hover:scale-100 transition-transform duration-300 origin-left">
              <p className="text-primary font-bold whitespace-nowrap">
                View Guest Stories
              </p>
            </div>
          </div>
        </div>
      </Link>

      {/* Mobile Toast Message */}
      {showToast && (
        <div className="md:hidden fixed left-4 right-4 bottom-20 z-30">
          <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-lg p-4 transform animate-fade-in-up text-center text-sm">
            <p className="text-primary">👋 Tap to read our guest stories!</p>
          </div>
        </div>
      )}
    </>
  );
}

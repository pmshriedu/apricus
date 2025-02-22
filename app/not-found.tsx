"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Home, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-comfortaaRegular px-4">
      {/* Main Content */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="relative mb-8">
          <h1 className="text-[150px] font-comfortaaBold text-primary/10 leading-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <MapPin className="w-24 h-24 text-primary animate-bounce" />
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-comfortaaBold text-gray-800 mb-4">
          Oops! Where are we?
        </h2>

        <p className="text-xl text-gray-600 mb-8 font-comfortaaLight">
          It seems we&apos;ve wandered off the map! The page you&apos;re looking
          for was moved, removed, renamed or might never have existed - much
          like that secret beach everyone talks about but no one can find.
        </p>

        {/* Helpful Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Home className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-comfortaaMedium text-lg mb-2">Return Home</h3>
            <p className="text-gray-600 font-comfortaaLight">
              Head back to our homepage for a fresh start.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <ArrowLeft className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-comfortaaMedium text-lg mb-2">Go Back</h3>
            <p className="text-gray-600 font-comfortaaLight">
              Return to the previous page you were visiting.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <Search className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-comfortaaMedium text-lg mb-2">Search</h3>
            <p className="text-gray-600 font-comfortaaLight">
              Try finding what you need using our search.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90 font-comfortaaMedium min-w-[200px]">
              <Home className="w-4 h-4 mr-2" />
              Back to Homepage
            </Button>
          </Link>

          <Button
            variant="outline"
            className="font-comfortaaMedium min-w-[200px]"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-500 font-comfortaaLight">
        <p>Need assistance? Our concierge is always here to help.</p>
        <p className="mt-2">
          Contact us at{" "}
          <a
            href="mailto:crs@apricushotels.com"
            className="text-primary hover:underline"
          >
            crs@apricushotels.com
          </a>
        </p>
      </footer>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import Adventure from "@/components/adventure";
import Experience from "@/components/experience";
import Hero from "@/components/hero";
import PlacesSlider from "@/components/placesslider";
import RoomCards from "@/components/room-cards";
import Services from "@/components/services";
import ApricusLoading from "./loading";
import EnquiryPopup from "@/components/pop-enq/pop-up";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <ApricusLoading />;
  }

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-50">
        <EnquiryPopup />
      </div>
      <main className="relative">
        <Hero />
        <Services />
        <Experience />
        <Adventure />
        <PlacesSlider />
        <RoomCards />
      </main>
    </>
  );
}

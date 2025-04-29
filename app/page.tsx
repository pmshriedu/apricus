"use client";
import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
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

  const triggerConfetti = () => {
    // Create multiple confetti bursts
    const count = 3;
    const defaults = {
      spread: 360,
      ticks: 100,
      gravity: 0.5,
      decay: 0.94,
      startVelocity: 30,
      shapes: ["star"],
      colors: ["#FFD700", "#FFA500", "#FF4500", "#FF6B6B", "#4169E1"],
    };

    function shoot() {
      confetti({
        ...defaults,
        particleCount: 40,
        scalar: 1.2,
        shapes: ["star"],
      });

      confetti({
        ...defaults,
        particleCount: 25,
        scalar: 0.75,
        shapes: ["circle"],
      });
    }

    // Trigger multiple bursts
    for (let i = 0; i < count; i++) {
      setTimeout(shoot, i * 200);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Trigger confetti after a small delay to ensure smooth transition
      setTimeout(triggerConfetti, 100);
    }, 1000);

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

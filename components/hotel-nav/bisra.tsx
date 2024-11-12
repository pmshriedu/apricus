"use client";
import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Menu, X, Home, Image, PhoneCall } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const navigationItems = [
  { title: "Home", href: "/villa/brisa-marina", icon: Home },
  { title: "Gallery", href: "/villa/brisa-marina/bm-gallery", icon: Image },
  { title: "Contact Us", href: "/contact-us", icon: PhoneCall },
];

const BMNavigation = () => {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      <Sheet open={open} onOpenChange={setOpen}>
        <TooltipProvider>
          <Tooltip open={showTooltip}>
            <TooltipTrigger asChild>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "fixed left-4 top-32 z-50 transition-all duration-300",
                    "bg-white/80 backdrop-blur-md shadow-lg hover:bg-accent/10",
                    "border border-accent/20",
                    isScrolled ? "translate-y-[-1rem]" : "",
                    "focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  )}
                >
                  <AnimatePresence mode="wait">
                    {open ? (
                      <X className="h-5 w-5 text-primary" />
                    ) : (
                      <Menu className="h-5 w-5 text-primary" />
                    )}
                  </AnimatePresence>
                </Button>
              </SheetTrigger>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-primary text-white">
              <p>Click to open Brisa Marina menu</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <SheetContent
          side="left"
          className={cn(
            "w-[300px] sm:w-[400px]",
            "bg-white/95 backdrop-blur-lg",
            "border-r border-accent/20"
          )}
        >
          <nav className="flex flex-col gap-2 pt-12">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg",
                    "font-comfortaaBold text-base transition-all duration-200",
                    "hover:bg-accent/10",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20",
                    "active:scale-98",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 hover:text-primary",
                    isActive && "relative overflow-hidden"
                  )}
                  onClick={() => setOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.title}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-0 h-full w-1 bg-primary"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-8 left-4 right-4">
            <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
              <p className="text-sm font-comfortaaRegular text-gray-600 text-center">
                Need assistance? Contact us at
                <a
                  href="tel:+1234567890"
                  className="block mt-1 text-primary hover:text-primary/80 font-comfortaaBold"
                >
                  +91 8956593946
                </a>
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default BMNavigation;

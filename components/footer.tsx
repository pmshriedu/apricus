"use client";
import React, { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Linkedin,
  ArrowRight,
  LucideIcon,
} from "lucide-react";
import { FormEvent } from "react";

// Types
interface SocialIconProps {
  Icon: LucideIcon;
  label: string;
  url: string;
}

interface SectionTitleProps {
  children: React.ReactNode;
}

interface FooterLinkProps {
  children: React.ReactNode;
  url: string;
}
interface NavigationLink {
  label: string;
  url: string;
}
// Memoized components
const SocialIcon = memo(({ Icon, label, url }: SocialIconProps) => (
  <Link
    href={url}
    aria-label={label}
    className="w-10 h-10 rounded-full bg-white flex items-center justify-center 
             hover:bg-black transition-all duration-300 group"
  >
    <Icon size={18} className="text-black group-hover:text-white" />
  </Link>
));
SocialIcon.displayName = "SocialIcon";

const FooterLink = memo(({ children, url }: FooterLinkProps) => (
  <li>
    <Link
      href={url}
      className="text-white hover:text-white transition-colors duration-300 
               flex items-center group"
    >
      <ArrowRight
        className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 
                  group-hover:ml-0 transition-all duration-300"
      />
      <span>{children}</span>
    </Link>
  </li>
));
FooterLink.displayName = "FooterLink";

const SectionTitle = memo(({ children }: SectionTitleProps) => (
  <h3 className="font-comfortaaBold text-lg mb-6 relative">
    <span className="relative z-10">{children}</span>
    <span className="absolute bottom-0 left-0 w-12 h-1 bg-primary" />
  </h3>
));
SectionTitle.displayName = "SectionTitle";

// Constants
const SOCIAL_ICONS = [
  {
    Icon: Facebook,
    label: "Facebook",
    url: "https://www.facebook.com/apricushotels/",
  },
  {
    Icon: Instagram,
    label: "Instagram",
    url: "http://www.instagram.com/apricushotels",
  },
  {
    Icon: Linkedin,
    label: "LinkedIn",
    url: "https://www.linkedin.com/company/apricus-hotels-resorts/",
  },
];

const QUICK_LINKS: NavigationLink[] = [
  { label: "Home", url: "/" },
  { label: "About Us", url: "/aboutus" },
  // { label: "Rooms", url: "/rooms" },
  { label: "Contact Us", url: "/contact-us" },
];
const EXPLORE_LINKS: NavigationLink[] = [
  // { label: "FAQ", url: "/faq" },

  { label: "Dining", url: "/dinings" },
  // { label: "Spa & Wellness", url: "/spa-wellness" },
  { label: "Events", url: "/events" },
  { label: "Partner With Us", url: "/partner-with-us" },
];
const INSTAGRAM_IMAGES: string[] = [
  "/images/roomone.jpg",
  "/images/roomtwo.jpg",
  "/images/swim.jpg",
  "/images/propone.jpg",
  "/images/proptwo.jpg",
  "/images/dine.jpg",
];

const FOOTER_POLICIES = [
  { name: "Privacy Policy", url: "/privacy-policies" },
  { name: "Terms of Service", url: "/terms" },
  { name: "Refund Policy", url: "/refund-policies" },
];

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add newsletter submission logic here
  };

  return (
    <footer className="bg-primary text-white font-comfortaaRegular">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="block">
              <Image
                src="/logo-white.png"
                alt="Apricus Hotels"
                width={250}
                height={150}
                className="object-contain"
                priority
                loading="eager"
              />
            </Link>
            <p className="font-comfortaaLight text-white leading-relaxed">
              Experience luxury redefined at Apricus, where every moment is
              crafted to perfection. Immerse yourself in unparalleled comfort
              and hospitality.
            </p>
            <div className="flex space-x-4 ">
              {SOCIAL_ICONS.map((social, index) => (
                <SocialIcon
                  key={index}
                  Icon={social.Icon}
                  label={social.label}
                  url={social.url}
                />
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <SectionTitle>Quick Links</SectionTitle>
            <ul className="space-y-3 font-comfortaaLight">
              {QUICK_LINKS.map((item) => (
                <FooterLink key={item.label} url={item.url}>
                  {item.label}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <SectionTitle>Explore</SectionTitle>
            <ul className="space-y-3 font-comfortaaLight">
              {EXPLORE_LINKS.map((item) => (
                <FooterLink key={item.label} url={item.url}>
                  {item.label}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Instagram Feed */}
          <div>
            <SectionTitle>Instagram</SectionTitle>
            <div className="grid grid-cols-3 gap-2">
              {INSTAGRAM_IMAGES.map((src, index) => (
                <Link
                  key={index}
                  href="#"
                  className="group block relative aspect-square overflow-hidden rounded-md"
                >
                  <Image
                    src={src}
                    alt={`Instagram ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 33vw, 20vw"
                    className="transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 
                                transition-opacity duration-300"
                  />
                  <Instagram
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                             w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="md:w-1/2">
              <h4 className="font-comfortaaBold text-lg mb-2">
                Subscribe to Our Newsletter
              </h4>
              <p className="font-comfortaaLight text-white">
                Stay updated with our latest offers and experiences.
              </p>
            </div>
            <form
              onSubmit={handleNewsletterSubmit}
              className="md:w-1/2 flex gap-4"
            >
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-2 bg-white text-black font-comfortaaRegular rounded-md focus:outline-none 
                         focus:ring-2 focus:ring-primary "
                required
              />
              <button
                type="submit"
                className="px-6 py-2 bg-white hover:bg-black hover:text-white  text-black rounded-md transition-colors 
                         duration-300 font-comfortaaMedium"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-comfortaaLight text-white text-sm text-center md:text-left">
              &copy; {currentYear} Apricus Hotels. All Rights Reserved.
            </p>
            <ul className="flex flex-wrap justify-center gap-6 font-comfortaaLight text-sm">
              {FOOTER_POLICIES.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.url}
                    className="text-white hover:text-white transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);

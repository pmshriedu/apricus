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
  MapPin,
} from "lucide-react";
import { FormEvent } from "react";

// Keep existing interfaces...
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

// Enhanced memoized components with improved styling
const SocialIcon = memo(({ Icon, label, url }: SocialIconProps) => (
  <Link
    href={url}
    aria-label={label}
    className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center 
             hover:bg-white transition-all duration-300 group"
  >
    <Icon size={20} className="text-white group-hover:text-primary" />
  </Link>
));
SocialIcon.displayName = "SocialIcon";

const FooterLink = memo(({ children, url }: FooterLinkProps) => (
  <li>
    <Link
      href={url}
      className="text-white/80 hover:text-white transition-colors duration-300 
               flex items-center group text-sm"
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
  <h3 className="font-comfortaaBold text-lg mb-8 relative inline-block">
    <span className="relative z-10">{children}</span>
    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white/20" />
    <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-white" />
  </h3>
));
SectionTitle.displayName = "SectionTitle";

// Keep existing constants...
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

const QUICK_LINKS = [
  { label: "Home", url: "/" },
  { label: "About Us", url: "/aboutus" },
  { label: "Contact Us", url: "/contact-us" },
];

const EXPLORE_LINKS = [
  { label: "Dining", url: "/dinings" },
  { label: "Events", url: "/events" },
  { label: "Partner With Us", url: "/partner-with-us" },
];

const INSTAGRAM_IMAGES = [
  "/images/roomone.jpg",
  "/images/roomtwo.jpg",
  "/images/swim.jpg",
  "/images/propone.jpg",
  "/images/proptwo.jpg",
  "/images/dine.jpg",
];

const FOOTER_POLICIES = [
  { label: "Privacy Policy", url: "/privacy-policies" },
  { label: "Terms of Service", url: "/terms" },
  { label: "Refund Policy", url: "/refund-policies" },
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
        <div className="py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-12 gap-y-16">
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-8">
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
            <p className="font-comfortaaLight text-white/80 leading-relaxed text-sm">
              Experience luxury redefined at Apricus, where every moment is
              crafted to perfection. Immerse yourself in unparalleled comfort
              and hospitality.
            </p>
            <div className="bg-white/5 rounded-xl p-6 space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0 text-white/60" />
                <div className="font-comfortaaLight text-sm text-white/80 space-y-1">
                  <p>Apricus Hotels Private Limited</p>
                  <p>B3, Ground Floor, H.No. 31/N/S,</p>
                  <p>CD Symphony, Seraulim,</p>

                  <p>Colva, South Goa 403708</p>
                </div>
              </div>
              <div className="pt-2 border-t border-white/10">
                <p className="font-comfortaaLight text-sm text-white/60">
                  CIN: <span className="text-white">U55101GA2023PTC016038</span>
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
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
          <div className="lg:col-span-2">
            <SectionTitle>Quick Links</SectionTitle>
            <ul className="space-y-4 font-comfortaaLight">
              {QUICK_LINKS.map((item) => (
                <FooterLink key={item.label} url={item.url}>
                  {item.label}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2">
            <SectionTitle>Explore</SectionTitle>
            <ul className="space-y-4 font-comfortaaLight">
              {EXPLORE_LINKS.map((item) => (
                <FooterLink key={item.label} url={item.url}>
                  {item.label}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Instagram Feed */}
          <div className="lg:col-span-4">
            <SectionTitle>Instagram</SectionTitle>
            <div className="grid grid-cols-3 gap-3">
              {INSTAGRAM_IMAGES.map((src, index) => (
                <Link
                  key={index}
                  href="#"
                  className="group block relative aspect-square overflow-hidden rounded-lg"
                >
                  <Image
                    src={src}
                    alt={`Instagram ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 33vw, 20vw"
                    className="transition-transform duration-500 group-hover:scale-110 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Instagram className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-10 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="md:w-1/2">
              <h4 className="font-comfortaaBold text-xl mb-3">
                Subscribe to Our Newsletter
              </h4>
              <p className="font-comfortaaLight text-white/80 text-sm">
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
                className="flex-grow px-6 py-3 bg-white/5 text-white placeholder:text-white/40 
                         font-comfortaaLight text-sm rounded-lg border border-white/10 
                         focus:outline-none focus:border-white/30 transition-colors"
                required
              />
              <button
                type="submit"
                className="px-8 py-3 bg-white text-primary hover:bg-white/90 
                         rounded-lg transition-colors duration-300 font-comfortaaMedium text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="font-comfortaaLight text-white/60 text-sm text-center md:text-left">
              &copy; {currentYear} Apricus Hotels. All Rights Reserved.
            </p>
            <ul className="flex flex-wrap justify-center gap-8 font-comfortaaLight text-sm">
              {FOOTER_POLICIES.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.url}
                    className="text-white/60 hover:text-white transition-colors duration-300"
                  >
                    {item.label}
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

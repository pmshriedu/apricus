"use client";
import React, { useState, useCallback, useEffect, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { IoLogoFacebook, IoLogoLinkedin, IoLogoWhatsapp } from "react-icons/io";
import { AiFillInstagram } from "react-icons/ai";
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  Mail,
  Home,
  Info,
  Handshake,
  Contact,
  Calendar,
  UtensilsCrossed,
  MapPin,
  Building,
  Home as Villa,
} from "lucide-react";

type NavItem = {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  subItems?: { label: string; href: string }[];
};

type DropdownMenuProps = {
  isOpen: boolean;
  items: readonly { label: string; href: string }[];
  onClose: () => void;
  currentPath: string;
};

// Reorganized navigation items
const standardNavItems: NavItem[] = [
  { label: "Home", href: "/", icon: <Home className="w-4 h-4" /> },
  {
    label: "Locations",
    icon: <MapPin className="w-4 h-4" />,
    subItems: [
      { label: "Benaulim South Goa", href: "/locations/benaulim-south-goa" },
      { label: "Cavelossim South Goa", href: "/locations/cavelossim" },
      { label: "Varca ", href: "/locations/varca" },
      { label: "Porvorim", href: "/locations/porvorim" },
      { label: "Mussoorie", href: "/locations/mussoorie" },
      { label: "Rishikesh", href: "/locations/rishikesh" },
    ],
  },
  {
    label: "Hotels",
    icon: <Building className="w-4 h-4" />,
    subItems: [
      { label: "Apricus Inn Riverside", href: "/apricus-inn" },
      { label: "Apricus VP residency", href: "/vp-residency" },
      { label: "Bliss Ganga", href: "/bliss-ganga" },
      { label: "Shivalik Hills Mussoorie", href: "/shivalik-hills-mussoorie" },
      { label: "The Centre Court", href: "/the-center-court" },
    ],
  },
  {
    label: "Villa/Homes",
    icon: <Villa className="w-4 h-4" />,
    subItems: [
      { label: "Apricus Villa Brisa Marina", href: "/villa/brisa-marina" },
    ],
  },
  {
    label: "Clubs/Dining",
    href: "/dinings",
    icon: <UtensilsCrossed className="w-4 h-4" />,
  },
  {
    label: "Events",
    href: "/events",
    icon: <Calendar className="w-4 h-4" />,
  },
  {
    label: "About Us",
    href: "/aboutus",
    icon: <Info className="w-4 h-4" />,
  },
  {
    label: "Partner with Us",
    href: "/partner-with-us",
    icon: <Handshake className="w-4 h-4" />,
  },
  {
    label: "Contact",
    href: "/contact-us",
    icon: <Contact className="w-4 h-4" />,
  },
];

const phoneNumber = "+918956593946";
const email = "crs@apricushotels.com";

const ContactHeader = memo(() => (
  <div className="bg-gradient-to-r font-comfortaaBold from-primary/80 to-primary/80 text-white py-2 shadow-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Mobile Layout */}
      <div className="sm:hidden">
        {/* Contact Info for Mobile */}
        <div className="flex justify-between items-center mb-2">
          <a
            href={`tel:${phoneNumber}`}
            className="flex items-center text-xs hover:text-white/90 transition-colors"
          >
            <Phone className="w-3 h-3 mr-1" />
            <span>+91 {phoneNumber}</span>
          </a>

          <div className="flex gap-3">
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="http://www.instagram.com/apricushotels"
              target="_blank"
              rel="noopener noreferrer"
            >
              <AiFillInstagram className="w-4 h-4" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="https://www.linkedin.com/company/apricus-hotels-resorts/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IoLogoLinkedin className="w-4 h-4" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="https://www.facebook.com/apricushotels/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IoLogoFacebook className="w-4 h-4" />
            </motion.a>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <a
            href={`mailto:${email}`}
            className="flex items-center text-xs hover:text-white/90 transition-colors"
          >
            <Mail className="w-3 h-3 mr-1" />
            <span>{email}</span>
          </a>

          <a
            href={`https://wa.me/${phoneNumber}`}
            className="flex items-center text-xs hover:text-white/90 transition-colors"
          >
            <IoLogoWhatsapp className="w-3 h-3 mr-1" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex sm:justify-between sm:items-center">
        <div className="flex gap-6">
          <div className="flex items-center hover:text-white/90 transition-colors">
            <Phone className="w-4 h-4 mr-2" />
            <span className="font-semibold mr-1">Call Us:</span>
            <a href={`tel:${phoneNumber}`}>+91 {phoneNumber}</a>
          </div>

          <div className="flex items-center hover:text-white/90 transition-colors">
            <Mail className="w-4 h-4 mr-2" />
            <span className="font-semibold mr-1">Email Us:</span>
            <a href={`mailto:${email}`}>{email}</a>
          </div>

          <div className="flex items-center hover:text-white/90 transition-colors">
            <IoLogoWhatsapp className="w-4 h-4 mr-2" />
            <a href={`https://wa.me/${phoneNumber}`}>WhatsApp Us</a>
          </div>
        </div>

        <div className="flex gap-4">
          <motion.a
            whileHover={{ scale: 1.05 }}
            href="http://www.instagram.com/apricushotels"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/90 transition-colors"
          >
            <AiFillInstagram className="w-5 h-5" />
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.05 }}
            href="https://www.linkedin.com/company/apricus-hotels-resorts/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/90 transition-colors"
          >
            <IoLogoLinkedin className="w-5 h-5" />
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.05 }}
            href="https://www.facebook.com/apricushotels/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/90 transition-colors"
          >
            <IoLogoFacebook className="w-5 h-5" />
          </motion.a>
        </div>
      </div>
    </div>
  </div>
));

ContactHeader.displayName = "ContactHeader";

const DropdownMenu = memo(
  ({ isOpen, items, onClose, currentPath }: DropdownMenuProps) => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute font-comfortaaBold top-full left-0 w-64 bg-white shadow-lg rounded-md overflow-hidden z-50"
        >
          {items.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.label}
                href={item.href || "#"}
                className={`block px-4 py-2 text-sm ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-gray-700 hover:bg-primary hover:text-white"
                } transition-colors`}
                onClick={onClose}
              >
                {item.label}
              </Link>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  )
);

DropdownMenu.displayName = "DropdownMenu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setScrolled(window.scrollY > 0);
      }, 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const handleMenuToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleDropdownEnter = useCallback((category: string) => {
    setActiveDropdown(category);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    setActiveDropdown(null);
  }, []);

  const navClasses = `bg-white transition-all duration-300 ${
    scrolled ? "shadow-md" : ""
  }`;

  return (
    <>
      <ContactHeader />
      <header className="sticky top-0 z-50">
        <nav className={navClasses}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Desktop Navigation */}
              <div className="hidden lg:flex w-full items-center justify-between">
                {/* Logo */}
                <div className="w-[200px]">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex-shrink-0 flex justify-center items-center mb-2 mt-2"
                  >
                    <Link href="/">
                      <Image
                        src="/logo-gold.png"
                        alt="apricus-logo"
                        width={130}
                        height={130}
                        priority
                      />
                    </Link>
                  </motion.div>
                </div>

                {/* Navigation Links - Centered */}
                <div className="flex items-center justify-center flex-1 px-8">
                  <div className="flex items-center space-x-1 font-comfortaaBold">
                    {standardNavItems.map((item) => {
                      const isActive = pathname === item.href;

                      if (item.subItems) {
                        return (
                          <div
                            key={item.label}
                            className="relative"
                            onMouseEnter={() => handleDropdownEnter(item.label)}
                            onMouseLeave={handleDropdownLeave}
                          >
                            <button className="flex items-center space-x-1 text-gray-800 hover:text-primary px-2 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap">
                              {item.icon}
                              <span className="ml-1">{item.label}</span>
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            <DropdownMenu
                              isOpen={activeDropdown === item.label}
                              items={item.subItems}
                              onClose={handleDropdownLeave}
                              currentPath={pathname}
                            />
                          </div>
                        );
                      }

                      return (
                        <Link
                          key={item.label}
                          href={item.href || "#"}
                          className={`flex items-center space-x-1 px-2 py-2 rounded-md text-sm font-comfortaaBold transition-colors whitespace-nowrap ${
                            isActive
                              ? "text-primary bg-primary/10"
                              : "text-gray-800 hover:text-primary"
                          }`}
                        >
                          {item.icon}
                          <span className="ml-1">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Book Now Button */}
              </div>

              {/* Mobile menu button */}
              <div className="lg:hidden flex justify-between w-full items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex-shrink-0 mb-2 mt-2"
                >
                  <Link href="/">
                    <Image
                      src="/logo.png"
                      alt="apricus-logo"
                      width={110}
                      height={110}
                      priority
                    />
                  </Link>
                </motion.div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMenuToggle}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-primary focus:outline-none"
                >
                  {isOpen ? (
                    <X className="block h-6 w-6" />
                  ) : (
                    <Menu className="block h-6 w-6" />
                  )}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden bg-white border-t"
              >
                <div className="px-2 pt-2 pb-3 font-comfortaaBold space-y-1">
                  {standardNavItems.map((item) => {
                    if (item.subItems) {
                      return (
                        <div key={item.label}>
                          <button
                            onClick={() =>
                              setActiveDropdown(
                                activeDropdown === item.label
                                  ? null
                                  : item.label
                              )
                            }
                            className="w-full flex items-center space-x-2 text-gray-800 hover:text-primary px-3 py-2 rounded-md text-base font-medium"
                          >
                            {item.icon}
                            <span>{item.label}</span>
                            <ChevronDown
                              className={`w-4 h-4 transform transition-transform ${
                                activeDropdown === item.label
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </button>
                          <AnimatePresence>
                            {activeDropdown === item.label && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="pl-6"
                              >
                                {item.subItems.map((subItem) => {
                                  const isActive = pathname === subItem.href;
                                  return (
                                    <Link
                                      key={subItem.label}
                                      href={subItem.href}
                                      className={`block px-3 py-2 text-sm ${
                                        isActive
                                          ? "text-primary font-medium"
                                          : "text-gray-600 hover:text-primary"
                                      }`}
                                      onClick={() => {
                                        setActiveDropdown(null);
                                        setIsOpen(false);
                                      }}
                                    >
                                      {subItem.label}
                                    </Link>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    }

                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.label}
                        href={item.href || "#"}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                          isActive
                            ? "text-primary bg-primary/10"
                            : "text-gray-800 hover:text-primary"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>
    </>
  );
};

export default Navbar;

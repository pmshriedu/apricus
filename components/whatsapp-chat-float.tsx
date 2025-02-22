"use client";

import { useState, useEffect } from "react";

export default function FloatingWhatsAppButton() {
  const [showToast, setShowToast] = useState(false);
  const phoneNumber = "+918956593946";
  const whatsappMessage = encodeURIComponent(
    "Hi, I would like to know more about Apricus Hotels."
  );

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
      <a
        href={`https://wa.me/${phoneNumber}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-40 group"
        aria-label="Chat on WhatsApp"
      >
        <div className="flex items-center justify-end">
          {/* Tooltip that appears on hover - desktop only */}
          <div className="hidden md:block absolute right-full mr-2 -translate-y-1/2 top-1/2">
            <div className="bg-white shadow-lg rounded-lg px-4 py-2 transform scale-0 group-hover:scale-100 transition-transform duration-300 origin-right">
              <p className="text-[#25D366] font-bold whitespace-nowrap">
                Chat with us on WhatsApp
              </p>
            </div>
          </div>

          {/* The floating button */}
          <div className="bg-[#25D366] shadow-lg rounded-full p-3 md:p-4 text-white hover:bg-[#22c55e] transition-all duration-300 hover:scale-110">
            <div className="relative">
              {/* WhatsApp SVG Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 md:h-7 md:w-7"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>

              {/* Animated dot for attention */}
              <span className="absolute -top-1 -right-1 h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
            </div>
          </div>
        </div>
      </a>

      {/* Mobile Toast Message */}
      {showToast && (
        <div className="md:hidden fixed left-4 right-4 bottom-20 z-30">
          <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-lg p-4 transform animate-fade-in-up text-center text-sm">
            <p className="text-[#25D366]">
              💬 Tap to chat with us on WhatsApp!
            </p>
          </div>
        </div>
      )}
    </>
  );
}

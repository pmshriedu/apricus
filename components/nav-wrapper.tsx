"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import FloatingTestimonialButton from "./floating-testimonials";
import FloatingWhatsAppButton from "./whatsapp-chat-float";

export default function NavigationWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSidebarPage = pathname.startsWith("/apricus-admin");

  return (
    <>
      {!isSidebarPage && <Navbar />}
      {children}
      {!isSidebarPage && <FloatingTestimonialButton />}
      {!isSidebarPage && <FloatingWhatsAppButton />}
      {!isSidebarPage && <Footer />}
    </>
  );
}

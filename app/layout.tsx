import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NavigationWrapper from "@/components/nav-wrapper";
import { Providers } from "@/components/providers/providers";
import { Toaster } from "@/components/ui/toaster";

const comfortaaBold = localFont({
  src: "./fonts/Comfortaa-Bold.ttf",
  variable: "--font-comfortaa-bold",
  weight: "600",
});

const comfortaaRegular = localFont({
  src: "./fonts/Comfortaa-Regular.ttf",
  variable: "--font-comfortaa-regular",
});

const comfortaaMedium = localFont({
  src: "./fonts/Comfortaa-Medium.ttf",
  variable: "--font-comfortaa-medium",
});

const comfortaaLight = localFont({
  src: "./fonts/Comfortaa-Light.ttf",
  variable: "--font-comfortaa-light",
});

const lucidaUnicodeCalligraphy = localFont({
  src: "./fonts/LucidaUnicodeCalligraphy.ttf",
  variable: "--font-lucidaunicodecalligraphy-reg",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://apricushotels.com"),
  title: {
    default: "Apricus Resort | Luxury Stay & Adventure Experience",
    template: "%s | Apricus Resort",
  },
  description:
    "Experience luxury accommodations, thrilling adventures, and world-class services at Apricus Resort. Book your perfect getaway with stunning views and premium amenities.",
  keywords: [
    "Apricus Resort",
    "Apricus Hotel",
    "luxury hotel",
    "luxury resort",
    "adventure resort",
    "premium accommodations",
    "executive rooms",
    "premium rooms",
    "hotel booking ",
    "goa hotel booking",
    "hotels in goa",
    "goa hotels",
    "south goa hotels",
    "goa adventure",
    "goa stays",
    "resort booking",
    "apricus",
    "hotel apricus",
    "hotel apricus inn",
    "bliss ganga",
    "shivalik hills",
    "the center court",
    "vp residency",
    "raj samudra hotel",
    "cavelossim hotel",
    "mussoorie",
    "porvorim",
    "varca",
    "benaulim south goa",
    "benaulim",
    "rishikesh",
    "dinings",
    "apricus dining",
    "apricus villa",
    "vacation stays",
    "luxury rooms",
  ],
  openGraph: {
    title: "Apricus Hotel & Resort | Luxury Stay & Adventure Experience",
    description:
      "Discover luxury accommodations and adventure experiences at Apricus Hotel & Resort",
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Apricus Hotel & Resort",
    images: [
      {
        url: "/images/preview.png",
        width: 1200,
        height: 630,
        alt: "Apricus Resort Overview",
      },
    ],
  },

  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "travel, hotels , apricus ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="touch-manipulation">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body
        className={`${comfortaaBold.variable} ${comfortaaRegular.variable} ${comfortaaLight.variable} ${comfortaaMedium.variable} ${lucidaUnicodeCalligraphy.variable} antialiased overflow-x-hidden min-h-screen w-full`}
      >
        <Providers>
          <NavigationWrapper>{children}</NavigationWrapper>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

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
  title: "Apricus - Hotels and Resorts",
  description: "Hotels and Resorts",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
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

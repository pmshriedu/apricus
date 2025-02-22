// lib/hotels.ts
import { prisma } from "./prisma";
import { notFound } from "next/navigation";

export async function getHotelsByLocation(slug: string) {
  try {
    const location = await prisma.location.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!location) {
      notFound();
    }

    const hotels = await prisma.hotel.findMany({
      where: {
        locationId: location.id,
      },
      include: {
        images: {
          select: {
            id: true,
            url: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!hotels.length) {
      return [];
    }

    return hotels;
  } catch (error) {
    console.error("Error fetching hotels:", error);
    throw new Error("Failed to fetch hotels");
  }
}

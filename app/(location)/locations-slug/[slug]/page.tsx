// app/(location)/locations-slug/[slug]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import HotelList from "@/components/hotels/hotel-list";

interface LocationPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    checkIn?: string;
    checkOut?: string;
    adults?: string;
    childrens?: string;
  };
}

export default async function LocationPage({
  params,
  searchParams,
}: LocationPageProps) {
  const location = await prisma.location.findUnique({
    where: { slug: params.slug },
    include: {
      hotels: {
        include: {
          images: true,
          location: {
            select: {
              slug: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!location) {
    notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-comfortaaBold text-primary mb-6">
          Hotels in {location.name}
        </h1>
        <HotelList hotels={location.hotels} searchParams={searchParams} />
      </div>
    </div>
  );
}

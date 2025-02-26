import HotelCard from "./hotel-cards";

// Define types to match the HotelCard component's expectations
interface HotelImage {
  url: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  hotelId?: string;
}

interface HotelLocation {
  slug: string;
  name: string;
}

interface Hotel {
  id: string;
  name: string;
  description: string | null;
  locationId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  images: HotelImage[];
  location: HotelLocation;
}

interface HotelListProps {
  hotels: Hotel[];
  searchParams?: {
    checkIn?: string;
    checkOut?: string;
    adults?: string;
    childrens?: string;
  };
}

export default function HotelList({ hotels, searchParams }: HotelListProps) {
  if (hotels.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-comfortaaMedium text-gray-600">
          No hotels available in this location.
        </h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {hotels.map((hotel) => (
        <HotelCard
          key={hotel.id}
          hotel={{
            id: hotel.id,
            name: hotel.name,
            description: hotel.description || "", // Handle null description
            images: hotel.images,
            location: hotel.location,
          }}
          searchParams={searchParams}
        />
      ))}
    </div>
  );
}

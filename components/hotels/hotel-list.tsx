import HotelCard from "./hotel-cards";

// components/hotels/hotel-list.tsx
interface HotelListProps {
  hotels: any[];
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
        <HotelCard key={hotel.id} hotel={hotel} searchParams={searchParams} />
      ))}
    </div>
  );
}

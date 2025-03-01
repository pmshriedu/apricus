"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  format,
  addDays,
  eachDayOfInterval,
  parseISO,
  differenceInDays,
} from "date-fns";
import { DatePicker } from "../date-picker";

// Interfaces
interface Room {
  id: string;
  name: string;
  hotelId: string;
  capacity: number;
}

interface RoomBooking {
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
}

interface Booking {
  id: string;
  fullName: string;
  email: string;
  phoneNo: string;
  checkIn: string;
  checkOut: string;
  status: string;
  hotelName: string;
  locationName: string;
  rooms: RoomBooking[];
}

interface CalendarData {
  bookings: Booking[];
  rooms: Room[];
}

interface Hotel {
  id: string;
  name: string;
  locationId?: string;
  locationName?: string;
}

interface Location {
  id: string;
  name: string;
  slug?: string;
  hotelCount?: number;
}

interface BookingDisplayData {
  id: string;
  fullName: string;
  status: string;
  hotelName: string;
}

interface BookingDisplayInfo {
  booking: BookingDisplayData | null;
  daysCount: number;
}

// Group rooms by hotel and type
interface RoomGrouping {
  [hotelName: string]: {
    [roomType: string]: Room[];
  };
}

const BookingCalendar = () => {
  const searchParams = useSearchParams();
  const calendarRef = useRef<HTMLDivElement>(null);

  // Initialize state with URL parameters if available
  const initialStartDate = searchParams.get("startDate")
    ? parseISO(searchParams.get("startDate") as string)
    : new Date();

  const initialEndDate = searchParams.get("endDate")
    ? parseISO(searchParams.get("endDate") as string)
    : addDays(new Date(), 14);

  // States
  const [startDate, setStartDate] = useState<Date>(initialStartDate);
  const [endDate, setEndDate] = useState<Date>(initialEndDate);
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<string>(
    searchParams.get("hotelId") || "all"
  );
  const [selectedLocation, setSelectedLocation] = useState<string>(
    searchParams.get("locationId") || "all"
  );
  const [roomGroups, setRoomGroups] = useState<RoomGrouping>({});
  const [columnWidths, setColumnWidths] = useState<number[]>([]);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Generate dates array for the calendar
  const dates = eachDayOfInterval({ start: startDate, end: endDate });

  // A function to set fixed column widths
  const calculateColumnWidths = () => {
    if (!calendarRef.current) return;

    const firstColumnWidth = 220; // Width of the first column
    const dateColumnWidth = 80; // Fixed width for date columns

    const widths = [firstColumnWidth];

    // Remaining columns (date columns) all get equal fixed width
    for (let i = 0; i < dates.length; i++) {
      widths.push(dateColumnWidth);
    }

    setColumnWidths(widths);
  };

  // Recalculate column widths on window resize
  useEffect(() => {
    const handleResize = () => {
      calculateColumnWidths();
    };

    window.addEventListener("resize", handleResize);
    calculateColumnWidths();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dates.length, calendarRef.current]);

  // Fetch hotels and locations
  useEffect(() => {
    const fetchHotelsAndLocations = async () => {
      try {
        // Fetch hotels
        const hotelResponse = await fetch("/api/calendar-bookings/hotels");
        if (!hotelResponse.ok) {
          throw new Error(`HTTP error! Status: ${hotelResponse.status}`);
        }
        const hotelData = await hotelResponse.json();

        // Fetch locations
        const locationResponse = await fetch(
          "/api/calendar-bookings/locations"
        );
        if (!locationResponse.ok) {
          throw new Error(`HTTP error! Status: ${locationResponse.status}`);
        }
        const locationData = await locationResponse.json();

        setHotels(hotelData.data || []);
        setLocations(locationData.data || []);
      } catch (error) {
        console.error("Error fetching hotels and locations:", error);
      }
    };

    fetchHotelsAndLocations();
  }, []);

  // Filter hotels when location changes
  useEffect(() => {
    if (selectedLocation !== "all") {
      // If a location is selected, update hotel dropdown if hotel is not in this location
      const hotelInSelectedLocation = hotels.some(
        (hotel) =>
          hotel.id === selectedHotel && hotel.locationId === selectedLocation
      );

      if (!hotelInSelectedLocation && selectedHotel !== "all") {
        setSelectedHotel("all");
      }
    }
  }, [selectedLocation, hotels, selectedHotel]);

  // Fetch booking data
  useEffect(() => {
    const fetchBookingData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();

        if (selectedHotel && selectedHotel !== "all")
          params.append("hotelId", selectedHotel);
        if (selectedLocation && selectedLocation !== "all")
          params.append("locationId", selectedLocation);
        params.append("startDate", format(startDate, "yyyy-MM-dd"));
        params.append("endDate", format(endDate, "yyyy-MM-dd"));

        const response = await fetch(
          `/api/calendar-bookings?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setCalendarData(data.data);

          // Group rooms by hotel and room type
          if (data.data.rooms && data.data.rooms.length > 0) {
            const groups: RoomGrouping = {};

            // Find hotel names for each room using the hotels state
            data.data.rooms.forEach((room: Room) => {
              const hotel = hotels.find((h) => h.id === room.hotelId);
              const hotelName = hotel ? hotel.name : "Unknown Hotel";

              // Extract room type from name (assuming format like "Room Number-101")
              const roomParts = room.name.split("-");
              const roomType =
                roomParts.length > 1 ? roomParts[0].trim() : "Other Rooms";

              if (!groups[hotelName]) {
                groups[hotelName] = {};
              }

              if (!groups[hotelName][roomType]) {
                groups[hotelName][roomType] = [];
              }

              groups[hotelName][roomType].push(room);
            });

            // Sort room types and rooms within each hotel
            Object.keys(groups).forEach((hotelName) => {
              // Sort room types
              const sortedRoomTypes = Object.keys(groups[hotelName]).sort();
              const sortedRoomTypeObj: { [key: string]: Room[] } = {};

              sortedRoomTypes.forEach((roomType) => {
                // Sort rooms within each type
                sortedRoomTypeObj[roomType] = groups[hotelName][roomType].sort(
                  (a, b) => {
                    return a.name.localeCompare(b.name, undefined, {
                      numeric: true,
                      sensitivity: "base",
                    });
                  }
                );
              });

              groups[hotelName] = sortedRoomTypeObj;
            });

            setRoomGroups(groups);
          } else {
            setRoomGroups({});
          }

          // Set initialized to true after first load
          if (!isInitialized) {
            setIsInitialized(true);
            calculateColumnWidths();
          }
        } else {
          console.error(
            "API returned an error:",
            data.message || "Unknown error"
          );
        }
      } catch (error) {
        console.error("Error fetching booking data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have valid dates
    if (startDate && endDate && startDate <= endDate) {
      fetchBookingData();

      // Update URL without redirecting
      const params = new URLSearchParams(window.location.search);
      if (selectedHotel && selectedHotel !== "all")
        params.set("hotelId", selectedHotel);
      else params.delete("hotelId");

      if (selectedLocation && selectedLocation !== "all")
        params.set("locationId", selectedLocation);
      else params.delete("locationId");

      params.set("startDate", format(startDate, "yyyy-MM-dd"));
      params.set("endDate", format(endDate, "yyyy-MM-dd"));

      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.pushState({ path: newUrl }, "", newUrl);
    } else {
      setLoading(false);
    }
  }, [
    startDate,
    endDate,
    selectedHotel,
    selectedLocation,
    hotels,
    isInitialized,
  ]);

  // Get booking for a specific room and date
  const getBookingForRoomDate = (
    roomId: string,
    date: Date
  ): BookingDisplayData | null => {
    if (!calendarData || !calendarData.bookings) return null;

    const formattedDate = format(date, "yyyy-MM-dd");

    for (const booking of calendarData.bookings) {
      if (!booking.rooms) continue;

      for (const roomBooking of booking.rooms) {
        if (roomBooking.roomId === roomId) {
          const checkIn = roomBooking.checkIn;
          const checkOut = roomBooking.checkOut;

          if (formattedDate >= checkIn && formattedDate < checkOut) {
            return {
              id: booking.id,
              fullName: booking.fullName,
              status: booking.status,
              hotelName: booking.hotelName,
            };
          }
        }
      }
    }

    return null;
  };

  const getBookingDisplayInfo = (
    roomId: string,
    date: Date
  ): BookingDisplayInfo => {
    if (!calendarData || !calendarData.bookings) {
      return { booking: null, daysCount: 0 };
    }

    const formattedDate = format(date, "yyyy-MM-dd");

    for (const booking of calendarData.bookings) {
      if (!booking.rooms) continue;

      for (const roomBooking of booking.rooms) {
        if (roomBooking.roomId === roomId) {
          const checkIn = roomBooking.checkIn;
          const checkOut = roomBooking.checkOut;

          if (formattedDate === checkIn) {
            const startDate = parseISO(checkIn);
            const endDate = parseISO(checkOut);

            // Calculate how many days of this booking are visible in the current view
            let visibleDaysCount = differenceInDays(endDate, startDate) + 1; // Include both start and end dates

            // Ensure the booking doesn't exceed the visible range
            const maxVisibleDays =
              dates.length -
              dates.findIndex((d) => format(d, "yyyy-MM-dd") === checkIn);
            visibleDaysCount = Math.min(visibleDaysCount, maxVisibleDays);

            return {
              booking: {
                id: booking.id,
                fullName: booking.fullName,
                status: booking.status,
                hotelName: booking.hotelName,
              },
              daysCount: visibleDaysCount,
            };
          }
        }
      }
    }

    return { booking: null, daysCount: 0 };
  };

  // Check if a cell should be rendered as a booking start
  const isBookingStart = (roomId: string, date: Date): boolean => {
    if (!calendarData || !calendarData.bookings) return false;

    const formattedDate = format(date, "yyyy-MM-dd");

    for (const booking of calendarData.bookings) {
      if (!booking.rooms) continue;

      for (const roomBooking of booking.rooms) {
        if (
          roomBooking.roomId === roomId &&
          roomBooking.checkIn === formattedDate
        ) {
          return true;
        }
      }
    }

    return false;
  };

  // Status color mapping with improved colors
  const getStatusColor = (status: string): string => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED":
        return "bg-emerald-500";
      case "PENDING":
        return "bg-amber-500";
      case "CANCELLED":
        return "bg-rose-500";
      default:
        return "bg-gray-500";
    }
  };

  // Handle filter changes
  const handleApplyFilters = () => {
    if (!startDate || !endDate) {
      return;
    }

    // This will trigger the useEffect for fetching data
    // which will also update the URL without full page reload
    setStartDate(new Date(startDate));
    setEndDate(new Date(endDate));
  };

  // Handle booking click

  // Handle date range validation
  const handleEndDateChange = (date: Date | undefined) => {
    if (date && startDate && date < startDate) {
      // End date can't be before start date
      setEndDate(startDate);
    } else {
      setEndDate(date || new Date());
    }
  };

  // Generate CSS grid template based on calculated column widths
  const gridTemplateColumns = columnWidths.length
    ? columnWidths.map((width) => `${width}px`).join(" ")
    : `220px repeat(${dates.length}, 80px)`;

  return (
    <div className="container mx-auto px-4 py-6" ref={calendarRef}>
      <Card className="mb-6 shadow-md">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-xl font-bold text-gray-800">
            Room Booking Calendar
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-1 block text-gray-700">
                Start Date
              </label>
              <DatePicker
                date={startDate}
                onSelect={(date: Date | undefined) =>
                  date && setStartDate(date)
                }
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block text-gray-700">
                End Date
              </label>
              <DatePicker
                date={endDate}
                onSelect={handleEndDateChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block text-gray-700">
                Location
              </label>
              <Select
                value={selectedLocation}
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block text-gray-700">
                Hotel
              </label>
              <Select value={selectedHotel} onValueChange={setSelectedHotel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Hotel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Hotels</SelectItem>
                  {hotels
                    .filter(
                      (hotel) =>
                        selectedLocation === "all" ||
                        hotel.locationId === selectedLocation
                    )
                    .map((hotel) => (
                      <SelectItem key={hotel.id} value={hotel.id}>
                        {hotel.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={handleApplyFilters}
            className="bg-primary hover:bg-primary text-white"
          >
            Apply Filters
          </Button>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : Object.keys(roomGroups).length === 0 ? (
        <Card className="shadow-md">
          <CardContent className="p-8">
            <div className="text-center text-gray-500 py-8">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="mt-2 text-lg font-medium">
                No rooms found for the selected criteria
              </p>
              <p className="mt-1">Try changing your filters or date range</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md border">
          <div style={{ minWidth: "max-content", position: "relative" }}>
            {/* Fixed header */}
            <div
              className="sticky top-0 z-20 bg-white"
              style={{
                display: "grid",
                gridTemplateColumns: gridTemplateColumns,
              }}
            >
              {/* Header cell */}
              <div className="bg-gray-100 p-3 font-bold border border-gray-300 sticky left-0 z-30 text-gray-800">
                Rooms & Dates
              </div>

              {/* Date header cells */}
              {dates.map((date, index) => (
                <div
                  key={date.toISOString()}
                  className={`bg-gray-100 p-2 text-center font-medium border border-gray-300 ${
                    date.getDay() === 0 || date.getDay() === 6
                      ? "bg-blue-50"
                      : ""
                  } ${index === 0 ? "border-l-2 border-l-gray-400" : ""}`}
                >
                  <div className="text-sm font-bold">{format(date, "EEE")}</div>
                  <div
                    className={`text-xs ${
                      date.getDay() === 0 || date.getDay() === 6
                        ? "text-blue-600 font-semibold"
                        : "text-gray-600"
                    }`}
                  >
                    {format(date, "dd MMM")}
                  </div>
                </div>
              ))}
            </div>

            {/* Calendar body */}
            <div>
              {/* Room groups by hotel and type */}
              {Object.entries(roomGroups).map(([hotelName, roomTypes]) => (
                <React.Fragment key={hotelName}>
                  {/* Hotel header */}
                  <div
                    className="bg-blue-600 text-white p-3 font-bold border border-blue-700 text-center"
                    style={{
                      display: "grid",
                      gridColumn: `1 / span ${dates.length + 1}`,
                      gridTemplateColumns: gridTemplateColumns,
                    }}
                  >
                    <div style={{ gridColumn: `1 / span ${dates.length + 1}` }}>
                      {hotelName}
                    </div>
                  </div>

                  {/* Room types within the hotel */}
                  {Object.entries(roomTypes).map(([roomType, rooms]) => (
                    <React.Fragment key={`${hotelName}-${roomType}`}>
                      {/* Room type header */}
                      <div
                        className="bg-gray-100 p-2 font-semibold border border-gray-300 text-gray-700 pl-6"
                        style={{
                          display: "grid",
                          gridColumn: `1 / span ${dates.length + 1}`,
                          gridTemplateColumns: gridTemplateColumns,
                        }}
                      >
                        <div
                          style={{ gridColumn: `1 / span ${dates.length + 1}` }}
                        >
                          {roomType} - {rooms.length}{" "}
                          {rooms.length === 1 ? "room" : "rooms"}
                        </div>
                      </div>

                      {/* Rooms in the group */}
                      {rooms.map((room) => (
                        <div
                          key={room.id}
                          style={{
                            display: "grid",
                            gridTemplateColumns: gridTemplateColumns,
                          }}
                        >
                          {/* Room name cell */}
                          <div className="p-2 font-medium border border-gray-300 sticky left-0 bg-white z-10 flex items-center">
                            <span className="ml-2 text-sm">
                              {room.name.includes("-")
                                ? `Room ${room.name.split("-")[1] || ""}`
                                : room.name}
                            </span>
                          </div>

                          {/* Date cells for this room */}
                          {dates.map((date) => {
                            const formattedDate = format(date, "yyyy-MM-dd");

                            // If this is the start of a booking
                            if (isBookingStart(room.id, date)) {
                              const { booking, daysCount } =
                                getBookingDisplayInfo(room.id, date);

                              if (booking && daysCount > 0) {
                                return (
                                  <div
                                    key={`${room.id}-${formattedDate}`}
                                    className={`p-2 border border-gray-300 relative ${getStatusColor(
                                      booking.status
                                    )} hover:brightness-90 transition-all`}
                                    style={{
                                      gridColumn: `span ${daysCount}`,
                                    }}
                                  >
                                    <div className="text-white font-medium truncate">
                                      {booking.fullName}
                                    </div>
                                    <div className="text-xs text-white/90 truncate">
                                      {booking.status}
                                    </div>
                                  </div>
                                );
                              }
                            }

                            // Check if this date is part of an ongoing booking
                            const ongoingBooking = getBookingForRoomDate(
                              room.id,
                              date
                            );

                            // Skip cells that are part of a spanning booking (but not the start)
                            if (
                              ongoingBooking &&
                              !isBookingStart(room.id, date)
                            ) {
                              return null;
                            }

                            // Empty cell
                            return (
                              <div
                                key={`${room.id}-${formattedDate}`}
                                className={`p-2 border border-gray-300 hover:bg-gray-50 ${
                                  date.getDay() === 0 || date.getDay() === 6
                                    ? "bg-blue-50/30"
                                    : ""
                                }`}
                              ></div>
                            );
                          })}
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 p-4 bg-white rounded-lg shadow-sm border flex flex-wrap gap-6">
        <div className="text-sm font-medium text-gray-700">Booking Status:</div>
        <div className="flex items-center">
          <div className="w-5 h-5 rounded bg-emerald-500 mr-2"></div>
          <span className="text-sm">Confirmed</span>
        </div>
        <div className="flex items-center">
          <div className="w-5 h-5 rounded bg-amber-500 mr-2"></div>
          <span className="text-sm">Pending</span>
        </div>
        <div className="flex items-center">
          <div className="w-5 h-5 rounded bg-rose-500 mr-2"></div>
          <span className="text-sm">Cancelled</span>
        </div>
        <div className="flex items-center ml-6 border-l pl-6">
          <div className="w-5 h-5 rounded bg-blue-50 mr-2 border border-gray-300"></div>
          <span className="text-sm">Weekend</span>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;

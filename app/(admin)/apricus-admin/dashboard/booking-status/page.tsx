"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  RefreshCw,
  Calendar,
  Filter,
  UserCheck,
  UserX,
  Clock,
  AlertCircle,
  Search,
} from "lucide-react";
import { DatePickerWithRange } from "@/utils/date-picker";
import type { DateRange } from "react-day-picker";
import { addDays, parseISO, differenceInHours } from "date-fns";

type Hotel = {
  id: string;
  name: string;
};

type Room = {
  name: string;
  price: number;
};

type BookingStats = {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  userAccount: string;
  checkIn: string;
  checkOut: string;
  checkInFormatted: string;
  checkOutFormatted: string;
  durationDays: number;
  checkoutTime: string;
  status: string;
  statusCode: number; // 0: Upcoming, 1: Checked In, 2: Checked Out
  isLateCheckout: boolean;
  rooms: Room[];
  adults: number;
  children: number;
  hotelName: string;
  locationName: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number;
};

export default function BookingStatusTable() {
  const { toast } = useToast();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotelId, setSelectedHotelId] = useState<string>("");
  const [bookingStats, setBookingStats] = useState<BookingStats[]>([]);
  const [filteredBookingStats, setFilteredBookingStats] = useState<
    BookingStats[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Stats counters
  const [statsCount, setStatsCount] = useState({
    total: 0,
    checkedIn: 0,
    checkedOut: 0,
    upcoming: 0,
    lateCheckout: 0,
  });

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    if (selectedHotelId) {
      fetchBookingStats();
    }
  }, [selectedHotelId, dateRange]);

  useEffect(() => {
    applyFilters();
  }, [bookingStats, statusFilter, searchQuery]);

  const fetchHotels = async () => {
    try {
      const response = await fetch(`/api/hotel`);
      const { success, data } = await response.json();
      if (success) {
        setHotels(data);
        if (data.length > 0) {
          setSelectedHotelId(data[0].id);
        }
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to fetch hotels",
        variant: "destructive",
      });
    }
  };

  const fetchBookingStats = async () => {
    if (!selectedHotelId || !dateRange?.from) return;

    try {
      setIsLoading(true);
      const startDate = dateRange.from.toISOString();
      const endDate = dateRange.to
        ? dateRange.to.toISOString()
        : addDays(dateRange.from, 7).toISOString();

      const searchParams = new URLSearchParams({
        startDate,
        endDate,
      });

      const response = await fetch(
        `/api/hotel/${selectedHotelId}/bookings/status?${searchParams.toString()}`
      );

      const { success, data } = await response.json();

      if (success) {
        setBookingStats(data);
        calculateStats(data);
      } else {
        throw new Error("Failed to fetch booking stats");
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to fetch booking stats",
        variant: "destructive",
      });
      setBookingStats([]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (data: BookingStats[]) => {
    const checkedIn = data.filter((booking) => booking.statusCode === 1).length;
    const checkedOut = data.filter(
      (booking) => booking.statusCode === 2
    ).length;
    const upcoming = data.filter((booking) => booking.statusCode === 0).length;
    const lateCheckout = data.filter(
      (booking) => booking.isLateCheckout
    ).length;

    setStatsCount({
      total: data.length,
      checkedIn,
      checkedOut,
      upcoming,
      lateCheckout,
    });
  };

  const applyFilters = () => {
    let filtered = [...bookingStats];

    // Apply status filter
    if (statusFilter !== "all") {
      switch (statusFilter) {
        case "checkedIn":
          filtered = filtered.filter((booking) => booking.statusCode === 1);
          break;
        case "checkedOut":
          filtered = filtered.filter((booking) => booking.statusCode === 2);
          break;
        case "upcoming":
          filtered = filtered.filter((booking) => booking.statusCode === 0);
          break;
        case "lateCheckout":
          filtered = filtered.filter((booking) => booking.isLateCheckout);
          break;
      }
    }

    // Apply search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.guestName.toLowerCase().includes(query) ||
          booking.email.toLowerCase().includes(query) ||
          booking.phone.toLowerCase().includes(query) ||
          booking.id.toLowerCase().includes(query)
      );
    }

    setFilteredBookingStats(filtered);
  };

  const getStatusBadgeColor = (statusCode: number, isLateCheckout: boolean) => {
    if (isLateCheckout) return "bg-orange-500";

    switch (statusCode) {
      case 0:
        return "bg-blue-500"; // Upcoming
      case 1:
        return "bg-green-500"; // Checked In
      case 2:
        return "bg-gray-500"; // Checked Out
      default:
        return "bg-gray-500";
    }
  };

  const getStatusBadgeIcon = (statusCode: number, isLateCheckout: boolean) => {
    if (isLateCheckout) return <Clock className="w-3 h-3 mr-1" />;

    switch (statusCode) {
      case 0:
        return <Calendar className="w-3 h-3 mr-1" />; // Upcoming
      case 1:
        return <UserCheck className="w-3 h-3 mr-1" />; // Checked In
      case 2:
        return <UserX className="w-3 h-3 mr-1" />; // Checked Out
      default:
        return null;
    }
  };

  const renderStatusMessage = (booking: BookingStats) => {
    const now = new Date();
    const checkoutDate = parseISO(booking.checkOut);
    const checkoutTime = new Date(checkoutDate);
    checkoutTime.setHours(12, 0, 0, 0);

    if (booking.isLateCheckout) {
      const hoursLate = differenceInHours(now, checkoutTime);
      return `Late checkout (${hoursLate}h past due)`;
    }

    if (booking.statusCode === 0) {
      const checkInDate = parseISO(booking.checkIn);
      const daysUntil = Math.ceil(
        (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return `Arriving in ${daysUntil} day${daysUntil !== 1 ? "s" : ""}`;
    }

    if (booking.statusCode === 1) {
      const hoursUntil = Math.ceil(
        (checkoutTime.getTime() - now.getTime()) / (1000 * 60 * 60)
      );
      return `Checkout in ${hoursUntil} hour${hoursUntil !== 1 ? "s" : ""}`;
    }

    if (booking.statusCode === 2) {
      return `Checked out on ${booking.checkOutFormatted}`;
    }

    return booking.status;
  };

  const renderRoomInfo = (rooms: Room[]) => {
    if (rooms.length === 1) {
      return rooms[0].name;
    }

    return (
      <div>
        {rooms.length} rooms: {rooms.map((r) => r.name).join(", ")}
      </div>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
      case "PAID":
      case "SUCCESS":
        return <Badge className="bg-green-500">Paid</Badge>;
      case "PENDING":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "FAILED":
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-comfortaaBold text-primary">
            Booking Status Dashboard
          </h2>
          <div className="flex gap-4">
            <div className="w-64">
              <Select
                value={selectedHotelId}
                onValueChange={setSelectedHotelId}
                disabled={hotels.length === 0}
              >
                <SelectTrigger className="font-comfortaaRegular">
                  <SelectValue placeholder="Select a hotel" />
                </SelectTrigger>
                <SelectContent>
                  {hotels.map((hotel) => (
                    <SelectItem key={hotel.id} value={hotel.id}>
                      {hotel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={fetchBookingStats}
              variant="outline"
              className="font-comfortaaRegular"
              disabled={!selectedHotelId || isLoading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Date Range Filter</CardTitle>
            <CardDescription>
              Select a date range to view bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="w-full md:w-1/2">
                <DatePickerWithRange
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  className="w-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    const today = new Date();
                    setDateRange({
                      from: today,
                      to: addDays(today, 7),
                    });
                  }}
                  variant="outline"
                >
                  This Week
                </Button>
                <Button
                  onClick={() => {
                    const today = new Date();
                    setDateRange({
                      from: today,
                      to: addDays(today, 30),
                    });
                  }}
                  variant="outline"
                >
                  Next 30 Days
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
          <Card
            className={`cursor-pointer ${
              statusFilter === "all" ? "border-primary border-2" : ""
            }`}
            onClick={() => setStatusFilter("all")}
          >
            <CardHeader className="pb-2">
              <CardTitle>All Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{statsCount.total}</p>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer ${
              statusFilter === "upcoming" ? "border-primary border-2" : ""
            }`}
            onClick={() => setStatusFilter("upcoming")}
          >
            <CardHeader className="pb-2">
              <CardTitle>Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                <p className="text-3xl font-bold">{statsCount.upcoming}</p>
              </div>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer ${
              statusFilter === "checkedIn" ? "border-primary border-2" : ""
            }`}
            onClick={() => setStatusFilter("checkedIn")}
          >
            <CardHeader className="pb-2">
              <CardTitle>Checked In</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <UserCheck className="w-5 h-5 mr-2 text-green-500" />
                <p className="text-3xl font-bold">{statsCount.checkedIn}</p>
              </div>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer ${
              statusFilter === "checkedOut" ? "border-primary border-2" : ""
            }`}
            onClick={() => setStatusFilter("checkedOut")}
          >
            <CardHeader className="pb-2">
              <CardTitle>Checked Out</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <UserX className="w-5 h-5 mr-2 text-gray-500" />
                <p className="text-3xl font-bold">{statsCount.checkedOut}</p>
              </div>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer ${
              statusFilter === "lateCheckout" ? "border-primary border-2" : ""
            }`}
            onClick={() => setStatusFilter("lateCheckout")}
          >
            <CardHeader className="pb-2">
              <CardTitle>Late Checkout</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-500" />
                <p className="text-3xl font-bold">{statsCount.lateCheckout}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by name, email, phone or booking ID..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bookings</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="checkedIn">Checked In</SelectItem>
                <SelectItem value="checkedOut">Checked Out</SelectItem>
                <SelectItem value="lateCheckout">Late Checkout</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-500">
                Loading booking information...
              </p>
            </div>
          ) : filteredBookingStats.length === 0 ? (
            <div className="p-8 text-center">
              <AlertCircle className="w-8 h-8 text-gray-400 mx-auto" />
              <p className="mt-2 text-gray-500">
                No bookings found for the selected criteria
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Room Info</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookingStats.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        {booking.id}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{booking.guestName}</div>
                        <div className="text-sm text-gray-500">
                          {booking.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        {renderRoomInfo(booking.rooms)}
                        <div className="text-sm text-gray-500">
                          {booking.adults} adults, {booking.children} children
                        </div>
                      </TableCell>
                      <TableCell>{booking.checkInFormatted}</TableCell>
                      <TableCell>{booking.checkOutFormatted}</TableCell>
                      <TableCell>{booking.durationDays} nights</TableCell>
                      <TableCell>
                        <div>
                          {getPaymentStatusBadge(booking.paymentStatus)}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {booking.paymentMethod} / ${booking.totalAmount}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`flex items-center ${getStatusBadgeColor(
                            booking.statusCode,
                            booking.isLateCheckout
                          )}`}
                        >
                          {getStatusBadgeIcon(
                            booking.statusCode,
                            booking.isLateCheckout
                          )}
                          {booking.status}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">
                          {renderStatusMessage(booking)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

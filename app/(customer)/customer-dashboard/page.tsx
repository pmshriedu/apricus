//File : /app/(customer)/customer-dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { formatCurrency } from "@/lib/currency-formatter";
import {
  Loader2,
  Calendar,
  MapPin,
  Users,
  AlertTriangle,
  Clock,
  FileDown,
  RefreshCw,
  Phone,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDate } from "@/lib/date-formatter";
import { BookingWithDetails, RoomBooking } from "@/types/bookings";
import { toast } from "@/hooks/use-toast";

// Status badge mapping
const statusVariants = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  CONFIRMED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

const statusIcons = {
  PENDING: <Clock className="h-4 w-4 mr-1" />,
  CONFIRMED: <Tag className="h-4 w-4 mr-1" />,
  CANCELLED: <AlertTriangle className="h-4 w-4 mr-1" />,
};

export default function CustomerDashboard() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [isDownloading, setIsDownloading] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    // Redirect if user is not authenticated
    if (sessionStatus === "unauthenticated") {
      router.push("/customer-signin");
      return;
    }

    // Fetch user bookings if authenticated
    if (sessionStatus === "authenticated" && session?.user) {
      fetchUserBookings();
    }
  }, [sessionStatus, session, router]);

  const fetchUserBookings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/bookings/customer-bookings");

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      setBookings(data.data || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load your bookings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadBookingPDF = async (bookingId: string) => {
    try {
      // Set downloading state for this specific booking
      setIsDownloading((prev) => ({ ...prev, [bookingId]: true }));

      // Request the PDF from the API
      const response = await fetch(`/api/bookings/download/${bookingId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to download booking details"
        );
      }

      // Get the PDF blob from the response
      const blob = await response.blob();

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger download
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `booking-${bookingId}.pdf`;

      // Append to the document and click to trigger download
      document.body.appendChild(a);
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download Successful",
        description: "Your booking details have been downloaded successfully.",
        variant: "default",
      });
    } catch (err) {
      console.error("Error downloading booking PDF:", err);
      toast({
        title: "Download Failed",
        description:
          err instanceof Error
            ? err.message
            : "Failed to download booking details",
        variant: "destructive",
      });
    } finally {
      // Clear downloading state for this booking
      setIsDownloading((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  const filteredBookings = () => {
    if (activeTab === "all") return bookings;
    return bookings.filter((booking) => booking.status === activeTab);
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (sessionStatus === "loading" || isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-comfortaaBold text-center mb-8">
          My Bookings
        </h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-comfortaaBold text-gray-800 mb-4 sm:mb-0">
          My Bookings
        </h1>
        <Button
          variant="outline"
          onClick={fetchUserBookings}
          className="font-comfortaaRegular text-sm"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {bookings?.length === 0 && !isLoading ? (
        <Card className="w-full mb-8 bg-gray-50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Calendar className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-comfortaaMedium text-gray-700 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-500 font-comfortaaRegular text-center">
              You haven&lsquo;t made any bookings yet. Start exploring our
              hotels and plan your stay!
            </p>
            <Button
              onClick={() => router.push("/")}
              className="mt-6 bg-primary hover:bg-primary/90 font-comfortaaMedium"
            >
              Browse Hotels
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Tabs
            defaultValue="all"
            className="w-full mb-8"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-3 sm:w-auto">
              <TabsTrigger value="all" className="font-comfortaaMedium">
                All Bookings
              </TabsTrigger>
              <TabsTrigger value="CONFIRMED" className="font-comfortaaMedium">
                Confirmed
              </TabsTrigger>
              <TabsTrigger value="PENDING" className="font-comfortaaMedium">
                Pending
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="grid gap-6">
                {filteredBookings().length === 0 ? (
                  <Card className="w-full bg-gray-50">
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <AlertTriangle className="h-10 w-10 text-gray-400 mb-4" />
                      <p className="text-gray-500 font-comfortaaRegular text-center">
                        No {activeTab !== "all" ? activeTab.toLowerCase() : ""}{" "}
                        bookings found.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredBookings().map((booking: BookingWithDetails) => {
                    const nights = calculateNights(
                      booking.checkIn,
                      booking.checkOut
                    );

                    return (
                      <Card
                        key={booking.id}
                        className="w-full hover:shadow-md transition-shadow"
                      >
                        <CardHeader className="pb-2">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                            <CardTitle className="font-comfortaaBold text-xl text-gray-800">
                              {booking.hotel.name}
                            </CardTitle>
                            <Badge
                              variant="outline"
                              className={`font-comfortaaMedium flex items-center whitespace-nowrap mt-2 sm:mt-0 ${
                                statusVariants[booking.status]
                              }`}
                            >
                              {statusIcons[booking.status]}
                              {booking.status}
                            </Badge>
                          </div>
                          <CardDescription className="font-comfortaaRegular text-gray-600 flex items-center">
                            <MapPin className="h-4 w-4 mr-1 inline" />
                            {booking.location.name}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="pb-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                            <div className="flex items-start">
                              <Calendar className="h-5 w-5 text-primary mr-2 mt-0.5" />
                              <div>
                                <p className="text-sm font-comfortaaMedium text-gray-700">
                                  Check-in / Check-out
                                </p>
                                <p className="text-sm font-comfortaaRegular text-gray-600">
                                  {formatDate(booking.checkIn)} -{" "}
                                  {formatDate(booking.checkOut)}
                                </p>
                                <p className="text-xs font-comfortaaLight text-gray-500 mt-1">
                                  {nights} {nights === 1 ? "night" : "nights"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <Users className="h-5 w-5 text-primary mr-2 mt-0.5" />
                              <div>
                                <p className="text-sm font-comfortaaMedium text-gray-700">
                                  Guests
                                </p>
                                <p className="text-sm font-comfortaaRegular text-gray-600">
                                  {booking.adults} Adults
                                  {booking.childrens > 0 &&
                                    `, ${booking.childrens} Children`}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <Phone className="h-5 w-5 text-primary mr-2 mt-0.5" />
                              <div>
                                <p className="text-sm font-comfortaaMedium text-gray-700">
                                  Contact Details
                                </p>
                                <p className="text-sm font-comfortaaRegular text-gray-600">
                                  {booking.fullName}
                                </p>
                                <p className="text-xs font-comfortaaLight text-gray-500">
                                  {booking.phoneNo}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <Tag className="h-5 w-5 text-primary mr-2 mt-0.5" />
                              <div>
                                <p className="text-sm font-comfortaaMedium text-gray-700">
                                  Booking Amount
                                </p>
                                <p className="text-sm font-comfortaaRegular text-gray-600">
                                  {booking.transaction
                                    ? formatCurrency(booking.transaction.amount)
                                    : "Payment pending"}
                                </p>
                                {booking.transaction?.discountAmount &&
                                  booking.transaction.discountAmount > 0 && (
                                    <p className="text-xs font-comfortaaLight text-green-600">
                                      Discount:{" "}
                                      {formatCurrency(
                                        booking.transaction.discountAmount
                                      )}
                                    </p>
                                  )}
                              </div>
                            </div>
                          </div>

                          <Accordion type="single" collapsible className="mt-4">
                            <AccordionItem
                              value="room-details"
                              className="border-b-0"
                            >
                              <AccordionTrigger className="font-comfortaaMedium text-sm py-2">
                                View Room Details
                              </AccordionTrigger>
                              <AccordionContent>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="font-comfortaaMedium">
                                        Room Type
                                      </TableHead>
                                      <TableHead className="font-comfortaaMedium text-right">
                                        Price/Night
                                      </TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {booking.roomBookings.map(
                                      (roomBooking: RoomBooking) => (
                                        <TableRow key={roomBooking.id}>
                                          <TableCell className="font-comfortaaRegular">
                                            {roomBooking.room.name}
                                          </TableCell>
                                          <TableCell className="text-right font-comfortaaRegular">
                                            {formatCurrency(
                                              roomBooking.room.price
                                            )}
                                          </TableCell>
                                        </TableRow>
                                      )
                                    )}
                                  </TableBody>
                                </Table>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </CardContent>

                        <CardFooter className="border-t pt-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                          <div className="text-xs font-comfortaaLight text-gray-500">
                            Booking ID: {booking.id.slice(0, 8)}...
                            <br />
                            Booked on:{" "}
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex space-x-2">
                            {booking.status === "CONFIRMED" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="font-comfortaaRegular text-sm border-primary text-primary hover:bg-primary/5"
                                onClick={() => downloadBookingPDF(booking.id)}
                                disabled={isDownloading[booking.id]}
                              >
                                {isDownloading[booking.id] ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <FileDown className="h-4 w-4 mr-2" />
                                )}
                                Download
                              </Button>
                            )}
                            <Button
                              variant="default"
                              size="sm"
                              className="font-comfortaaRegular text-sm bg-primary hover:bg-primary/90"
                              onClick={() =>
                                router.push(`/bookings/details/${booking.id}`)
                              }
                            >
                              View Details
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    );
                  })
                )}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

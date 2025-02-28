// File: /app/bookings/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/currency-formatter";
import { formatDate } from "@/lib/date-formatter";
import {
  Loader2,
  Calendar,
  Building2,
  MapPin,
  Users,
  AlertTriangle,
  Clock,
  ArrowLeft,
  Tag,
  Receipt,
  Home,
  BadgeCheck,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define types similar to dashboard
interface RoomBooking {
  id: string;
  roomId: string;
  bookingId: string;
  checkIn: string;
  checkOut: string;
  room: {
    name: string;
    price: number;
    description?: string;
  };
}

interface Transaction {
  id: string;
  amount: number;
  status: string;
  totalAmount: number;
  sgst: number;
  cgst: number;
  discountAmount?: number;
  currency: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  createdAt: string;
}

interface BookingWithDetails {
  id: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  childrens: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  fullName: string;
  email: string;
  phoneNo: string;
  companyName?: string;
  gstNumber?: string;
  createdAt: string;
  updatedAt: string;
  hotel: {
    id: string;
    name: string;
    description?: string;
  };
  location: {
    id: string;
    name: string;
  };
  transaction?: Transaction;
  roomBookings: RoomBooking[];
}

// Status badge mapping
const statusVariants = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  CONFIRMED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

const statusIcons = {
  PENDING: <Clock className="h-4 w-4 mr-1" />,
  CONFIRMED: <BadgeCheck className="h-4 w-4 mr-1" />,
  CANCELLED: <X className="h-4 w-4 mr-1" />,
};

export default function BookingDetails() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<BookingWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    // Redirect if user is not authenticated
    if (sessionStatus === "unauthenticated") {
      router.push("/customer-signin");
      return;
    }

    // Fetch booking details if authenticated
    if (sessionStatus === "authenticated" && session?.user && bookingId) {
      fetchBookingDetails();
    }
  }, [sessionStatus, session, bookingId, router]);

  const fetchBookingDetails = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/bookings/${bookingId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch booking details");
      }

      const data = await response.json();
      setBooking(data.data);
    } catch (err) {
      console.error("Error fetching booking details:", err);
      setError("Failed to load booking details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const cancelBooking = async () => {
    if (!booking || booking.status === "CANCELLED") return;

    setIsCancelling(true);
    try {
      const response = await fetch(`/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "CANCELLED" }),
      });

      if (!response.ok) {
        throw new Error("Failed to cancel booking");
      }

      // Refresh booking data
      await fetchBookingDetails();
      setCancelDialogOpen(false);
    } catch (err) {
      console.error("Error cancelling booking:", err);
      setError("Failed to cancel booking. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  const isBookingCancellable = () => {
    if (!booking) return false;

    // Can only cancel PENDING or CONFIRMED bookings
    if (booking.status === "CANCELLED") return false;

    // Check if check-in date is at least 24 hours away
    const checkInDate = new Date(booking.checkIn);
    const now = new Date();
    const hoursDifference =
      (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    return hoursDifference >= 24;
  };

  if (sessionStatus === "loading" || isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-1/2 mb-6" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
                <Skeleton className="h-40 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push("/customer-dashboard")}
              className="font-comfortaaRegular"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bookings
            </Button>
          </div>

          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error || "Booking not found. Please check the booking ID."}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const nights = calculateNights(booking.checkIn, booking.checkOut);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/customer-dashboard")}
            className="font-comfortaaRegular"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bookings
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-comfortaaBold text-gray-800 mb-2 sm:mb-0">
            Booking Details
          </h1>
          <Badge
            variant="outline"
            className={`font-comfortaaMedium flex items-center ${
              statusVariants[booking.status]
            }`}
          >
            {statusIcons[booking.status]}
            {booking.status}
          </Badge>
        </div>

        {booking.status === "CANCELLED" && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-700">Booking Cancelled</AlertTitle>
            <AlertDescription className="text-red-600">
              This booking has been cancelled and is no longer valid.
            </AlertDescription>
          </Alert>
        )}

        <Card className="mb-8">
          <CardHeader className="border-b pb-4">
            <CardTitle className="font-comfortaaBold text-xl flex items-center text-gray-800">
              <Building2 className="h-5 w-5 mr-2 text-primary" />
              {booking.hotel.name}
            </CardTitle>
            <CardDescription className="font-comfortaaRegular text-gray-600 flex items-center">
              <MapPin className="h-4 w-4 mr-1 inline" />
              {booking.location.name}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-comfortaaMedium text-gray-700 mb-2 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    Stay Details
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm font-comfortaaMedium">
                      Check-in
                      <span className="float-right font-comfortaaRegular">
                        {formatDate(booking.checkIn)}
                      </span>
                    </p>
                    <p className="text-sm font-comfortaaMedium mt-2">
                      Check-out
                      <span className="float-right font-comfortaaRegular">
                        {formatDate(booking.checkOut)}
                      </span>
                    </p>
                    <p className="text-sm font-comfortaaMedium mt-2">
                      Duration
                      <span className="float-right font-comfortaaRegular">
                        {nights} {nights === 1 ? "night" : "nights"}
                      </span>
                    </p>
                    <p className="text-sm font-comfortaaMedium mt-2">
                      Guests
                      <span className="float-right font-comfortaaRegular">
                        {booking.adults} Adults, {booking.childrens} Children
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-comfortaaMedium text-gray-700 mb-2 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    Guest Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm font-comfortaaMedium">
                      Name
                      <span className="float-right font-comfortaaRegular">
                        {booking.fullName}
                      </span>
                    </p>
                    <p className="text-sm font-comfortaaMedium mt-2">
                      Email
                      <span className="float-right font-comfortaaRegular">
                        {booking.email}
                      </span>
                    </p>
                    <p className="text-sm font-comfortaaMedium mt-2">
                      Phone
                      <span className="float-right font-comfortaaRegular">
                        {booking.phoneNo}
                      </span>
                    </p>
                    {booking.companyName && (
                      <p className="text-sm font-comfortaaMedium mt-2">
                        Company
                        <span className="float-right font-comfortaaRegular">
                          {booking.companyName}
                        </span>
                      </p>
                    )}
                    {booking.gstNumber && (
                      <p className="text-sm font-comfortaaMedium mt-2">
                        GST Number
                        <span className="float-right font-comfortaaRegular">
                          {booking.gstNumber}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-comfortaaMedium text-gray-700 mb-2 flex items-center">
                    <Receipt className="h-5 w-5 mr-2 text-primary" />
                    Payment Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm font-comfortaaMedium">
                      Status
                      <span className="float-right font-comfortaaRegular">
                        {booking.transaction
                          ? booking.transaction.status
                          : "Payment Pending"}
                      </span>
                    </p>
                    {booking.transaction && (
                      <>
                        <p className="text-sm font-comfortaaMedium mt-2">
                          Amount
                          <span className="float-right font-comfortaaRegular">
                            {formatCurrency(booking.transaction.totalAmount)}
                          </span>
                        </p>
                        {booking.transaction?.cgst
                          ? booking.transaction.cgst > 0 && (
                              <p className="text-xs font-comfortaaLight text-green-600">
                                CGST: {formatCurrency(booking.transaction.cgst)}
                              </p>
                            )
                          : ""}
                        {booking.transaction?.sgst
                          ? booking.transaction.sgst > 0 && (
                              <p className="text-xs font-comfortaaLight text-green-600">
                                SGST: {formatCurrency(booking.transaction.sgst)}
                              </p>
                            )
                          : ""}
                        {booking.transaction.discountAmount
                          ? booking.transaction.discountAmount > 0 && (
                              <p className="text-sm font-comfortaaMedium mt-2 text-green-700">
                                Discount
                                <span className="float-right font-comfortaaRegular">
                                  {formatCurrency(
                                    booking.transaction.discountAmount
                                  )}
                                </span>
                              </p>
                            )
                          : ""}
                        {booking.transaction.razorpayPaymentId && (
                          <p className="text-sm font-comfortaaMedium mt-2">
                            Payment ID
                            <span className="float-right font-comfortaaRegular text-xs">
                              {booking.transaction.razorpayPaymentId}
                            </span>
                          </p>
                        )}
                        <p className="text-sm font-comfortaaMedium mt-2">
                          Transaction Date
                          <span className="float-right font-comfortaaRegular">
                            {new Date(
                              booking.transaction.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-comfortaaMedium text-gray-700 mb-2 flex items-center">
                    <Home className="h-5 w-5 mr-2 text-primary" />
                    Booking Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm font-comfortaaMedium">
                      Booking ID
                      <span className="float-right font-comfortaaRegular text-xs">
                        {booking.id}
                      </span>
                    </p>
                    <p className="text-sm font-comfortaaMedium mt-2">
                      Booking Date
                      <span className="float-right font-comfortaaRegular">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </p>
                    <p className="text-sm font-comfortaaMedium mt-2">
                      Last Updated
                      <span className="float-right font-comfortaaRegular">
                        {new Date(booking.updatedAt).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-md font-comfortaaMedium text-gray-700 mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2 text-primary" />
                Room Details
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-comfortaaMedium">
                      Room Type
                    </TableHead>
                    <TableHead className="font-comfortaaMedium text-right">
                      Price
                    </TableHead>
                    <TableHead className="font-comfortaaMedium text-right">
                      Nights
                    </TableHead>
                    <TableHead className="font-comfortaaMedium text-right">
                      Total
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {booking.roomBookings?.map((roomBooking) => (
                    <TableRow key={roomBooking.id}>
                      <TableCell className="font-comfortaaRegular">
                        {roomBooking.room.name}
                      </TableCell>
                      <TableCell className="text-right font-comfortaaRegular">
                        {formatCurrency(roomBooking.room.price)}
                      </TableCell>
                      <TableCell className="text-right font-comfortaaRegular">
                        {nights}
                      </TableCell>
                      <TableCell className="text-right font-comfortaaRegular">
                        {formatCurrency(roomBooking.room.price * nights)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {booking.transaction && (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-right font-comfortaaMedium"
                      >
                        Total Amount
                      </TableCell>
                      <TableCell className="text-right font-comfortaaMedium">
                        {formatCurrency(booking.transaction.amount)}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-6 flex-col sm:flex-row gap-4">
            {isBookingCancellable() && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => setCancelDialogOpen(true)}
                  className="font-comfortaaRegular w-full sm:w-auto"
                >
                  Cancel Booking
                </Button>

                <Dialog
                  open={cancelDialogOpen}
                  onOpenChange={setCancelDialogOpen}
                >
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-comfortaaBold">
                        Cancel Booking
                      </DialogTitle>
                      <DialogDescription className="font-comfortaaRegular">
                        Are you sure you want to cancel this booking? This
                        action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setCancelDialogOpen(false)}
                        className="font-comfortaaRegular"
                      >
                        Keep Booking
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={cancelBooking}
                        disabled={isCancelling}
                        className="font-comfortaaRegular"
                      >
                        {isCancelling ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          "Yes, Cancel Booking"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

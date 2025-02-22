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
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Loader2,
  Eye,
  Calendar,
  Users,
  CreditCard,
  Building2,
  Filter,
  Search,
  RefreshCw,
  Clock,
  XCircle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

// Type definitions remain the same...
type Booking = {
  id: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  childrens: number;
  fullName: string;
  phoneNo: string;
  email: string;
  companyName?: string;
  gstNumber?: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  transaction?: {
    amount: number;
    status: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
  };
  hotel: {
    name: string;
  };
  location: {
    name: string;
  };
  createdAt: string;
};

export default function BookingsDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/bookings");
      const result = await response.json();
      setBookings(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await fetchBookings();
    setIsRefreshing(false);
  };

  const deleteBooking = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/bookings/${deleteId}`, { method: "DELETE" });
      setBookings(bookings.filter((booking) => booking.id !== deleteId));
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete booking:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-500";
      case "CANCELLED":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "success":
        return "bg-emerald-500";
      case "failed":
        return "bg-red-500";
      case "pending":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="font-comfortaaBold text-2xl md:text-3xl text-primary">
            Bookings Management
          </h1>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full"
              />
            </div>
            <Button
              onClick={refreshData}
              variant="outline"
              size="icon"
              className={isRefreshing ? "animate-spin" : ""}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              title: "Total Bookings",
              value: bookings.length,
              icon: Calendar,
            },
            {
              title: "Confirmed",
              value: bookings.filter((b) => b.status === "CONFIRMED").length,
              icon: Users,
              color: "text-green-500",
            },
            {
              title: "Pending",
              value: bookings.filter((b) => b.status === "PENDING").length,
              icon: Clock,
              color: "text-yellow-500",
            },
            {
              title: "Cancelled",
              value: bookings.filter((b) => b.status === "CANCELLED").length,
              icon: XCircle,
              color: "text-red-500",
            },
          ].map((card, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <card.icon
                  className={`h-4 w-4 ${card.color || "text-gray-500"}`}
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-gray-600 font-comfortaaRegular">
              {searchTerm
                ? "No bookings found matching your search."
                : "No bookings found."}
            </p>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-comfortaaBold">
                        Guest Name
                      </TableHead>
                      <TableHead className="font-comfortaaBold">
                        Hotel
                      </TableHead>
                      <TableHead className="font-comfortaaBold">
                        Check In
                      </TableHead>
                      <TableHead className="font-comfortaaBold hidden lg:table-cell">
                        Check Out
                      </TableHead>
                      <TableHead className="font-comfortaaBold">
                        Status
                      </TableHead>
                      <TableHead className="font-comfortaaBold">
                        Payment
                      </TableHead>
                      <TableHead className="font-comfortaaBold text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentBookings.map((booking) => (
                      <TableRow key={booking.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-comfortaaRegular">
                              {booking.fullName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {booking.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-comfortaaRegular">
                              {booking.hotel.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {booking.location.name}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-comfortaaRegular">
                              {formatDate(booking.checkIn)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {booking.adults + booking.childrens} Guest(s)
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell font-comfortaaRegular">
                          {formatDate(booking.checkOut)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getStatusColor(
                              booking.status
                            )} text-white`}
                          >
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {booking.transaction ? (
                            <div className="space-y-1">
                              <Badge
                                className={`${getPaymentStatusColor(
                                  booking.transaction.status
                                )} text-white`}
                              >
                                {booking.transaction.status}
                              </Badge>
                              <p className="text-sm font-medium">
                                {formatCurrency(booking.transaction.amount)}
                              </p>
                            </div>
                          ) : (
                            <Badge variant="outline">No Payment</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setIsDetailModalOpen(true);
                              }}
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setDeleteId(booking.id);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {filteredBookings.length > itemsPerPage && (
          <div className="flex justify-between items-center mt-4 px-4">
            <div className="text-sm text-gray-600 font-comfortaaRegular">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredBookings.length)} of{" "}
              {filteredBookings.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              <span className="font-comfortaaRegular">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Delete Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Booking Confirmation</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                booking and associated transaction data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteBooking}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Details Modal */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                Booking Details
                <Badge
                  className={`${getStatusColor(
                    selectedBooking?.status || ""
                  )} text-white`}
                >
                  {selectedBooking?.status}
                </Badge>
                {selectedBooking?.transaction && (
                  <Badge
                    className={`${getPaymentStatusColor(
                      selectedBooking.transaction.status
                    )} text-white`}
                  >
                    {selectedBooking.transaction.status}
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>

            {selectedBooking && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Guest Information Card */}
                  <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Users className="h-5 w-5 text-primary" />
                        Guest Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-gray-500 text-sm">Name:</span>
                        <span className="col-span-2 font-medium">
                          {selectedBooking.fullName}
                        </span>

                        <span className="text-gray-500 text-sm">Email:</span>
                        <span className="col-span-2 font-medium break-all">
                          {selectedBooking.email}
                        </span>

                        <span className="text-gray-500 text-sm">Phone:</span>
                        <span className="col-span-2 font-medium">
                          {selectedBooking.phoneNo}
                        </span>

                        {selectedBooking.companyName && (
                          <>
                            <span className="text-gray-500 text-sm">
                              Company:
                            </span>
                            <span className="col-span-2 font-medium">
                              {selectedBooking.companyName}
                            </span>
                          </>
                        )}

                        {selectedBooking.gstNumber && (
                          <>
                            <span className="text-gray-500 text-sm">GST:</span>
                            <span className="col-span-2 font-medium">
                              {selectedBooking.gstNumber}
                            </span>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Property Details Card */}
                  <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Building2 className="h-5 w-5 text-primary" />
                        Property Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-gray-500 text-sm">Hotel:</span>
                        <span className="col-span-2 font-medium">
                          {selectedBooking.hotel.name}
                        </span>

                        <span className="text-gray-500 text-sm">Location:</span>
                        <span className="col-span-2 font-medium">
                          {selectedBooking.location.name}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Stay Details Card */}
                  <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Calendar className="h-5 w-5 text-primary" />
                        Stay Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-gray-500 text-sm">Check In:</span>
                        <span className="col-span-2 font-medium">
                          {formatDate(selectedBooking.checkIn)}
                        </span>

                        <span className="text-gray-500 text-sm">
                          Check Out:
                        </span>
                        <span className="col-span-2 font-medium">
                          {formatDate(selectedBooking.checkOut)}
                        </span>

                        <span className="text-gray-500 text-sm">Duration:</span>
                        <span className="col-span-2 font-medium">
                          {Math.ceil(
                            (new Date(selectedBooking.checkOut).getTime() -
                              new Date(selectedBooking.checkIn).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          nights
                        </span>

                        <span className="text-gray-500 text-sm">Guests:</span>
                        <span className="col-span-2 font-medium">
                          {selectedBooking.adults} Adult
                          {selectedBooking.adults !== 1 ? "s" : ""},
                          {selectedBooking.childrens}{" "}
                          {selectedBooking.childrens !== 1
                            ? "Children"
                            : "Child"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Information Card */}
                  {selectedBooking.transaction && (
                    <Card className="shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <CreditCard className="h-5 w-5 text-primary" />
                          Payment Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-gray-500 text-sm">Amount:</span>
                          <span className="col-span-2 font-medium">
                            {formatCurrency(selectedBooking.transaction.amount)}
                          </span>

                          <span className="text-gray-500 text-sm">Status:</span>
                          <span className="col-span-2">
                            <Badge
                              className={`${getPaymentStatusColor(
                                selectedBooking.transaction.status
                              )} text-white`}
                            >
                              {selectedBooking.transaction.status}
                            </Badge>
                          </span>

                          {selectedBooking.transaction.razorpayOrderId && (
                            <>
                              <span className="text-gray-500 text-sm">
                                Order ID:
                              </span>
                              <span className="col-span-2 font-medium break-all">
                                {selectedBooking.transaction.razorpayOrderId}
                              </span>
                            </>
                          )}

                          {selectedBooking.transaction.razorpayPaymentId && (
                            <>
                              <span className="text-gray-500 text-sm">
                                Payment ID:
                              </span>
                              <span className="col-span-2 font-medium break-all">
                                {selectedBooking.transaction.razorpayPaymentId}
                              </span>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <Separator />

                <DialogFooter className="flex justify-between items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsDetailModalOpen(false)}
                  >
                    Close
                  </Button>
                  {selectedBooking.status === "PENDING" && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => {
                          // Handle cancellation
                          setIsDetailModalOpen(false);
                        }}
                      >
                        Cancel Booking
                      </Button>
                      <Button
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => {
                          // Handle confirmation
                          setIsDetailModalOpen(false);
                        }}
                      >
                        Confirm Booking
                      </Button>
                    </div>
                  )}
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

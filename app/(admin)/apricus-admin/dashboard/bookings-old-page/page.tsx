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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, Loader2, Eye, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Booking = {
  id: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  childrens: number;
  fullName: string;
  phoneNo: string;
  email: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  locationId: string;
  hotelId: string;
  location: { name: string };
  hotel: { name: string };
  createdAt: string;
};

export default function BookingManagement() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<
    "PENDING" | "CONFIRMED" | "CANCELLED"
  >("PENDING");
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    fetchBookings();
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings");
      const { success, data } = await response.json();
      if (success) {
        setBookings(data);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedBooking) return;

    try {
      const response = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedStatus }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Booking status updated successfully",
        });
        fetchBookings();
        setIsStatusDialogOpen(false);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedBooking) return;

    try {
      const response = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Booking deleted successfully",
        });
        fetchBookings();
        setIsDeleteDialogOpen(false);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete booking",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const renderBookingCard = (booking: Booking) => (
    <Card key={booking.id} className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg font-comfortaaBold">
          {booking.fullName}
        </CardTitle>
        <CardDescription>
          {booking.hotel.name} - {booking.location.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-comfortaaLight">
              {new Date(booking.checkIn).toLocaleDateString()} -{" "}
              {new Date(booking.checkOut).toLocaleDateString()}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-comfortaaBold ${
                booking.status === "CONFIRMED"
                  ? "bg-green-100 text-green-800"
                  : booking.status === "CANCELLED"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {booking.status}
            </span>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedBooking(booking);
                setIsViewDialogOpen(true);
              }}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedBooking(booking);
                setSelectedStatus(booking.status);
                setIsStatusDialogOpen(true);
              }}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setSelectedBooking(booking);
                setIsDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderBookingTable = () => (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-comfortaaBold">Guest Name</TableHead>
            <TableHead className="font-comfortaaBold">Hotel</TableHead>
            <TableHead className="font-comfortaaBold">Location</TableHead>
            <TableHead className="font-comfortaaBold">Check In</TableHead>
            <TableHead className="font-comfortaaBold">Check Out</TableHead>
            <TableHead className="font-comfortaaBold">Status</TableHead>
            <TableHead className="font-comfortaaBold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-comfortaaRegular">
                {booking.fullName}
              </TableCell>
              <TableCell className="font-comfortaaRegular">
                {booking.hotel.name}
              </TableCell>
              <TableCell className="font-comfortaaRegular">
                {booking.location.name}
              </TableCell>
              <TableCell className="font-comfortaaLight">
                {new Date(booking.checkIn).toLocaleDateString()}
              </TableCell>
              <TableCell className="font-comfortaaLight">
                {new Date(booking.checkOut).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-comfortaaBold ${
                    booking.status === "CONFIRMED"
                      ? "bg-green-100 text-green-800"
                      : booking.status === "CANCELLED"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {booking.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setIsViewDialogOpen(true);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setSelectedStatus(booking.status);
                      setIsStatusDialogOpen(true);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-comfortaaBold text-primary">
            Booking Management
          </h1>
        </div>

        {isMobileView ? (
          <div className="space-y-4">{bookings.map(renderBookingCard)}</div>
        ) : (
          renderBookingTable()
        )}

        {/* View Details Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="w-[95vw] max-w-xl max-h-[90vh] overflow-y-auto p-0">
            {/* Header Section with Status */}
            <div className="sticky top-0 z-10 bg-white border-b p-4 sm:p-6">
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl font-comfortaaBold flex items-center justify-between">
                  <span>Booking Details</span>
                  <span
                    className={`text-sm px-3 py-1 rounded-full 
            ${
              selectedBooking?.status === "CONFIRMED"
                ? "bg-green-100 text-green-800"
                : selectedBooking?.status === "CANCELLED"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
                  >
                    {selectedBooking?.status}
                  </span>
                </DialogTitle>
              </DialogHeader>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              {/* Guest Information Card */}
              <div className="rounded-lg border bg-card">
                <div className="bg-muted px-4 py-3 rounded-t-lg border-b">
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    Guest Information
                  </h3>
                </div>
                <div className="p-4">
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold">
                      {selectedBooking?.fullName}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-sm h-9 px-3"
                      onClick={() =>
                        (window.location.href = `tel:${selectedBooking?.phoneNo}`)
                      }
                    >
                      <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">
                        {selectedBooking?.phoneNo}
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-sm h-9 px-3"
                      onClick={() =>
                        (window.location.href = `mailto:${selectedBooking?.email}`)
                      }
                    >
                      <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{selectedBooking?.email}</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Booking Details Card */}
              <div className="rounded-lg border bg-card">
                <div className="bg-muted px-4 py-3 rounded-t-lg border-b">
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    Booking Information
                  </h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <div className="col-span-2">
                      <Label className="text-xs text-muted-foreground mb-1">
                        Hotel
                      </Label>
                      <p className="text-sm font-medium">
                        {selectedBooking?.hotel.name}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs text-muted-foreground mb-1">
                        Location
                      </Label>
                      <p className="text-sm font-medium">
                        {selectedBooking?.location.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stay Details Card */}
              <div className="rounded-lg border bg-card">
                <div className="bg-muted px-4 py-3 rounded-t-lg border-b">
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    Stay Details
                  </h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1">
                        Check-in
                      </Label>
                      <p className="text-sm font-medium">
                        {new Date(
                          selectedBooking?.checkIn || ""
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1">
                        Check-out
                      </Label>
                      <p className="text-sm font-medium">
                        {new Date(
                          selectedBooking?.checkOut || ""
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1">
                        Adults
                      </Label>
                      <p className="text-sm font-medium">
                        {selectedBooking?.adults}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1">
                        Children
                      </Label>
                      <p className="text-sm font-medium">
                        {selectedBooking?.childrens}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                  className="h-9"
                >
                  Close
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    setSelectedBooking(selectedBooking);
                    setSelectedStatus(selectedBooking?.status || "PENDING");
                    setIsStatusDialogOpen(true);
                  }}
                  className="h-9"
                >
                  Update Status
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Update Status Dialog */}
        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Update Booking Status</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={selectedStatus}
                  onValueChange={(
                    value: "PENDING" | "CONFIRMED" | "CANCELLED"
                  ) => setSelectedStatus(value)}
                >
                  <SelectTrigger className="font-comfortaaRegular">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleStatusUpdate}
                className="w-full font-comfortaaBold"
              >
                Update Status
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                booking for {selectedBooking?.fullName} from{" "}
                {new Date(selectedBooking?.checkIn || "").toLocaleDateString()}{" "}
                to{" "}
                {new Date(selectedBooking?.checkOut || "").toLocaleDateString()}
                .
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="font-comfortaaRegular">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 font-comfortaaBold"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

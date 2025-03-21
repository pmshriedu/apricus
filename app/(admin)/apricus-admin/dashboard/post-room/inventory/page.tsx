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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, RefreshCw, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

import type { DateRange } from "react-day-picker";
import { format, addDays, isWithinInterval } from "date-fns";
import { DatePickerWithRange } from "@/utils/date-picker";

type Hotel = {
  id: string;
  name: string;
};

type RoomInventory = {
  id: string;
  name: string;
  price: number;
  capacity: number;
  totalCount: number;
  activeBookings: number;
  availableCount: number;
  occupancyRate: string;
  createdAt: string;
  updatedAt: string;
};

type BookingData = {
  id: string;
  roomId: string;
  bookingId: string;
  roomName: string;
  guestName: string;
  email: string;
  status: string;
  checkIn: Date;
  checkOut: Date;
};

export default function DateBasedInventoryManagement() {
  const { toast } = useToast();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotelId, setSelectedHotelId] = useState<string>("");
  const [roomInventory, setRoomInventory] = useState<RoomInventory[]>([]);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRoom] = useState<RoomInventory | null>(null);
  const [editedCount, setEditedCount] = useState<string>("");
  const [inventoryChanges, setInventoryChanges] = useState<
    Record<string, number>
  >({});
  const [, setIsSaving] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarView, setIsCalendarView] = useState(false);

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    if (selectedHotelId) {
      fetchRoomInventory();
      fetchBookings();
    }
  }, [selectedHotelId, dateRange]);

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

  const fetchRoomInventory = async () => {
    if (!selectedHotelId) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/hotel/${selectedHotelId}/rooms/inventory`
      );
      const { success, data } = await response.json();
      if (success) {
        setRoomInventory(data);
        setInventoryChanges({});
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to fetch room inventory",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookings = async () => {
    if (!selectedHotelId || !dateRange?.from || !dateRange?.to) return;

    try {
      setIsLoading(true);
      const searchParams = new URLSearchParams({
        checkIn: dateRange.from.toISOString(),
        checkOut: dateRange.to
          ? dateRange.to.toISOString()
          : addDays(dateRange.from, 1).toISOString(),
      });

      // Use the real API endpoint we just created
      const response = await fetch(
        `/api/hotel/${selectedHotelId}/bookings/active?${searchParams.toString()}`
      );
      const { success, data } = await response.json();

      if (success) {
        setBookings(
          data.map(
            (booking: {
              checkIn: string;
              checkOut: string;
              id: string;
              roomId: string;
              bookingId: string;
              roomName: string;
              guestName: string;
              email: string;
              status: string;
            }) => ({
              ...booking,
              checkIn: new Date(booking.checkIn),
              checkOut: new Date(booking.checkOut),
            })
          )
        );
      } else {
        throw new Error("Failed to fetch bookings");
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive",
      });
      // Set empty bookings instead of mock data
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getDateAvailability = (roomId: string, date: Date) => {
    const room = roomInventory.find((r) => r.id === roomId);
    if (!room) return { total: 0, available: 0 };

    const totalRooms = room.totalCount;

    // Count bookings for this room on this date
    const bookedCount = bookings.filter(
      (booking) =>
        booking.roomId === roomId &&
        isWithinInterval(date, {
          start: new Date(booking.checkIn),
          end: new Date(booking.checkOut),
        })
    ).length;

    return {
      total: totalRooms,
      available: totalRooms - bookedCount,
    };
  };

  // const handleEditInventory = (room: RoomInventory) => {
  //   setSelectedRoom(room);
  //   setEditedCount(room.totalCount.toString());
  //   setIsEditDialogOpen(true);
  // };

  const handleCountChange = (roomId: string, newCount: string) => {
    const countValue = parseInt(newCount);
    if (!isNaN(countValue) && countValue >= 0) {
      setInventoryChanges({
        ...inventoryChanges,
        [roomId]: countValue,
      });
    }
  };

  const updateSingleRoomInventory = async () => {
    if (!selectedRoom || !editedCount) return;

    try {
      const countValue = parseInt(editedCount);
      if (isNaN(countValue) || countValue < 0) {
        toast({
          title: "Error",
          description: "Please enter a valid number of rooms",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(
        `/api/hotel/${selectedHotelId}/rooms/inventory`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomId: selectedRoom.id,
            totalCount: countValue,
          }),
        }
      );

      const { success } = await response.json();
      if (success) {
        toast({
          title: "Success",
          description: "Room inventory updated successfully",
        });
        fetchRoomInventory();
        setIsEditDialogOpen(false);
      } else {
        throw new Error("Failed to update inventory");
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to update room inventory",
        variant: "destructive",
      });
    }
  };

  const saveBulkInventoryChanges = async () => {
    if (Object.keys(inventoryChanges).length === 0) return;

    try {
      setIsSaving(true);
      const updates = Object.entries(inventoryChanges).map(
        ([roomId, totalCount]) => ({
          roomId,
          totalCount,
        })
      );

      const response = await fetch(
        `/api/hotel/${selectedHotelId}/rooms/inventory`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ updates }),
        }
      );

      const { success } = await response.json();
      if (success) {
        toast({
          title: "Success",
          description: "Room inventory updated successfully",
        });
        fetchRoomInventory();
      } else {
        throw new Error("Failed to update inventory");
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to update room inventory",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getOccupancyBadgeColor = (available: number, total: number) => {
    if (total === 0) return "bg-gray-500";
    const rate = ((total - available) / total) * 100;
    if (rate >= 80) return "bg-red-500";
    if (rate >= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  const renderDateSpecificInventory = () => {
    if (!selectedDate) return null;

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>
            Inventory for {format(selectedDate, "MMMM d, yyyy")}
          </CardTitle>
          <CardDescription>
            Room availability for the selected date
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-comfortaaBold">Room Type</TableHead>
                <TableHead className="font-comfortaaBold">Capacity</TableHead>
                <TableHead className="font-comfortaaBold">
                  Price/Night
                </TableHead>
                <TableHead className="font-comfortaaBold">
                  Total Rooms
                </TableHead>
                <TableHead className="font-comfortaaBold">Available</TableHead>
                <TableHead className="font-comfortaaBold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roomInventory.map((room) => {
                const { total, available } = getDateAvailability(
                  room.id,
                  selectedDate
                );
                return (
                  <TableRow key={room.id}>
                    <TableCell className="font-comfortaaBold">
                      {room.name}
                    </TableCell>
                    <TableCell>{room.capacity} person(s)</TableCell>
                    <TableCell>${room.price.toFixed(2)}</TableCell>
                    <TableCell>{total}</TableCell>
                    <TableCell>
                      {available}/{total}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${getOccupancyBadgeColor(
                          available,
                          total
                        )} font-comfortaaRegular`}
                      >
                        {available === 0
                          ? "Fully Booked"
                          : available < total
                          ? "Partially Available"
                          : "Fully Available"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  const renderCalendarView = () => {
    if (!dateRange?.from || !dateRange?.to) return null;

    // Generate dates between from and to
    const dates: Date[] = [];
    const startDate = new Date(dateRange.from);
    const endDate = dateRange.to || new Date(startDate);
    for (
      let i = 0;
      i <=
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      i++
    ) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }

    return (
      <Card className="mt-6 overflow-x-auto">
        <CardHeader>
          <CardTitle>Calendar View</CardTitle>
          <CardDescription>
            Room availability calendar for selected date range
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-w-max">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-comfortaaBold sticky left-0 bg-white">
                    Room Type
                  </TableHead>
                  {dates.map((date) => (
                    <TableHead
                      key={date.toISOString()}
                      className="font-comfortaaRegular text-center"
                    >
                      {format(date, "MMM d")}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {roomInventory.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-comfortaaBold sticky left-0 bg-white">
                      {room.name}
                    </TableCell>
                    {dates.map((date) => {
                      const { total, available } = getDateAvailability(
                        room.id,
                        date
                      );
                      return (
                        <TableCell
                          key={date.toISOString()}
                          className={`text-center ${
                            available === 0
                              ? "bg-red-100"
                              : available < total
                              ? "bg-yellow-100"
                              : "bg-green-100"
                          }`}
                          onClick={() => setSelectedDate(date)}
                        >
                          {available}/{total}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-comfortaaBold text-primary">
            Date-Based Inventory Management
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
              onClick={fetchRoomInventory}
              variant="outline"
              className="font-comfortaaRegular"
              disabled={!selectedHotelId || isLoading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={() => setIsCalendarView(!isCalendarView)}
              variant="outline"
              className="font-comfortaaRegular"
            >
              <Calendar className="w-4 h-4 mr-2" />
              {isCalendarView ? "Hide Calendar" : "Show Calendar"}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Date Range Filter</CardTitle>
            <CardDescription>
              Select a date range to view availability
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
                  onClick={() => setSelectedDate(new Date())}
                  variant="outline"
                >
                  Today
                </Button>
                <Button
                  onClick={() => setSelectedDate(new Date("2025-03-12"))}
                  variant="outline"
                >
                  Mar 12
                </Button>
                <Button
                  onClick={() => setSelectedDate(new Date("2025-03-15"))}
                  variant="outline"
                >
                  Mar 15
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Rooms</CardTitle>
              <CardDescription>Across all room types</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {roomInventory.reduce((sum, room) => sum + room.totalCount, 0)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Available Today</CardTitle>
              <CardDescription>Currently not booked</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {roomInventory.reduce((sum, room) => {
                  const { available } = getDateAvailability(
                    room.id,
                    new Date()
                  );
                  return sum + available;
                }, 0)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>
                Available on {format(selectedDate, "MMM d")}
              </CardTitle>
              <CardDescription>Selected date availability</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {roomInventory.reduce((sum, room) => {
                  const { available } = getDateAvailability(
                    room.id,
                    selectedDate
                  );
                  return sum + available;
                }, 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        {isCalendarView && renderCalendarView()}
        {renderDateSpecificInventory()}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Overall Room Inventory</CardTitle>
            <CardDescription>
              Manage total room count and monitor availability
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedHotelId ? (
              <div className="p-8 text-center text-gray-500 font-comfortaaRegular">
                Please select a hotel to view room inventory
              </div>
            ) : isLoading ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : roomInventory.length === 0 ? (
              <div className="p-8 text-center text-gray-500 font-comfortaaRegular">
                No rooms found for this hotel.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-comfortaaBold">
                      Room Type
                    </TableHead>
                    <TableHead className="font-comfortaaBold">
                      Capacity
                    </TableHead>
                    <TableHead className="font-comfortaaBold">
                      Price/Night
                    </TableHead>
                    <TableHead className="font-comfortaaBold">
                      Total Rooms
                    </TableHead>
                    <TableHead className="font-comfortaaBold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roomInventory.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-comfortaaRegular">
                        {room.name}
                      </TableCell>
                      <TableCell className="font-comfortaaRegular">
                        {room.capacity} person(s)
                      </TableCell>
                      <TableCell className="font-comfortaaRegular">
                        ${room.price.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {inventoryChanges[room.id] !== undefined ? (
                          <Input
                            type="number"
                            value={inventoryChanges[room.id]}
                            onChange={(e) =>
                              handleCountChange(room.id, e.target.value)
                            }
                            className="w-20 font-comfortaaRegular"
                            min="0"
                          />
                        ) : (
                          <span className="font-comfortaaRegular">
                            {room.totalCount}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {inventoryChanges[room.id] === undefined ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleCountChange(
                                  room.id,
                                  room.totalCount.toString()
                                )
                              }
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newChanges = { ...inventoryChanges };
                                  delete newChanges[room.id];
                                  setInventoryChanges(newChanges);
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => {
                                  // Call the function to update the inventory for this room
                                  saveBulkInventoryChanges();
                                }}
                              >
                                Update
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Edit Room Inventory Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Room Inventory</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="room-name">Room Type</Label>
                <Input
                  id="room-name"
                  value={selectedRoom?.name || ""}
                  disabled
                  className="font-comfortaaRegular"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-count">Current Inventory</Label>
                <Input
                  id="current-count"
                  value={selectedRoom?.totalCount.toString() || ""}
                  disabled
                  className="font-comfortaaRegular"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-count">New Total Room Count</Label>
                <Input
                  id="new-count"
                  type="number"
                  value={editedCount}
                  onChange={(e) => setEditedCount(e.target.value)}
                  min="0"
                  className="font-comfortaaRegular"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancelss
              </Button>
              <Button onClick={updateSingleRoomInventory}>
                Update Inventory
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

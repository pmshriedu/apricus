// app/(admin)/apricus-admin/dashboard/booking-calendar/page.tsx
"use client";

import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BookingCalendar from "@/components/calender-view/page";

export default function BookingCalendarPage() {
  return (
    <div className="container mx-auto py-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Room Booking Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            View and manage room bookings across all hotels and locations. The
            calendar shows room occupancy with guest information and booking
            status.
          </p>
        </CardContent>
      </Card>

      <BookingCalendar />
    </div>
  );
}

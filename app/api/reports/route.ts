// app/api/reports/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";
import { authOptions } from "../auth/[...nextauth]/auth-options";

// Type definitions
interface HotelCustomer {
  hotelId: string;
  hotelName: string;
  customers: Set<string>;
  totalBookings: number;
}

interface HotelCustomerReport {
  hotelName: string;
  uniqueCustomers: number;
  totalBookings: number;
}

interface HotelRevenue {
  hotelId: string;
  hotelName: string;
  totalRevenue: number;
  transactionCount: number;
  averageTransaction: number;
}

interface HotelRevenueReport {
  hotelName: string;
  totalRevenue: string;
  transactionCount: number;
  averageTransaction: string;
}

interface StatusGroup {
  status: string;
  count: number;
  hotels: Record<string, { hotelName: string; count: number }>;
}

interface BookingStatusReport {
  status: string;
  count: number;
  hotelBreakdown: string;
  percentage: string;
}

interface MonthlyRevenueData {
  month: string;
  revenue: number;
  transactionCount: number;
  discountAmount: number;
}

interface MonthlyRevenueReport {
  month: string;
  revenue: string;
  transactionCount: number;
  averageTransaction: string;
  discountAmount: string;
  netRevenue: string;
}

interface LocationStats {
  locationName: string;
  bookingCount: number;
  revenue: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
}

interface LocationPerformanceReport {
  locationName: string;
  totalBookings: number;
  totalRevenue: string;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  confirmationRate: string;
}

export async function GET(req: NextRequest) {
  // Check authentication
  const session = await getServerSession(authOptions);

  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "STAFF")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse query parameters
  const url = new URL(req.url);
  const reportType = url.searchParams.get("type");
  const format = url.searchParams.get("format") || "json";
  const startDate = url.searchParams.get("startDate")
    ? new Date(url.searchParams.get("startDate") as string)
    : new Date(new Date().setMonth(new Date().getMonth() - 1));
  const endDate = url.searchParams.get("endDate")
    ? new Date(url.searchParams.get("endDate") as string)
    : new Date();

  try {
    let data;
    let fileName;

    switch (reportType) {
      case "customers-by-hotel":
        data = await getCustomersByHotel(startDate, endDate);
        fileName = "customers-by-hotel-report";
        break;

      case "revenue-by-hotel":
        data = await getRevenueByHotel(startDate, endDate);
        fileName = "revenue-by-hotel-report";
        break;

      case "bookings-by-status":
        data = await getBookingsByStatus(startDate, endDate);
        fileName = "bookings-by-status-report";
        break;

      case "revenue-monthly":
        data = await getMonthlyRevenue(startDate, endDate);
        fileName = "monthly-revenue-report";
        break;

      case "locations-performance":
        data = await getLocationsPerformance(startDate, endDate);
        fileName = "locations-performance-report";
        break;

      default:
        return NextResponse.json(
          { error: "Invalid report type" },
          { status: 400 }
        );
    }

    // Return data in requested format
    if (format === "excel") {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);

      XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
      const excelBuffer = XLSX.write(workbook, {
        type: "buffer",
        bookType: "xlsx",
      });

      return new NextResponse(excelBuffer, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${fileName}-${
            new Date().toISOString().split("T")[0]
          }.xlsx"`,
        },
      });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Reports API error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}

// Helper functions for different report types
async function getCustomersByHotel(
  startDate: Date,
  endDate: Date
): Promise<HotelCustomerReport[]> {
  const bookings = await prisma.booking.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      hotel: true,
    },
  });

  // Group bookings by hotel and count unique customers (by email)
  const hotelCustomers = bookings.reduce(
    (acc: Record<string, HotelCustomer>, booking) => {
      const hotelId = booking.hotelId;
      if (!acc[hotelId]) {
        acc[hotelId] = {
          hotelId: hotelId,
          hotelName: booking.hotel.name,
          customers: new Set(),
          totalBookings: 0,
        };
      }

      acc[hotelId].customers.add(booking.email);
      acc[hotelId].totalBookings++;

      return acc;
    },
    {}
  );

  // Format for export
  return Object.values(hotelCustomers).map((item) => ({
    hotelName: item.hotelName,
    uniqueCustomers: item.customers.size,
    totalBookings: item.totalBookings,
  }));
}

async function getRevenueByHotel(
  startDate: Date,
  endDate: Date
): Promise<HotelRevenueReport[]> {
  const transactions = await prisma.transaction.findMany({
    where: {
      status: "COMPLETED",
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      booking: {
        include: {
          hotel: true,
        },
      },
    },
  });

  // Group transactions by hotel and calculate revenue
  const hotelRevenue = transactions.reduce(
    (acc: Record<string, HotelRevenue>, transaction) => {
      if (!transaction.booking) return acc;

      const hotelId = transaction.booking.hotelId;
      const hotelName = transaction.booking.hotel.name;

      if (!acc[hotelId]) {
        acc[hotelId] = {
          hotelId: hotelId,
          hotelName: hotelName,
          totalRevenue: 0,
          transactionCount: 0,
          averageTransaction: 0,
        };
      }

      acc[hotelId].totalRevenue += transaction.totalAmount || 0;
      acc[hotelId].transactionCount++;

      return acc;
    },
    {}
  );

  // Calculate average transaction value
  Object.values(hotelRevenue).forEach((hotel) => {
    hotel.averageTransaction =
      hotel.transactionCount > 0
        ? hotel.totalRevenue / hotel.transactionCount
        : 0;
  });

  // Format for export
  return Object.values(hotelRevenue).map((hotel) => ({
    hotelName: hotel.hotelName,
    totalRevenue: hotel.totalRevenue.toFixed(2),
    transactionCount: hotel.transactionCount,
    averageTransaction: hotel.averageTransaction.toFixed(2),
  }));
}

async function getBookingsByStatus(
  startDate: Date,
  endDate: Date
): Promise<BookingStatusReport[]> {
  const bookings = await prisma.booking.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      hotel: true,
    },
  });

  // Group by status
  const statusGroups = bookings.reduce(
    (acc: Record<string, StatusGroup>, booking) => {
      const status = booking.status;

      if (!acc[status]) {
        acc[status] = {
          status,
          count: 0,
          hotels: {},
        };
      }

      acc[status].count++;

      // Also track by hotel
      if (!acc[status].hotels[booking.hotelId]) {
        acc[status].hotels[booking.hotelId] = {
          hotelName: booking.hotel.name,
          count: 0,
        };
      }

      acc[status].hotels[booking.hotelId].count++;

      return acc;
    },
    {}
  );

  // Format for export - flattened structure
  const result: BookingStatusReport[] = [];

  for (const status in statusGroups) {
    result.push({
      status,
      count: statusGroups[status].count,
      hotelBreakdown: "All Hotels",
      percentage: "100",
    });

    const totalCount = statusGroups[status].count;

    for (const hotelId in statusGroups[status].hotels) {
      const hotel = statusGroups[status].hotels[hotelId];
      result.push({
        status,
        count: hotel.count,
        hotelBreakdown: hotel.hotelName,
        percentage: ((hotel.count / totalCount) * 100).toFixed(1),
      });
    }
  }

  return result;
}

async function getMonthlyRevenue(
  startDate: Date,
  endDate: Date
): Promise<MonthlyRevenueReport[]> {
  const transactions = await prisma.transaction.findMany({
    where: {
      status: "COMPLETED",
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  // Group by month
  const monthlyRevenue = transactions.reduce(
    (acc: Record<string, MonthlyRevenueData>, transaction) => {
      const date = new Date(transaction.createdAt);
      const monthYear = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!acc[monthYear]) {
        acc[monthYear] = {
          month: monthYear,
          revenue: 0,
          transactionCount: 0,
          discountAmount: 0,
        };
      }

      acc[monthYear].revenue += transaction.totalAmount || 0;
      acc[monthYear].transactionCount++;
      acc[monthYear].discountAmount += transaction.discountAmount || 0;

      return acc;
    },
    {}
  );

  // Format and sort by month
  return Object.values(monthlyRevenue)
    .map((item) => ({
      month: item.month,
      revenue: item.revenue.toFixed(2),
      transactionCount: item.transactionCount,
      averageTransaction: (item.revenue / item.transactionCount).toFixed(2),
      discountAmount: item.discountAmount.toFixed(2),
      netRevenue: (item.revenue - item.discountAmount).toFixed(2),
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

async function getLocationsPerformance(
  startDate: Date,
  endDate: Date
): Promise<LocationPerformanceReport[]> {
  const bookings = await prisma.booking.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      location: true,
      transaction: true,
    },
  });

  // Group by location
  const locationStats = bookings.reduce(
    (acc: Record<string, LocationStats>, booking) => {
      const locationId = booking.locationId;

      if (!acc[locationId]) {
        acc[locationId] = {
          locationName: booking.location.name,
          bookingCount: 0,
          revenue: 0,
          confirmedBookings: 0,
          pendingBookings: 0,
          cancelledBookings: 0,
        };
      }

      acc[locationId].bookingCount++;

      // Track revenue from completed transactions
      if (booking.transaction && booking.transaction.status === "COMPLETED") {
        acc[locationId].revenue += booking.transaction.totalAmount || 0;
      }

      // Track booking status counts
      switch (booking.status) {
        case "CONFIRMED":
          acc[locationId].confirmedBookings++;
          break;
        case "PENDING":
          acc[locationId].pendingBookings++;
          break;
        case "CANCELLED":
          acc[locationId].cancelledBookings++;
          break;
      }

      return acc;
    },
    {}
  );

  // Format for export
  return Object.values(locationStats).map((location) => ({
    locationName: location.locationName,
    totalBookings: location.bookingCount,
    totalRevenue: location.revenue.toFixed(2),
    confirmedBookings: location.confirmedBookings,
    pendingBookings: location.pendingBookings,
    cancelledBookings: location.cancelledBookings,
    confirmationRate:
      ((location.confirmedBookings / location.bookingCount) * 100).toFixed(1) +
      "%",
  }));
}

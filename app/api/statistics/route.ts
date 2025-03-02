import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Disable caching for this route
export const revalidate = 0;

export async function GET() {
  try {
    const now = new Date();
    const firstDayLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );
    const firstDayTwoMonthsAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 2,
      1
    );
    const lastWeek = new Date(now);
    lastWeek.setDate(now.getDate() - 7);

    // Fetch all statistics in parallel
    const [
      totalContacts,
      lastMonthContacts,
      lastWeekContacts,
      twoMonthsAgoContacts,
      totalBookings,
      confirmedBookings,
      pendingBookings,
      lastMonthBookings,
      twoMonthsAgoBookings,
      totalLocations,
      lastMonthLocations,
      twoMonthsAgoLocations,
      totalHotels,
      lastMonthHotels,
      twoMonthsAgoHotels,
      totalTransactions,
      lastMonthTransactions,
      twoMonthsAgoTransactions,
      totalRevenue,
      lastMonthRevenue,
      twoMonthsAgoRevenue,
    ] = await Promise.all([
      // Contact statistics
      prisma.contact.count(),
      prisma.contact.count({
        where: {
          createdAt: {
            gte: firstDayLastMonth,
          },
        },
      }),
      prisma.contact.count({
        where: {
          createdAt: {
            gte: lastWeek,
          },
        },
      }),
      prisma.contact.count({
        where: {
          createdAt: {
            gte: firstDayTwoMonthsAgo,
            lt: firstDayLastMonth,
          },
        },
      }),

      // Booking statistics
      prisma.booking.count(),
      prisma.booking.count({
        where: {
          status: "CONFIRMED",
        },
      }),
      prisma.booking.count({
        where: {
          status: "PENDING",
        },
      }),
      prisma.booking.count({
        where: {
          createdAt: {
            gte: firstDayLastMonth,
          },
        },
      }),
      prisma.booking.count({
        where: {
          createdAt: {
            gte: firstDayTwoMonthsAgo,
            lt: firstDayLastMonth,
          },
        },
      }),

      // Location statistics
      prisma.location.count(),
      prisma.location.count({
        where: {
          createdAt: {
            gte: firstDayLastMonth,
          },
        },
      }),
      prisma.location.count({
        where: {
          createdAt: {
            gte: firstDayTwoMonthsAgo,
            lt: firstDayLastMonth,
          },
        },
      }),

      // Hotel statistics
      prisma.hotel.count(),
      prisma.hotel.count({
        where: {
          createdAt: {
            gte: firstDayLastMonth,
          },
        },
      }),
      prisma.hotel.count({
        where: {
          createdAt: {
            gte: firstDayTwoMonthsAgo,
            lt: firstDayLastMonth,
          },
        },
      }),

      // Transaction statistics
      prisma.transaction.count(),
      prisma.transaction.count({
        where: {
          createdAt: {
            gte: firstDayLastMonth,
          },
        },
      }),
      prisma.transaction.count({
        where: {
          createdAt: {
            gte: firstDayTwoMonthsAgo,
            lt: firstDayLastMonth,
          },
        },
      }),

      // Revenue statistics
      prisma.transaction.aggregate({
        _sum: {
          amount: true,
        },
      }),
      prisma.transaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          createdAt: {
            gte: firstDayLastMonth,
          },
        },
      }),
      prisma.transaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          createdAt: {
            gte: firstDayTwoMonthsAgo,
            lt: firstDayLastMonth,
          },
        },
      }),
    ]);

    // Calculate percentage changes
    const calculatePercentageChange = (current: number, previous: number) => {
      if (previous === 0) return 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    // Safely handle null values for revenue
    const safeRevenueLast = lastMonthRevenue._sum.amount || 0;
    const safeRevenueTwoMonthsAgo = twoMonthsAgoRevenue._sum.amount || 0;
    const totalRevenueValue = totalRevenue._sum.amount || 0;

    // Return the response with headers to prevent caching
    return NextResponse.json(
      {
        contacts: {
          total: totalContacts,
          lastMonth: lastMonthContacts,
          lastWeek: lastWeekContacts,
          percentageChange: calculatePercentageChange(
            lastMonthContacts,
            twoMonthsAgoContacts
          ),
        },
        bookings: {
          total: totalBookings,
          confirmed: confirmedBookings,
          pending: pendingBookings,
          percentageChange: calculatePercentageChange(
            lastMonthBookings,
            twoMonthsAgoBookings
          ),
        },
        locations: {
          total: totalLocations,
          percentageChange: calculatePercentageChange(
            lastMonthLocations,
            twoMonthsAgoLocations
          ),
        },
        hotels: {
          total: totalHotels,
          percentageChange: calculatePercentageChange(
            lastMonthHotels,
            twoMonthsAgoHotels
          ),
        },
        transactions: {
          total: totalTransactions,
          lastMonth: lastMonthTransactions,
          percentageChange: calculatePercentageChange(
            lastMonthTransactions,
            twoMonthsAgoTransactions
          ),
        },
        revenue: {
          total: totalRevenueValue,
          lastMonth: safeRevenueLast,
          percentageChange: calculatePercentageChange(
            safeRevenueLast,
            safeRevenueTwoMonthsAgo
          ),
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0", // Disable caching
          Pragma: "no-cache", // For older browsers
        },
      }
    );
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch dashboard statistics",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

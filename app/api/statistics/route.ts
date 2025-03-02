import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    const lastWeek = new Date(now.setDate(now.getDate() - 7));

    // Contact statistics
    const [
      totalContacts,
      lastMonthContacts,
      lastWeekContacts,
      twoMonthsAgoContacts,
    ] = await Promise.all([
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
    ]);

    // Booking statistics
    const [
      totalBookings,
      confirmedBookings,
      pendingBookings,
      lastMonthBookings,
      twoMonthsAgoBookings,
    ] = await Promise.all([
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
    ]);

    // Location and Hotel statistics
    const [
      totalLocations,
      lastMonthLocations,
      twoMonthsAgoLocations,
      totalHotels,
      lastMonthHotels,
      twoMonthsAgoHotels,
    ] = await Promise.all([
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
    ]);

    // Transaction and Revenue statistics
    const [
      totalTransactions,
      lastMonthTransactions,
      twoMonthsAgoTransactions,
      totalRevenue,
      lastMonthRevenue,
      twoMonthsAgoRevenue,
    ] = await Promise.all([
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

    return NextResponse.json({
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
        total: totalRevenue._sum.amount || 0,
        lastMonth: lastMonthRevenue._sum.amount || 0,
        percentageChange: calculatePercentageChange(
          lastMonthRevenue._sum.amount || 0,
          twoMonthsAgoRevenue._sum.amount || 0
        ),
      },
    });
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

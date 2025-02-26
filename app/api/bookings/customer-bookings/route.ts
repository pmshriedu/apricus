import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get the authenticated user's session
    const session = await getServerSession(authOptions);

    // If no session or user, return unauthorized
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get the user ID from the session
    const userId = session.user.id;

    // Fetch only bookings belonging to the authenticated user
    const bookings = await prisma.booking.findMany({
      where: {
        userId: userId, // Filter by the authenticated user's ID
      },
      include: {
        hotel: {
          select: {
            name: true,
          },
        },
        location: {
          select: {
            name: true,
          },
        },
        transaction: true,
        roomBookings: {
          include: {
            room: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ data: bookings });
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

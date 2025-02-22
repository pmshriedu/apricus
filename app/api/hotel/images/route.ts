import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleSuccess, handleError } from "@/lib/api-helpers";

export async function POST(request: Request) {
  try {
    const { hotelId, imageUrls } = await request.json();

    if (!hotelId || !imageUrls || !imageUrls.length) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Hotel ID and image URLs are required",
        }),
        { status: 400 }
      );
    }

    // Create image records
    const createPromises = imageUrls.map((url: string) =>
      prisma.hotelImage.create({
        data: {
          url, // Use the URL string directly
          hotelId,
        },
      })
    );

    const createdImages = await Promise.all(createPromises);
    return handleSuccess(createdImages);
  } catch (error) {
    return handleError(error);
  }
}

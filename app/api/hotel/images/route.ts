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

    // Check if the hotel exists
    const hotel = await prisma.hotel.findUnique({
      where: {
        id: hotelId,
      },
    });

    if (!hotel) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Hotel not found",
        }),
        { status: 404 }
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get("imageId");

    if (!imageId) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Image ID is required",
        }),
        { status: 400 }
      );
    }

    // Check if the image exists
    const image = await prisma.hotelImage.findUnique({
      where: {
        id: imageId,
      },
    });

    if (!image) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Image not found",
        }),
        { status: 404 }
      );
    }

    // Delete the image
    await prisma.hotelImage.delete({
      where: {
        id: imageId,
      },
    });

    return handleSuccess({ message: "Image deleted successfully" });
  } catch (error) {
    return handleError(error);
  }
}

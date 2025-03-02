import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleSuccess, handleError } from "@/lib/api-helpers";

export async function GET(
  request: Request,
  { params }: { params: { hotelId: string } }
) {
  try {
    const { hotelId } = params;

    const images = await prisma.hotelImage.findMany({
      where: {
        hotelId,
      },
    });

    return handleSuccess(images);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(
  request: Request,
  { params }: { params: { hotelId: string } }
) {
  try {
    const { hotelId } = params;
    const body = await request.json();
    const { imageUrls } = body;

    if (!imageUrls || !imageUrls.length) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Image URLs are required",
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

    // Create multiple images in a single transaction
    const createPromises = imageUrls.map((url: string) =>
      prisma.hotelImage.create({
        data: {
          url,
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

export async function DELETE(
  request: Request,
  { params }: { params: { hotelId: string } }
) {
  try {
    const { hotelId } = params;
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

    // Check if the image exists and belongs to the hotel
    const image = await prisma.hotelImage.findFirst({
      where: {
        id: imageId,
        hotelId,
      },
    });

    if (!image) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Image not found or doesn't belong to this hotel",
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

// app/api/amenities/route.ts

import { prisma } from "@/lib/prisma";
import { handleSuccess, handleError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const amenities = await prisma.amenity.findMany();
    return handleSuccess(amenities);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { name, icon } = await request.json();
    const amenity = await prisma.amenity.create({
      data: { name, icon },
    });
    return handleSuccess(amenity);
  } catch (error) {
    return handleError(error);
  }
}

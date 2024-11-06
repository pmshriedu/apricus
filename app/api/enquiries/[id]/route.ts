// app/api/enquiries/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// DELETE an enquiry
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.enquiry.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: "Enquiry deleted successfully" });
  } catch (error) {
    console.error("Error deleting enquiry:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// UPDATE enquiry status
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = body;

    const updatedEnquiry = await prisma.enquiry.update({
      where: {
        id: params.id,
      },
      data: {
        status,
      },
    });

    return NextResponse.json({ data: updatedEnquiry });
  } catch (error) {
    console.error("Error updating enquiry:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// src/app/api/enquiries/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

import { transporter } from "@/lib/nodemailer";
import { generateEnquiryEmailTemplate } from "@/lib/enquiries-template";

const prisma = new PrismaClient();

// Validation schema matching the frontend
const enquirySchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phoneNumber: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = enquirySchema.parse(body);

    // Create new enquiry in database
    const enquiry = await prisma.enquiry.create({
      data: {
        fullName: validatedData.fullName,
        email: validatedData.email,
        phoneNumber: validatedData.phoneNumber,
      },
    });

    // Send email notifications
    try {
      await transporter.sendMail({
        from: `"Apricus Hotels" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        cc: process.env.SALES_EMAIL, // Optional: Add additional recipients
        subject: `New Customer Enquiry - ${enquiry.fullName}`,
        html: generateEnquiryEmailTemplate(enquiry),
        priority: "high",
      });

      // Send acknowledgment email to customer
      await transporter.sendMail({
        from: `"Apricus Hotels" <${process.env.EMAIL_USER}>`,
        to: enquiry.email,
        subject: "We've Received Your Enquiry - Apricus Hotels",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #C68D07;">Thank You for Your Interest</h2>
            <p>Dear ${enquiry.fullName},</p>
            <p>We have received your enquiry and our team will be in touch with you shortly.</p>
            <p>Your enquiry reference number is: <strong>${enquiry.id}</strong></p>
            <p>We aim to respond to all enquiries within 24 hours.</p>
            <p>Best regards,<br>The Apricus Hotels Team</p>
          </div>
        `,
      });
    } catch (emailError) {
      if (emailError instanceof Error) {
        console.error("Failed to send email:", {
          error: emailError.message,
          stack: emailError.stack,
          errorCode: (emailError as NodeJS.ErrnoException).code ?? "Unknown", // Safe type narrowing
        });
      } else {
        console.error("An unexpected error occurred:", emailError);
      }
    }

    return NextResponse.json(
      { message: "Enquiry submitted successfully", data: enquiry },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating enquiry:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get all enquiries
export async function GET() {
  try {
    const enquiries = await prisma.enquiry.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ data: enquiries });
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

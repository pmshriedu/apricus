// app/api/contact/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { transporter } from "@/lib/nodemailer";
import { generateContactEmailTemplate } from "@/lib/contact-template";

const prisma = new PrismaClient();

// Validation schema for contact form
const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = contactSchema.parse(body);

    // Create new contact entry in database
    const contact = await prisma.contact.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        message: validatedData.message,
      },
    });

    // Send email notifications
    try {
      // Send notification to admin
      await transporter.sendMail({
        from: `"Apricus Hotels" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `New Contact Form Submission - ${contact.name}`,
        html: generateContactEmailTemplate(contact),
      });

      // Send confirmation email to user
      await transporter.sendMail({
        from: `"Apricus Hotels" <${process.env.EMAIL_USER}>`,
        to: contact.email,
        subject: "Thank You for Contacting Apricus Hotels",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #C68D07;">Message Received</h2>
            <p>Dear ${contact.name},</p>
            <p>Thank you for reaching out to us. We have received your message and will get back to you soon.</p>
            <p>Your reference number is: <strong>${contact.id}</strong></p>
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
      { message: "Message sent successfully", data: contact },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ data: contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

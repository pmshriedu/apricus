// app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { transporter } from "@/lib/nodemailer";

import { hash } from "bcrypt";
import { generatePasswordResetEmailTemplate } from "@/lib/password-reset-template";
import { generateRandomPassword } from "@/lib/auth-utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return success even if email not found for security
      return NextResponse.json(
        {
          message:
            "If your email exists in our system, you will receive password reset instructions.",
        },
        { status: 200 }
      );
    }

    // Generate random password
    const randomPassword = generateRandomPassword(10);
    const hashedPassword = await hash(randomPassword, 10);

    // Update user with new password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Send email with temporary password
    await transporter.sendMail({
      from: '"Apricus Hotels" <crs@apricushotels.com>',
      to: user.email,
      subject: "Password Reset - Apricus Hotels",
      html: generatePasswordResetEmailTemplate(
        user.name || "Valued Customer",
        randomPassword
      ),
    });

    return NextResponse.json(
      {
        message:
          "If your email exists in our system, you will receive password reset instructions.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}

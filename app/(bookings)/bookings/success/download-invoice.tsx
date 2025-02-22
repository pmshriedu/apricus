"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import { format } from "date-fns";

interface TransactionBooking {
  id: string;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  childrens: number;
  phoneNo: string | null;
  companyName?: string | null;
  gstNumber?: string | null;
  hotel: {
    name: string;
    location: {
      name: string;
    };
  };
}

interface Transaction {
  id: string;
  userName: string;
  userEmail: string;
  amount: number;
  razorpayPaymentId: string | null;
  createdAt: Date;
  booking: TransactionBooking | null;
}

interface DownloadButtonProps {
  transaction: Transaction;
}

export default function DownloadButton({ transaction }: DownloadButtonProps) {
  const generatePDF = () => {
    const doc = new jsPDF();

    // Set font styles
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);

    // Header
    doc.text("Apricus Hotels - Booking Confirmation", 105, 20, {
      align: "center",
    });

    // Reset font for content
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    const startY = 40;
    const lineHeight = 8;
    let currentY = startY;

    const addLine = (label: string, value: string | null | undefined) => {
      doc.text(`${label}: ${value || "N/A"}`, 20, currentY);
      currentY += lineHeight;
    };

    const addDivider = () => {
      currentY += 5;
      doc.line(20, currentY, 190, currentY);
      currentY += 10;
    };

    // Booking Information
    doc.setFont("helvetica", "bold");
    doc.text("Booking Information", 20, currentY);
    currentY += lineHeight * 1.5;
    doc.setFont("helvetica", "normal");

    if (transaction.booking) {
      addLine("Booking ID", transaction.booking.id);
      addLine("Hotel", transaction.booking.hotel.name);
      addLine("Location", transaction.booking.hotel.location.name);
      addLine("Check-in", format(new Date(transaction.booking.checkIn), "PP"));
      addLine(
        "Check-out",
        format(new Date(transaction.booking.checkOut), "PP")
      );
      addLine(
        "Guests",
        `${transaction.booking.adults} Adults, ${transaction.booking.childrens} Children`
      );
    } else {
      addLine("Booking Details", "Not Available");
    }

    addDivider();

    // Guest Information
    doc.setFont("helvetica", "bold");
    doc.text("Guest Information", 20, currentY);
    currentY += lineHeight * 1.5;
    doc.setFont("helvetica", "normal");

    addLine("Name", transaction.userName);
    addLine("Email", transaction.userEmail);
    addLine("Phone", transaction.booking?.phoneNo || null);
    if (transaction.booking?.companyName)
      addLine("Company", transaction.booking.companyName);
    if (transaction.booking?.gstNumber)
      addLine("GST Number", transaction.booking.gstNumber);

    addDivider();

    // Payment Information
    doc.setFont("helvetica", "bold");
    doc.text("Payment Information", 20, currentY);
    currentY += lineHeight * 1.5;
    doc.setFont("helvetica", "normal");

    addLine("Transaction ID", transaction.id);
    addLine("Payment ID", transaction.razorpayPaymentId);
    addLine("Amount", `Rs. ${transaction.amount.toLocaleString("en-IN")}`);
    addLine("Date", format(new Date(transaction.createdAt), "PPpp"));

    // Footer
    doc.setFontSize(10);
    const footerText = "Thank you for choosing Apricus Hotels";
    doc.text(footerText, 105, 280, { align: "center" });

    // Save the PDF
    doc.save(`apricus-booking-${transaction.id}.pdf`);
  };

  const downloadInvoice = async () => {
    try {
      // First try to get the invoice from the API
      const response = await fetch(`/api/invoice/${transaction.id}`);
      const data = await response.json();

      if (data.status === "success" && data.invoice_url) {
        window.open(data.invoice_url, "_blank");
      } else {
        // Fallback to generating PDF locally
        generatePDF();
      }
    } catch (error) {
      console.error("Error downloading invoice:", error);
      // Fallback to generating PDF locally if API fails
      generatePDF();
    }
  };

  return (
    <Button
      onClick={downloadInvoice}
      className="flex-1 h-12 font-comfortaaBold bg-primary hover:bg-primary/90"
    >
      <Download className="w-4 h-4 mr-2" />
      Download Invoice
    </Button>
  );
}

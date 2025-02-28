"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import { format } from "date-fns";
import autoTable from "jspdf-autotable";

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
  totalAmount: number | null; // Change this to allow null values
  sgst: number | null; // Also make this nullable to be safe
  discountAmount: number | null; // This might also be nullable
  cgst: number | null; // And this
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

    // Add logo
    const logoUrl = "/logo-gold.png";
    const logoWidth = 50;
    const logoHeight = 15;
    doc.addImage(logoUrl, "PNG", 80, 10, logoWidth, logoHeight);

    // Header
    doc.text("Apricus Hotels - Booking Confirmation", 105, 40, {
      align: "center",
    });

    // Reset font for content
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    const startY = 60;
    let currentY = startY;

    // Booking Information Table
    const bookingData = [
      ["Booking ID", transaction.booking?.id || "N/A"],
      ["Hotel", transaction.booking?.hotel.name || "N/A"],
      ["Location", transaction.booking?.hotel.location.name || "N/A"],
      [
        "Check-in",
        transaction.booking
          ? format(new Date(transaction.booking.checkIn), "PP")
          : "N/A",
      ],
      [
        "Check-out",
        transaction.booking
          ? format(new Date(transaction.booking.checkOut), "PP")
          : "N/A",
      ],
      [
        "Guests",
        transaction.booking
          ? `${transaction.booking.adults} Adults, ${transaction.booking.childrens} Children`
          : "N/A",
      ],
    ];

    autoTable(doc, {
      startY: currentY,
      head: [["Booking Information", ""]],
      body: bookingData,
      theme: "striped",
      headStyles: { fillColor: [218, 165, 32], textColor: [255, 255, 255] },
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;

    // Guest Information Table
    const guestData = [
      ["Name", transaction.userName],
      ["Email", transaction.userEmail],
      ["Phone", transaction.booking?.phoneNo || "N/A"],
      ["Company", transaction.booking?.companyName || "N/A"],
      ["GST Number", transaction.booking?.gstNumber || "N/A"],
    ];

    autoTable(doc, {
      startY: currentY,
      head: [["Guest Information", ""]],
      body: guestData,
      theme: "striped",
      headStyles: { fillColor: [218, 165, 32], textColor: [255, 255, 255] },
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;

    // Payment Information Table
    const paymentData = [
      ["Transaction ID", transaction.id],
      ["Payment ID", transaction.razorpayPaymentId || "N/A"],
      [
        "CGST",
        transaction.cgst
          ? `Rs. ${transaction.cgst.toLocaleString("en-IN")}`
          : "N/A",
      ],
      [
        "SGST",
        transaction.sgst
          ? `Rs. ${transaction.sgst.toLocaleString("en-IN")}`
          : "N/A",
      ],
      [
        "Coupon Discount",
        transaction.discountAmount
          ? `Rs. ${transaction.discountAmount.toLocaleString("en-IN")}`
          : "N/A",
      ],
      [
        "Total Amount",
        transaction.totalAmount
          ? `Rs. ${transaction.totalAmount.toLocaleString("en-IN")}`
          : `Rs. ${transaction.amount.toLocaleString("en-IN")}`,
      ],
      ["Date", format(new Date(transaction.createdAt), "PPpp")],
    ];
    autoTable(doc, {
      startY: currentY,
      head: [["Payment Information", ""]],
      body: paymentData,
      theme: "striped",
      headStyles: { fillColor: [218, 165, 32], textColor: [255, 255, 255] },
    });

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

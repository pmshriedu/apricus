"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, Download, Home, Clock } from "lucide-react";
import Link from "next/link";
import { jsPDF } from "jspdf";

interface TransactionDetails {
  id: string;
  amount: number;
  userEmail: string;
  userName: string;
  createdAt: Date;
}

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const [transaction, setTransaction] = useState<TransactionDetails | null>(
    null
  );

  useEffect(() => {
    const transactionId = searchParams.get("transactionId");
    if (!transactionId) return;

    fetch(`/api/transaction/${transactionId}`)
      .then((res) => res.ok && res.json())
      .then(setTransaction)
      .catch((error) =>
        console.error("Failed to fetch transaction details", error)
      );
  }, [searchParams]);

  const generatePDF = () => {
    if (!transaction) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Add company branding
    doc.setFillColor(198, 141, 7);
    doc.rect(0, 0, pageWidth, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Payment Receipt", pageWidth / 2, 25, { align: "center" });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    const startY = 60;
    const lineHeight = 10;

    const details = [
      ["Transaction ID:", transaction.id],
      ["Amount Paid:", `Rs. ${transaction.amount.toFixed(2)}`],
      ["Name:", transaction.userName],
      ["Email:", transaction.userEmail],
      ["Date:", new Date(transaction.createdAt).toLocaleString()],
    ];

    details.forEach(([label, value], index) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 20, startY + index * lineHeight);
      doc.setFont("helvetica", "normal");
      doc.text(value.toString(), 80, startY + index * lineHeight);
    });

    doc.setFontSize(10);
    doc.setTextColor(198, 141, 7);
    doc.text("This is a secure transaction receipt", pageWidth / 2, 240, {
      align: "center",
    });

    doc.save(`receipt-${transaction.id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Logo Section */}
        <div className="flex justify-center mb-4">
          <div className="w-32 h-32 relative">
            <img
              src="/logo-gold.png"
              alt="Apricus"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Success Banner */}
        <div className="bg-gradient-to-r from-[#C68D07] to-[#D6B56F] text-white p-6 rounded-t-xl flex items-center justify-center space-x-3 shadow-lg">
          <CheckCircle className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Payment Successful</h1>
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-xl rounded-b-xl">
          <CardContent className="p-8">
            {transaction ? (
              <div className="space-y-8">
                {/* Security Notice */}
                <div className="flex items-center justify-center space-x-2 text-[#C68D07]">
                  <Shield className="w-5 h-5" />
                  <p className="text-sm font-medium">Secure Transaction</p>
                </div>

                {/* Transaction Details */}
                <div className="bg-gradient-to-br from-[#D6B56F]/5 to-[#D6B56F]/10 rounded-xl p-8 space-y-6 border border-[#D6B56F]/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 font-medium">
                        Transaction ID
                      </p>
                      <p className="font-medium bg-white p-3 rounded-lg border border-gray-100">
                        {transaction.id}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 font-medium">
                        Amount Paid
                      </p>
                      <p className="font-bold text-xl text-[#C68D07] bg-white p-3 rounded-lg border border-gray-100">
                        ₹{transaction.amount.toFixed(2)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 font-medium">Name</p>
                      <p className="font-medium bg-white p-3 rounded-lg border border-gray-100">
                        {transaction.userName}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 font-medium">Email</p>
                      <p className="font-medium bg-white p-3 rounded-lg border border-gray-100">
                        {transaction.userEmail}
                      </p>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <div className="flex items-center space-x-2 text-gray-600 bg-white p-3 rounded-lg border border-gray-100">
                        <Clock className="w-4 h-4" />
                        <p className="text-sm">
                          {new Date(transaction.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <Button
                    asChild
                    variant="outline"
                    className="border-2 border-[#C68D07] text-[#C68D07] hover:bg-[#C68D07] hover:text-white transition-all duration-300 w-full sm:w-auto"
                  >
                    <Link href="/" className="flex items-center space-x-2">
                      <Home className="w-4 h-4" />
                      <span>Back to Home</span>
                    </Link>
                  </Button>
                  <Button
                    onClick={generatePDF}
                    className="bg-gradient-to-r from-[#C68D07] to-[#D6B56F] hover:from-[#B67D06] hover:to-[#C6A55F] text-white w-full sm:w-auto flex items-center justify-center space-x-2 transition-all duration-300"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Receipt</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-12">
                <div className="animate-pulse flex flex-col items-center space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuccessPage;

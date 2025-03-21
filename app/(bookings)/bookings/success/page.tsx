import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import {
  CheckCircle2,
  ArrowLeft,
  MapPin,
  Users,
  Building2,
  Mail,
  Phone,
  Calendar,
  Receipt,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import DownloadButton from "./download-invoice";

interface SuccessPageProps {
  searchParams: {
    transactionId: string;
  };
}

const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
}) => (
  <div className="space-y-2">
    <div className="flex items-center text-gray-600">
      {icon}
      <span className="ml-2 font-comfortaaRegular">{label}</span>
    </div>
    <p className="font-comfortaaMedium text-gray-800">{value || "—"}</p>
  </div>
);

// Loading component
const LoadingState = () => (
  <div className="min-h-screen bg-accent/5 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto">
      <Card className="border-0 shadow-xl overflow-hidden bg-white">
        <div className="bg-primary text-white p-8 text-center">
          <div className="mb-6">
            <div className="bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="h-12 w-12 text-white animate-spin" />
            </div>
            <h1 className="text-2xl font-comfortaaBold mb-2">
              Verifying Payment...
            </h1>
            <p className="text-white/90 font-comfortaaRegular">
              Please wait while we confirm your booking
            </p>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

// Helper function to fetch transaction with retries
async function fetchTransactionWithRetry(
  transactionId: string,
  maxRetries = 5 // Increased retries
) {
  try {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const transaction = await prisma.transaction.findUnique({
          where: { id: transactionId },
          include: {
            booking: {
              include: {
                hotel: {
                  include: {
                    location: true,
                  },
                },
              },
            },
          },
        });

        if (transaction && transaction.status === "SUCCESS") {
          return transaction;
        }

        // If this is not the last attempt, wait before retrying
        if (attempt < maxRetries) {
          // Increased delay between retries
          await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
        }
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
        if (attempt === maxRetries) throw error;
        // Wait before retrying on error
        await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
      }
    }
    return null;
  } catch (error) {
    console.error("Error fetching transaction:", error);
    throw error;
  }
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  if (!searchParams.transactionId) {
    redirect("/");
  }

  try {
    // Use the retry mechanism to fetch transaction
    const transaction = await fetchTransactionWithRetry(
      searchParams.transactionId
    );

    if (!transaction) {
      notFound();
    }

    // Calculate GST breakdown
    const gstRate = transaction.amount > 7500 ? 0.18 : 0.12;
    const sgst = transaction.amount * (gstRate / 2);
    const cgst = transaction.amount * (gstRate / 2);
    const totalAmountWithTax = transaction.amount * (1 + gstRate);

    const formattedAmount = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(totalAmountWithTax);

    const formattedDate = new Intl.DateTimeFormat("en-IN", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(transaction.createdAt);

    const formatBookingDate = (date: Date) => {
      return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);
    };

    return (
      <div className="min-h-screen bg-accent/5 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Card className="border-0 shadow-xl overflow-hidden bg-white">
            {/* Success Header */}
            <div className="bg-primary text-white p-8 text-center">
              <div className="mb-6">
                <div className="bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-12 w-12 text-white" />
                </div>
                <h1 className="text-2xl font-comfortaaBold mb-2">
                  Booking Confirmed!
                </h1>
                <p className="text-white/90 font-comfortaaRegular">
                  Thank you for choosing {transaction.booking?.hotel?.name}
                </p>
              </div>
            </div>

            <CardContent className="p-8">
              <div className="space-y-8">
                {/* Booking Details */}
                <section>
                  <h2 className="text-xl font-comfortaaBold text-gray-800 mb-6">
                    Booking Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoItem
                      icon={<MapPin className="w-4 h-4" />}
                      label="Location"
                      value={transaction.booking?.hotel?.location?.name ?? null}
                    />
                    <InfoItem
                      icon={<Building2 className="w-4 h-4" />}
                      label="Hotel"
                      value={transaction.booking?.hotel?.name ?? null}
                    />
                    <InfoItem
                      icon={<Calendar className="w-4 h-4" />}
                      label="Check-in"
                      value={formatBookingDate(
                        transaction.booking?.checkIn ?? new Date()
                      )}
                    />
                    <InfoItem
                      icon={<Calendar className="w-4 h-4" />}
                      label="Check-out"
                      value={formatBookingDate(
                        transaction.booking?.checkOut ?? new Date()
                      )}
                    />
                    <InfoItem
                      icon={<Users className="w-4 h-4" />}
                      label="Guests"
                      value={`${transaction.booking?.adults} Adults, ${transaction.booking?.childrens} Children`}
                    />
                  </div>
                </section>

                <Separator className="bg-gray-200" />

                {/* Guest Information */}
                <section>
                  <h2 className="text-xl font-comfortaaBold text-gray-800 mb-6">
                    Guest Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoItem
                      icon={<Users className="w-4 h-4" />}
                      label="Full Name"
                      value={transaction.userName}
                    />
                    <InfoItem
                      icon={<Mail className="w-4 h-4" />}
                      label="Email"
                      value={transaction.userEmail}
                    />
                    <InfoItem
                      icon={<Phone className="w-4 h-4" />}
                      label="Phone Number"
                      value={transaction.booking?.phoneNo ?? null}
                    />
                    {transaction.booking?.companyName && (
                      <InfoItem
                        icon={<Building2 className="w-4 h-4" />}
                        label="Company Name"
                        value={transaction.booking.companyName}
                      />
                    )}
                    {transaction.booking?.gstNumber && (
                      <InfoItem
                        icon={<Receipt className="w-4 h-4" />}
                        label="GST Number"
                        value={transaction.booking.gstNumber}
                      />
                    )}
                  </div>
                </section>

                <Separator className="bg-gray-200" />

                {/* Payment Information */}
                <section>
                  <h2 className="text-xl font-comfortaaBold text-gray-800 mb-6">
                    Payment Information
                  </h2>
                  <div className="bg-accent/5 p-6 rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-comfortaaRegular">
                        Subtotal
                      </span>
                      <span className="font-comfortaaMedium">
                        ₹{transaction.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-comfortaaRegular">
                        SGST {gstRate === 0.18 ? "(9%)" : "(6%)"}
                      </span>
                      <span className="font-comfortaaMedium">
                        ₹{sgst.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-comfortaaRegular">
                        CGST {gstRate === 0.18 ? "(9%)" : "(6%)"}
                      </span>
                      <span className="font-comfortaaMedium">
                        ₹{cgst.toFixed(2)}
                      </span>
                    </div>
                    {transaction.discountAmount &&
                    transaction.discountAmount > 0 ? (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-comfortaaRegular">
                          Discount Applied
                        </span>
                        <span className="font-comfortaaMedium text-green-600">
                          -₹{transaction.discountAmount.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <div></div>
                    )}
                    <Separator className="bg-gray-200" />
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-comfortaaRegular">
                        Total Amount (Inc. GST)
                      </span>
                      <span className="text-xl font-comfortaaBold text-primary">
                        {formattedAmount}
                      </span>
                    </div>
                    <Separator className="bg-gray-200" />
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-comfortaaRegular">
                        Transaction ID
                      </span>
                      <span className="font-comfortaaMedium">
                        {transaction.id}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-comfortaaRegular">
                        Payment Method
                      </span>
                      <span className="font-comfortaaMedium">
                        {transaction.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-comfortaaRegular">
                        Payment Date
                      </span>
                      <span className="font-comfortaaMedium">
                        {formattedDate}
                      </span>
                    </div>
                  </div>
                </section>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Link href="/" className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full h-12 font-comfortaaBold"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Home
                    </Button>
                  </Link>
                  <DownloadButton transaction={transaction} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in success page:", error);
    // Show loading state while retrying
    return <LoadingState />;
  }
}

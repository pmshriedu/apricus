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

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  if (!searchParams.transactionId) {
    redirect("/");
  }

  const transaction = await prisma.transaction.findUnique({
    where: { id: searchParams.transactionId },
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

  if (!transaction || transaction.status !== "SUCCESS") {
    notFound();
  }

  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(transaction.amount);

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
                      Amount Paid
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
                      Payment Date
                    </span>
                    <span className="font-comfortaaMedium">
                      {formattedDate}
                    </span>
                  </div>
                  {transaction.razorpayPaymentId && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-comfortaaRegular">
                        Razorpay ID
                      </span>
                      <span className="font-comfortaaMedium">
                        {transaction.razorpayPaymentId}
                      </span>
                    </div>
                  )}
                </div>
              </section>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 h-12 font-comfortaaBold border-gray-200"
                >
                  <Link href="/" className="flex items-center justify-center">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Return to Home
                  </Link>
                </Button>
                <DownloadButton transaction={transaction} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

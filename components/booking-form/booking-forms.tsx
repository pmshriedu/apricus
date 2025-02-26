"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  CreditCard,
  User,
  Mail,
  Phone,
  Building2,
  FileText,
  Calendar,
  Users,
  Home,
  Clock,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Define Razorpay response types
interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayErrorResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: string;
  };
}

// Define RazorpayOptions interface
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void;
  modal: {
    ondismiss: () => void;
  };
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

// Define RazorpayInstance interface
interface RazorpayInstance {
  on: (
    event: string,
    callback: (response: RazorpayErrorResponse) => void
  ) => void;
  open: () => void;
  close: () => void;
}

// Extend the Window interface to include Razorpay
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RoomData {
  roomId: string;
  roomName: string;
  hotelId: string;
  hotelName: string;
  locationId: string;
  locationName: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  childrens: number;
  price: number;
}

interface BookingPaymentFormProps {
  roomData: RoomData;
}

export default function BookingPaymentForm({
  roomData,
}: BookingPaymentFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNo: "",
    companyName: "",
    gstNumber: "",
  });
  const [formErrors, setFormErrors] = useState({
    phoneNo: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [numberOfNights, setNumberOfNights] = useState<number>(0);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: number;
  } | null>(null);
  const [isCouponLoading, setIsCouponLoading] = useState(false);
  const router = useRouter();

  const {
    checkIn,
    checkOut,
    price,
    hotelName,
    locationName,
    roomName,
    adults,
    childrens,
    roomId,
    hotelId,
    locationId,
  } = roomData;

  useEffect(() => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    setNumberOfNights(nights);
    setTotalAmount(price * nights);
  }, [checkIn, checkOut, price]);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;

    setIsCouponLoading(true);
    try {
      const response = await fetch("/api/coupons/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode,
          bookingAmount: totalAmount,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAppliedCoupon(data.data);
        toast({
          title: "Success",
          description: "Coupon applied successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Coupon apply error:", error);
      toast({
        title: "Error",
        description: "Failed to apply coupon",
        variant: "destructive",
      });
    } finally {
      setIsCouponLoading(false);
    }
  };

  const calculateFinalAmount = () => {
    if (!appliedCoupon) return totalAmount;
    return totalAmount - appliedCoupon.discountAmount;
  };

  const validatePhoneNumber = (phone: string) => {
    // Basic validation for Indian phone numbers (10 digits, optionally starting with +91)
    const phoneRegex = /^(?:\+91)?[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ""));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (name === "phoneNo") {
      setFormErrors((prev) => ({
        ...prev,
        phoneNo: "",
      }));
    }
  };

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate phone number before proceeding
    if (!validatePhoneNumber(formData.phoneNo)) {
      setFormErrors((prev) => ({
        ...prev,
        phoneNo: "Please enter a valid 10-digit phone number",
      }));
      return;
    }

    setIsProcessing(true);

    try {
      const bookingResponse = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          hotelId,
          locationId,
          checkIn,
          checkOut,
          ...formData,
          adults,
          childrens,
          couponCode: appliedCoupon?.code,
        }),
      });

      if (!bookingResponse.ok) {
        setIsProcessing(false);
        router.push("/bookings/failure");
        return;
      }

      const bookingData = await bookingResponse.json();

      if (!bookingData.success) {
        setIsProcessing(false);
        router.push("/bookings/failure");
        return;
      }

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: bookingData.totalAmount * 100,
        currency: "INR",
        name: "Apricus Hotels",
        description: `Room Booking - ${roomName} at ${hotelName} for ${bookingData.numberOfNights} nights`,
        order_id: bookingData.orderId,
        handler: async function (response: RazorpaySuccessResponse) {
          try {
            const verifyResponse = await fetch("/api/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderCreationId: bookingData.orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const result = await verifyResponse.json();
            if (result.isOk) {
              router.push(
                `/bookings/success?transactionId=${result.transactionId}`
              );
            } else {
              router.push("/bookings/failure");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            router.push("/bookings/failure");
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            router.push("/bookings/failure");
          },
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phoneNo,
        },
        theme: { color: "#C68D07" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on(
        "payment.failed",
        function (response: RazorpayErrorResponse) {
          console.error("Payment failed:", response.error);
          paymentObject.close();
          setIsProcessing(false);
          router.push("/bookings/failure");
        }
      );
      paymentObject.open();
    } catch (error) {
      console.error("Payment processing error:", error);
      setIsProcessing(false);
      router.push("/bookings/failure");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />

      <Card className="border-0 shadow-xl max-w-3xl mx-auto bg-white">
        <div className="bg-primary text-white p-8 rounded-t-lg">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Shield className="w-7 h-7" />
            <h1 className="text-2xl font-comfortaaBold">Secure Booking</h1>
          </div>
          <div className="text-center font-comfortaaRegular text-white/90">
            {hotelName} - {locationName}
          </div>
        </div>

        <CardContent className="p-8">
          {/* Booking Summary Card */}
          <div className="bg-accent/10 rounded-lg p-6 mb-8">
            <h2 className="font-comfortaaBold text-lg mb-4 text-gray-800">
              Booking Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SummaryItem
                icon={<Home className="w-4 h-4" />}
                label="Room Type"
                value={roomName}
              />
              <SummaryItem
                icon={<Users className="w-4 h-4" />}
                label="Guests"
                value={`${adults} Adults, ${childrens} Children`}
              />
              <SummaryItem
                icon={<Calendar className="w-4 h-4" />}
                label="Check-in"
                value={formatDate(checkIn)}
              />
              <SummaryItem
                icon={<Calendar className="w-4 h-4" />}
                label="Check-out"
                value={formatDate(checkOut)}
              />
              <SummaryItem
                icon={<CreditCard className="w-4 h-4" />}
                label="Price per night"
                value={`₹${price.toFixed(2)}`}
              />
              <SummaryItem
                icon={<Clock className="w-4 h-4" />}
                label="Duration"
                value={`${numberOfNights} nights`}
              />
            </div>
          </div>

          <form onSubmit={handlePayment} className="space-y-8">
            {/* Guest Information */}
            <section>
              <h2 className="font-comfortaaBold text-lg mb-4 text-gray-800">
                Guest Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  icon={<User className="w-4 h-4" />}
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
                <FormField
                  icon={<Mail className="w-4 h-4" />}
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <div className="space-y-2">
                  <Label className="flex items-center space-x-2 text-gray-700 font-comfortaaMedium">
                    <Phone className="w-4 h-4" />
                    <span>Phone Number</span>
                  </Label>
                  <div>
                    <Input
                      type="tel"
                      name="phoneNo"
                      value={formData.phoneNo}
                      onChange={handleInputChange}
                      required
                      className={`h-11 border-gray-200 focus:border-primary focus:ring-primary ${
                        formErrors.phoneNo ? "border-red-500" : ""
                      }`}
                      placeholder="Enter your phone number"
                    />
                    {formErrors.phoneNo && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.phoneNo}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <Separator className="my-8" />

            {/* Company Details */}
            <section>
              <h2 className="font-comfortaaBold text-lg mb-4 text-gray-800">
                Company Details (Optional)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  icon={<Building2 className="w-4 h-4" />}
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                />
                <FormField
                  icon={<FileText className="w-4 h-4" />}
                  label="GST Number"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleInputChange}
                />
              </div>
            </section>

            {/* Payment Summary */}
            <div className="flex items-center space-x-2 mt-4">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="uppercase"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleApplyCoupon}
                disabled={isCouponLoading || !couponCode}
              >
                {isCouponLoading ? "Applying..." : "Apply"}
              </Button>
            </div>

            {appliedCoupon && (
              <div className="mt-2">
                <div className="flex justify-between items-center text-sm text-green-600">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span>-₹{appliedCoupon.discountAmount.toFixed(2)}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-xs text-red-500 mt-1 h-auto p-0"
                  onClick={() => {
                    setAppliedCoupon(null);
                    setCouponCode("");
                  }}
                >
                  Remove Coupon
                </Button>
              </div>
            )}

            <Separator className="my-3" />
            <div className="bg-accent/10 rounded-lg p-6 mt-8">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-comfortaaRegular">
                  <span>Price per night</span>
                  <span>₹{price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-comfortaaRegular">
                  <span>Number of nights</span>
                  <span>{numberOfNights}</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between items-center">
                  <span className="font-comfortaaBold text-gray-800">
                    Total Amount
                  </span>
                  <span className="text-2xl font-comfortaaBold text-primary">
                    ₹{calculateFinalAmount().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-primary hover:bg-primary/90 text-white h-12 font-comfortaaBold mt-6"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Proceed to Payment</span>
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

// Helper Components
const SummaryItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start space-x-3">
    <div className="text-primary mt-1">{icon}</div>
    <div>
      <p className="text-sm text-gray-600 font-comfortaaRegular">{label}</p>
      <p className="font-comfortaaMedium text-gray-800">{value}</p>
    </div>
  </div>
);

const FormField = ({
  icon,
  label,
  name,
  type = "text",
  required = false,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="space-y-2">
    <Label className="flex items-center space-x-2 text-gray-700 font-comfortaaMedium">
      {icon}
      <span>{label}</span>
    </Label>
    <Input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="h-11 border-gray-200 focus:border-primary focus:ring-primary"
      placeholder={`Enter your ${label.toLowerCase()}`}
    />
  </div>
);

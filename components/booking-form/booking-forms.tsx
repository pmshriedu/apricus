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
  IndianRupee,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [, setPaymentMethod] = useState<"razorpay" | "plural">("razorpay");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: number;
  } | null>(null);
  const [isCouponLoading, setIsCouponLoading] = useState(false);
  const [paymentTheme, setPaymentTheme] = useState<"blue" | "purple">("blue");
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

  const gstRate = totalAmount > 7500 ? 0.18 : 0.12;
  const sgst = calculateFinalAmount() * (gstRate / 2);
  const cgst = calculateFinalAmount() * (gstRate / 2);
  const totalAmountWithTax = calculateFinalAmount() * (1 + gstRate);

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

  const createBooking = async () => {
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
        return null;
      }

      const bookingData = await bookingResponse.json();

      if (!bookingData.success) {
        setIsProcessing(false);
        router.push("/bookings/failure");
        return null;
      }

      return bookingData;
    } catch (error) {
      console.error("Booking creation error:", error);
      setIsProcessing(false);
      router.push("/bookings/failure");
      return null;
    }
  };

  const handleRazorpayPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePhoneNumber(formData.phoneNo)) {
      setFormErrors((prev) => ({
        ...prev,
        phoneNo: "Please enter a valid 10-digit phone number",
      }));
      return;
    }

    setIsProcessing(true);

    const bookingData = await createBooking();
    if (!bookingData) return;

    try {
      // The totalAmount from the API already includes GST
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: Math.round(bookingData.totalAmount * 100), // Use the totalAmount directly from API response
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
  useEffect(() => {
    // Check if redirected from Plural payment page
    const params = new URLSearchParams(window.location.search);
    const transactionIdFromURL = params.get("transactionId");
    const pendingTransactionId = localStorage.getItem("pendingTransactionId");

    // If there's a transaction ID in the URL, clear the pending one
    if (transactionIdFromURL) {
      localStorage.removeItem("pendingTransactionId");
      return;
    }

    // If we have a pending transaction ID but no transaction ID in the URL
    if (pendingTransactionId) {
      // Clear the pending transaction ID from localStorage
      localStorage.removeItem("pendingTransactionId");

      // Check the transaction status
      const checkTransactionStatus = async () => {
        try {
          // Add timestamp to prevent browser caching
          const timestamp = new Date().getTime();
          const response = await fetch(
            `/api/transaction/${pendingTransactionId}?_t=${timestamp}`
          );

          if (response.ok) {
            const data = await response.json();
            if (data && data.status === "SUCCESS") {
              // Only redirect if actually successful
              router.push(
                `/bookings/success?transactionId=${pendingTransactionId}`
              );
            } else {
              // If transaction exists but not successful
              router.push(
                `/bookings/failure?reason=payment_${
                  data?.status?.toLowerCase() || "incomplete"
                }`
              );
            }
          } else {
            // If transaction doesn't exist or other error
            router.push("/bookings/failure?reason=transaction_not_found");
          }
        } catch (error) {
          console.error("Error checking transaction status:", error);
          router.push("/bookings/failure?reason=status_check_failed");
        }
      };

      // Add a slight delay to ensure the transaction is fully committed
      setTimeout(() => {
        checkTransactionStatus();
      }, 1000);
    }
  }, [router]);
  const handlePluralPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePhoneNumber(formData.phoneNo)) {
      setFormErrors((prev) => ({
        ...prev,
        phoneNo: "Please enter a valid 10-digit phone number",
      }));
      return;
    }

    setIsProcessing(true);

    const bookingData = await createBooking();
    if (!bookingData) return;

    try {
      // Split full name into first name and last name
      const nameParts = formData.fullName.split(" ");
      const firstName = nameParts[0] || "Guest";
      const lastName =
        nameParts.length > 1 ? nameParts.slice(1).join(" ") : "Customer";

      // Format the amount in rupees
      const amount = bookingData.totalAmount;
      console.log(`Sending payment amount to Plural: ${amount}`);

      // Prepare data for Plural checkout
      const pluralData = {
        amount: amount,
        orderReference: bookingData.orderId,
        notes: `Room Booking - ${roomName} at ${hotelName} for ${bookingData.numberOfNights} nights`,
        customer: {
          id: bookingData.booking.id || `cust-${Date.now()}`,
          firstName: firstName,
          lastName: lastName,
          email: formData.email,
          phone: formData.phoneNo,
          billingAddress: {
            address1: "Not provided",
            city: "Not provided",
            state: "Not provided",
            country: "IN",
            pincode: "000000",
          },
        },
        metadata: {
          bookingId: bookingData.booking.id,
          roomName: roomName,
          hotelName: hotelName,
          totalAmount: amount.toString(),
          transactionId: bookingData.transactionId,
        },
      };

      console.log("Sending to Plural API:", pluralData);

      // Call the Plural checkout API
      const response = await fetch("/api/plural/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pluralData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Plural checkout error:", errorData);
        throw new Error(
          `Failed to create Plural checkout: ${JSON.stringify(errorData)}`
        );
      }

      const checkoutData = await response.json();
      console.log("Plural checkout response:", checkoutData);

      if (!checkoutData.success || !checkoutData.redirect_url) {
        throw new Error("Invalid response from Plural checkout API");
      }

      // Store the transaction ID in local storage for retrieval after redirect
      localStorage.setItem("pendingTransactionId", checkoutData.transactionId);

      // Redirect to Plural checkout page
      window.location.href = checkoutData.redirect_url;
    } catch (error) {
      console.error("Plural payment processing error:", error);
      setIsProcessing(false);
      toast({
        title: "Payment Error",
        description:
          error instanceof Error ? error.message : "Failed to process payment",
        variant: "destructive",
      });
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

      <Card className="border-0 shadow-xl max-w-3xl mx-auto bg-white transition-shadow duration-300 hover:shadow-2xl">
        <div
          className={`${
            paymentTheme === "blue" ? "bg-blue-600" : "bg-purple-600"
          } text-white p-8 rounded-t-lg transition-colors duration-500`}
        >
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
          <div
            className={`${
              paymentTheme === "blue" ? "bg-blue-50" : "bg-purple-50"
            } rounded-lg p-6 mb-8 transition-colors duration-500`}
          >
            <h2
              className={`font-comfortaaBold text-lg mb-4 ${
                paymentTheme === "blue" ? "text-blue-800" : "text-purple-800"
              } transition-colors duration-500`}
            >
              Booking Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SummaryItem
                icon={<Home className="w-4 h-4" />}
                label="Room Type"
                value={roomName}
                theme={paymentTheme}
              />
              <SummaryItem
                icon={<Users className="w-4 h-4" />}
                label="Guests"
                value={`${adults} Adults, ${childrens} Children`}
                theme={paymentTheme}
              />
              <SummaryItem
                icon={<Calendar className="w-4 h-4" />}
                label="Check-in"
                value={formatDate(checkIn)}
                theme={paymentTheme}
              />
              <SummaryItem
                icon={<Calendar className="w-4 h-4" />}
                label="Check-out"
                value={formatDate(checkOut)}
                theme={paymentTheme}
              />
              <SummaryItem
                icon={<CreditCard className="w-4 h-4" />}
                label="Price per night"
                value={`₹${price.toFixed(2)}`}
                theme={paymentTheme}
              />
              <SummaryItem
                icon={<Clock className="w-4 h-4" />}
                label="Duration"
                value={`${numberOfNights} nights`}
                theme={paymentTheme}
              />
            </div>
          </div>

          <Tabs
            defaultValue="razorpay"
            onValueChange={(value) => {
              setPaymentMethod(value as "razorpay" | "plural");
              setPaymentTheme(value === "razorpay" ? "blue" : "purple");
            }}
          >
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger
                value="razorpay"
                className={`flex items-center justify-center gap-2 transition-colors duration-300 
        ${
          paymentTheme === "blue"
            ? "bg-blue-600 text-white"
            : "hover:bg-blue-100"
        }`}
              >
                <CreditCard className="w-4 h-4" />
                Pay with Razorpay
              </TabsTrigger>
              <TabsTrigger
                value="plural"
                className={`flex items-center justify-center gap-2 transition-colors duration-300 
        ${
          paymentTheme === "purple"
            ? "bg-purple-600 text-white"
            : "hover:bg-purple-100"
        }`}
              >
                <IndianRupee className="w-4 h-4" />
                Pay with Plural (Pine Labs)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="razorpay">
              <form onSubmit={handleRazorpayPayment} className="space-y-8">
                {/* Guest Information */}
                <GuestInformationSection
                  formData={formData}
                  formErrors={formErrors}
                  handleInputChange={handleInputChange}
                  theme={paymentTheme}
                />

                <Separator className="my-8" />

                {/* Company Details */}
                <CompanyDetailsSection
                  formData={formData}
                  handleInputChange={handleInputChange}
                  theme={paymentTheme}
                />

                {/* Coupon and Payment Summary */}
                <CouponSection
                  couponCode={couponCode}
                  setCouponCode={setCouponCode}
                  handleApplyCoupon={handleApplyCoupon}
                  isCouponLoading={isCouponLoading}
                  appliedCoupon={appliedCoupon}
                  setAppliedCoupon={setAppliedCoupon}
                  theme={paymentTheme}
                />

                <PaymentSummarySection
                  price={price}
                  numberOfNights={numberOfNights}
                  totalAmount={totalAmount}
                  appliedCoupon={appliedCoupon}
                  sgst={sgst}
                  cgst={cgst}
                  totalAmountWithTax={totalAmountWithTax}
                  theme={paymentTheme}
                />

                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white h-12 font-comfortaaBold mt-6 transition-colors duration-300"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span className="flex items-center justify-center gap-2">
                        Pay with{" "}
                        <img
                          src="/razor.png"
                          alt="Razorpay"
                          className="w-full h-[20px]"
                        />
                      </span>
                    </div>
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="plural">
              <form onSubmit={handlePluralPayment} className="space-y-8">
                {/* Guest Information */}
                <GuestInformationSection
                  formData={formData}
                  formErrors={formErrors}
                  handleInputChange={handleInputChange}
                  theme={paymentTheme}
                />

                <Separator className="my-8" />

                {/* Company Details */}
                <CompanyDetailsSection
                  formData={formData}
                  handleInputChange={handleInputChange}
                  theme={paymentTheme}
                />

                {/* Coupon and Payment Summary */}
                <CouponSection
                  couponCode={couponCode}
                  setCouponCode={setCouponCode}
                  handleApplyCoupon={handleApplyCoupon}
                  isCouponLoading={isCouponLoading}
                  appliedCoupon={appliedCoupon}
                  setAppliedCoupon={setAppliedCoupon}
                  theme={paymentTheme}
                />

                <PaymentSummarySection
                  price={price}
                  numberOfNights={numberOfNights}
                  totalAmount={totalAmount}
                  appliedCoupon={appliedCoupon}
                  sgst={sgst}
                  cgst={cgst}
                  totalAmountWithTax={totalAmountWithTax}
                  theme={paymentTheme}
                />

                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-purple-400 hover:bg-purple-600  text-white h-12 font-comfortaaBold mt-6 transition-colors duration-300"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span className="flex items-center justify-center gap-2 text-white ">
                        Pay with
                        <img
                          src="/plural.png"
                          alt="Plural"
                          className="w-full h-6 "
                        />
                      </span>
                    </div>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}

// Component for Guest Information Section
const GuestInformationSection = ({
  formData,
  formErrors,
  handleInputChange,
  theme,
}: {
  formData: {
    fullName: string;
    email: string;
    phoneNo: string;
    companyName: string;
    gstNumber: string;
  };
  formErrors: {
    phoneNo: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  theme: "blue" | "purple";
}) => (
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
        theme={theme}
      />
      <FormField
        icon={<Mail className="w-4 h-4" />}
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        required
        theme={theme}
      />
      <div className="space-y-2">
        <Label className="flex items-center space-x-2 text-gray-700 font-comfortaaMedium">
          <span
            className={`${
              theme === "blue" ? "text-blue-600" : "text-purple-600"
            } transition-colors duration-500`}
          >
            <Phone className="w-4 h-4" />
          </span>
          <span>Phone Number</span>
        </Label>
        <div>
          <Input
            type="tel"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleInputChange}
            required
            className={`h-11 border-gray-200 focus:ring-2 transition-all duration-300 
              ${formErrors.phoneNo ? "border-red-500" : ""}
              ${
                theme === "blue"
                  ? "focus:border-blue-600 focus:ring-blue-100"
                  : "focus:border-purple-600 focus:ring-purple-100"
              }`}
            placeholder="Enter your phone number"
          />
          {formErrors.phoneNo && (
            <p className="text-red-500 text-sm mt-1">{formErrors.phoneNo}</p>
          )}
        </div>
      </div>
    </div>
  </section>
);

// Component for Company Details Section
const CompanyDetailsSection = ({
  formData,
  handleInputChange,
  theme,
}: {
  formData: {
    companyName: string;
    gstNumber: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  theme: "blue" | "purple";
}) => (
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
        theme={theme}
      />
      <FormField
        icon={<FileText className="w-4 h-4" />}
        label="GST Number"
        name="gstNumber"
        value={formData.gstNumber}
        onChange={handleInputChange}
        theme={theme}
      />
    </div>
  </section>
);

// Component for Coupon Section
const CouponSection = ({
  couponCode,
  setCouponCode,
  handleApplyCoupon,
  isCouponLoading,
  appliedCoupon,
  setAppliedCoupon,
  theme, // Add this prop
}: {
  couponCode: string;
  setCouponCode: (value: string) => void;
  handleApplyCoupon: () => void;
  isCouponLoading: boolean;
  appliedCoupon: {
    code: string;
    discountAmount: number;
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: number;
  } | null;
  setAppliedCoupon: (value: null) => void;
  theme: "blue" | "purple"; // Add this type
}) => (
  <>
    <div className="flex items-center space-x-2 mt-4">
      <Input
        placeholder="Enter coupon code"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
        className={`uppercase transition-all duration-300 
          ${
            theme === "blue"
              ? "focus:border-blue-600 focus:ring-blue-100"
              : "focus:border-purple-600 focus:ring-purple-100"
          }`}
      />
      <Button
        type="button"
        variant="outline"
        onClick={handleApplyCoupon}
        disabled={isCouponLoading || !couponCode}
        className={`transition-all duration-300 
          ${
            theme === "blue"
              ? "border-blue-600 text-blue-600 hover:bg-blue-50"
              : "border-purple-600 text-purple-600 hover:bg-purple-50"
          }`}
      >
        {isCouponLoading ? "Applying..." : "Apply"}
      </Button>
    </div>

    {appliedCoupon && (
      <div className="mt-2 transition-all duration-300">
        <div className="flex justify-between items-center text-sm text-green-600 transition-colors duration-300 hover:text-green-700">
          <span>Coupon Discount ({appliedCoupon.code})</span>
          <span>-₹{appliedCoupon.discountAmount.toFixed(2)}</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          className="text-xs text-red-500 mt-1 h-auto p-0 transition-colors duration-300 hover:text-red-700"
          onClick={() => {
            setAppliedCoupon(null);
            setCouponCode("");
          }}
        >
          Remove Coupon
        </Button>
      </div>
    )}
  </>
);

// Component for Payment Summary Section
const PaymentSummarySection = ({
  price,
  numberOfNights,
  totalAmount,
  appliedCoupon,
  sgst,
  cgst,
  totalAmountWithTax,
  theme, // Add this prop
}: {
  price: number;
  numberOfNights: number;
  totalAmount: number;
  appliedCoupon: {
    code: string;
    discountAmount: number;
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: number;
  } | null;
  sgst: number;
  cgst: number;
  totalAmountWithTax: number;
  theme: "blue" | "purple"; // Add this type
}) => (
  <>
    <Separator className="my-3" />
    <div
      className={`${
        theme === "blue" ? "bg-blue-50" : "bg-purple-50"
      } rounded-lg p-6 mt-8 transition-colors duration-500`}
    >
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
        {/* Tax Details */}
        <div className="space-y-3 mt-4">
          <div className="flex justify-between items-center text-sm font-comfortaaRegular">
            <span>Subtotal</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>

          {/* Coupon discount */}
          {appliedCoupon && (
            <div className="flex justify-between items-center text-sm text-green-600">
              <span>Coupon Discount ({appliedCoupon.code})</span>
              <span>-₹{appliedCoupon.discountAmount.toFixed(2)}</span>
            </div>
          )}

          {/* GST breakdown */}
          <div className="flex justify-between items-center text-sm font-comfortaaRegular">
            <span>SGST {totalAmount > 7500 ? "(9%)" : "(6%)"}</span>
            <span>₹{sgst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-comfortaaRegular">
            <span>CGST {totalAmount > 7500 ? "(9%)" : "(6%)"}</span>
            <span>₹{cgst.toFixed(2)}</span>
          </div>

          <Separator className="my-3" />

          <div className="flex justify-between items-center">
            <span className="font-comfortaaBold text-gray-800 transition-colors duration-300">
              Total Amount (Inc. GST)
            </span>
            <span className="text-2xl font-comfortaaBold text-black transition-all duration-300 hover:text-primary/80 hover:scale-105">
              ₹{totalAmountWithTax.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  </>
);

// Helper Components
const SummaryItem = ({
  icon,
  label,
  value,
  theme, // Add this prop
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  theme: "blue" | "purple"; // Add this type
}) => (
  <div className="flex items-start space-x-3 transition-all duration-300">
    <div
      className={`${
        theme === "blue" ? "text-blue-600" : "text-purple-600"
      } mt-1 transition-colors duration-500`}
    >
      {icon}
    </div>
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
  theme, // Add this prop
}: {
  icon: React.ReactNode;
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  theme: "blue" | "purple"; // Add this type
}) => (
  <div className="space-y-2">
    <Label className="flex items-center space-x-2 text-gray-700 font-comfortaaMedium">
      <span
        className={`${
          theme === "blue" ? "text-blue-600" : "text-purple-600"
        } transition-colors duration-500`}
      >
        {icon}
      </span>
      <span>{label}</span>
    </Label>
    <Input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={`h-11 border-gray-200 focus:ring-2 transition-all duration-300 
        ${
          theme === "blue"
            ? "focus:border-blue-600 focus:ring-blue-100"
            : "focus:border-purple-600 focus:ring-purple-100"
        }`}
      placeholder={`Enter your ${label.toLowerCase()}`}
    />
  </div>
);

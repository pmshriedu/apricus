"use client";
import { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  CreditCard,
  User,
  Mail,
  IndianRupee,
  Lock,
} from "lucide-react";

export default function PaymentPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const createOrderId = async () => {
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount) * 100,
          name,
          email,
          currency: "INR",
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");
      return await response.json();
    } catch (error) {
      console.error("Order creation error:", error);
      throw error;
    }
  };

  const processPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const { orderId, transactionId } = await createOrderId();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: parseFloat(amount) * 100,
        currency: "INR",
        name: "Apricus Hotels Private Limited",
        description: "Payment Transaction",
        order_id: orderId,
        handler: async function (response: any) {
          const verifyResponse = await fetch("/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderCreationId: orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });

          const result = await verifyResponse.json();
          if (result.isOk) {
            router.push(`/success?transactionId=${result.transactionId}`);
          } else {
            router.push("/failure");
          }
        },
        prefill: { name, email },
        theme: { color: "#C68D07" },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on("payment.failed", () => {
        setIsProcessing(false);
        router.push("/failure");
      });
      paymentObject.open();
    } catch (error) {
      console.error("Payment processing error:", error);
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />

      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          {/* Main Card */}
          <Card className="border-0 shadow-md overflow-hidden">
            {/* Header Banner */}
            <div className="bg-[#C68D07] text-white p-6 flex items-center justify-center space-x-3">
              <Lock className="w-6 h-6" />
              <h1 className="text-xl font-semibold">Secure Payment</h1>
            </div>

            <CardContent className="p-8">
              {/* Security Badge */}
              <div className="flex items-center justify-center space-x-2 text-[#C68D07] mb-8 bg-[#C68D07]/5 py-2 px-4 rounded-full">
                <Shield className="w-4 h-4" />
                <p className="text-sm font-medium">Secured by SSL Encryption</p>
              </div>

              <form onSubmit={processPayment} className="space-y-6">
                {/* Name Input */}
                <div className="space-y-2">
                  <Label className="flex items-center space-x-2 text-gray-600 font-medium">
                    <User className="w-4 h-4" />
                    <span>Full Name</span>
                  </Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                    className="h-12 border-gray-200 focus:border-[#C68D07] focus:ring-[#C68D07]"
                  />
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <Label className="flex items-center space-x-2 text-gray-600 font-medium">
                    <Mail className="w-4 h-4" />
                    <span>Email Address</span>
                  </Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email address"
                    className="h-12 border-gray-200 focus:border-[#C68D07] focus:ring-[#C68D07]"
                  />
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                  <Label className="flex items-center space-x-2 text-gray-600 font-medium">
                    <IndianRupee className="w-4 h-4" />
                    <span>Amount (INR)</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="1"
                      required
                      placeholder="0.00"
                      className="h-12 border-gray-200 focus:border-[#C68D07] focus:ring-[#C68D07]"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-[#C68D07] hover:bg-[#C68D07]/90 text-white h-12 text-lg font-medium mt-6"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <CreditCard className="w-5 h-5" />
                      <span>Pay Securely</span>
                    </div>
                  )}
                </Button>
              </form>

              {/* Trust Indicators */}
              <div className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                <div className="flex flex-col items-center text-center">
                  <Shield className="w-6 h-6 text-[#C68D07] mb-2" />
                  <span className="text-xs text-gray-600">Secure SSL</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Lock className="w-6 h-6 text-[#C68D07] mb-2" />
                  <span className="text-xs text-gray-600">Encrypted</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <CreditCard className="w-6 h-6 text-[#C68D07] mb-2" />
                  <span className="text-xs text-gray-600">Protected</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Trust Message */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Your payment is protected by industry-leading security
          </p>
        </div>
      </div>
    </>
  );
}

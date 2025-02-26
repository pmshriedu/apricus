"use client";
import React from "react";
import { XCircle, ArrowLeft, RefreshCcw, PhoneCall, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const FailurePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 font-comfortaaRegular">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Error Banner */}
          <div className="bg-destructive p-8 text-center">
            <XCircle className="h-20 w-20 text-white mx-auto mb-4 animate-pulse" />
            <h1 className="text-2xl md:text-3xl font-comfortaaBold text-white mb-2">
              Payment Failed
            </h1>
            <p className="text-white/90 text-sm md:text-base">
              We encountered an issue processing your payment
            </p>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 space-y-8">
            {/* Reassurance Message */}
            <div className="text-center">
              <p className="text-gray-700 font-comfortaaMedium mb-2">
                Don&lsquo;t worry, no charges have been made
              </p>
              <p className="text-gray-500 text-sm">
                Your payment attempt was unsuccessful and your account
                hasn&lsquo;t been charged
              </p>
            </div>

            {/* Potential Issues */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="font-comfortaaBold text-gray-800 mb-4">
                Common Reasons for Failure:
              </h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Insufficient funds in account
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Temporary bank decline
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Network connectivity issues
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Payment session timeout
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                onClick={() => window.history.back()}
                className="w-full bg-primary hover:bg-primary/90 text-white font-comfortaaMedium h-12 transition-all"
              >
                <RefreshCcw className="w-5 h-5 mr-2" />
                Try Payment Again
              </Button>

              <Link href="/" className="block">
                <Button
                  variant="outline"
                  className="w-full border-2 border-gray-200 hover:bg-gray-50 h-12 font-comfortaaMedium"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Return to Homepage
                </Button>
              </Link>
            </div>

            {/* Support Section */}
            <div className="border-t pt-6">
              <div className="text-center">
                <h3 className="font-comfortaaBold text-gray-800 mb-4">
                  Need Assistance?
                </h3>
                <div className="space-y-3">
                  <a
                    href="mailto:support@apricushotels.com"
                    className="flex items-center justify-center text-primary hover:text-primary/80 transition-colors"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    support@apricushotels.com
                  </a>
                  <a
                    href="tel:+1234567890"
                    className="flex items-center justify-center text-primary hover:text-primary/80 transition-colors"
                  >
                    <PhoneCall className="w-4 h-4 mr-2" />
                    +1 (234) 567-890
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FailurePage;

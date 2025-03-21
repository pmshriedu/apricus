import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface OrderAmountDetails {
  value: number;
  currency: string;
}

interface Address {
  address1: string;
  address2?: string;
  address3?: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
}

interface CustomerDetails {
  email_id: string;
  first_name: string;
  last_name: string;
  customer_id: string;
  mobile_number: string;
  billing_address?: Address;
  shipping_address?: Address;
}

interface PurchaseDetails {
  customer: CustomerDetails;
  merchant_metadata?: Record<string, string>;
}

interface CheckoutLinkRequest {
  merchant_order_reference: number | string;
  order_amount: OrderAmountDetails;
  pre_auth: boolean;
  allowed_payment_methods: string[];
  notes?: string;
  callback_url: string;
  purchase_details: PurchaseDetails;
}

interface CheckoutLinkResponse {
  order_id: string;
  redirect_url: string;
}

// Environment-specific URLs
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.pluralpay.in/api"
    : "https://pluraluat.v2.pinepg.in/api";

export const pluralService = {
  // Generate access token
  generateToken: async (): Promise<string> => {
    try {
      const requestId = uuidv4();
      const timestamp = new Date().toISOString();

      if (!process.env.PLURAL_CLIENT_ID || !process.env.PLURAL_CLIENT_SECRET) {
        throw new Error("Missing required Plural credentials");
      }

      const response = await fetch(`${API_BASE_URL}/auth/v1/token`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "Request-Timestamp": timestamp,
          "Request-ID": requestId,
        },
        body: JSON.stringify({
          client_id: process.env.PLURAL_CLIENT_ID,
          client_secret: process.env.PLURAL_CLIENT_SECRET,
          grant_type: "client_credentials",
        }),
      });

      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(
          `Failed to generate token: ${response.statusText}. Response: ${responseText}`
        );
      }

      // Parse the response as JSON
      const data: TokenResponse = await response.json();
      console.log("Token generated successfully");
      return data.access_token;
    } catch (error) {
      console.error("Error generating token:", error);
      throw error;
    }
  },

  // Generate checkout link
  generateCheckoutLink: async (
    orderDetails: CheckoutLinkRequest
  ): Promise<CheckoutLinkResponse> => {
    try {
      // First, get the access token
      const accessToken = await pluralService.generateToken();

      const requestId = uuidv4();
      const timestamp = new Date().toISOString();

      // Create headers object
      const headers: Record<string, string> = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Request-ID": requestId,
        "Request-Timestamp": timestamp,
        accept: "application/json",
      };

      // Only add merchant-id if it exists
      if (process.env.PLURAL_MERCHANT_ID) {
        headers["merchant-id"] = process.env.PLURAL_MERCHANT_ID;
      } else {
        console.warn("No Merchant ID found in environment variables");
        throw new Error("Missing PLURAL_MERCHANT_ID environment variable");
      }

      // Ensure callback URL is properly set
      if (!orderDetails.callback_url) {
        throw new Error("Missing callback URL in checkout request");
      }

      const response = await fetch(`${API_BASE_URL}/checkout/v1/orders`, {
        method: "POST",
        headers,
        body: JSON.stringify(orderDetails),
      });

      const responseText = await response.text();

      if (!response.ok) {
        let errorData = {};
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          // If not valid JSON, use the raw text
          errorData = { rawResponse: responseText };
        }
        console.error("Checkout link error details:", errorData);
        throw new Error(
          `Failed to generate checkout link: ${response.statusText}`
        );
      }

      const data = JSON.parse(responseText);
      return {
        order_id: data.order_id,
        redirect_url: data.redirect_url,
      };
    } catch (error) {
      console.error("Error generating checkout link:", error);
      throw error;
    }
  },

  // Handle Plural callback validation - modified to work without a signature secret
  verifyPluralCallback: async (orderId: string): Promise<boolean> => {
    try {
      // Since we don't have PLURAL_SIGNATURE_SECRET, we'll verify by checking if
      // the order exists in our database instead of verifying the signature
      const transaction = await prisma.transaction.findFirst({
        where: {
          pluralOrderId: orderId,
        },
      });

      // If we find a transaction with this plural order ID, consider it valid
      return !!transaction;
    } catch (error) {
      console.error("Error verifying Plural callback:", error);
      return false;
    }
  },
};

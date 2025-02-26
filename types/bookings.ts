// types/booking.ts

export interface RoomBooking {
  id: string;
  roomId: string;
  bookingId: string;
  checkIn: string;
  checkOut: string;
  room: {
    name: string;
    price: number;
  };
}

export interface Transaction {
  id: string;
  amount: number;
  status: string;
  discountAmount?: number;
  currency: string;
  razorpayPaymentId?: string;
}

export interface BookingWithDetails {
  id: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  childrens: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  fullName: string;
  email: string;
  phoneNo: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  hotel: {
    name: string;
  };
  location: {
    name: string;
  };
  transaction?: Transaction;
  roomBookings: RoomBooking[];
}

export type invoiceOptions = {
  type: "invoice";
  description: string;
  customer: {
    name: string;
    email: string;
    contact: string;
    billing_address?: {
      company_name?: string;
      gstin?: string;
    };
  };
  line_items: Array<{
    item_id: string;
    name: string;
    description: string;
    amount: number;
    currency: string;
    quantity: number;
  }>;
  sms_notify: number;
  email_notify: number;
  receipt: string;
};

// lib/validation.ts
import { z } from "zod";

export const bookingSchema = z.object({
  checkIn: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid check-in date",
  }),
  checkOut: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid check-out date",
  }),
  adults: z.number().min(1, "At least one adult is required"),
  children: z.number().min(0, "Number of children cannot be negative"),
  fullName: z.string().min(2, "Full name is required"),
  phoneNo: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  locationId: z.string().min(1, "Location is required"),
  hotelId: z.string().min(1, "Hotel is required"),
});

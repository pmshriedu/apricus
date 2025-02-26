import {
  Booking,
  RoomBooking,
  Transaction,
  Hotel,
  Location,
  Room,
} from "@prisma/client";

export type PrismaBooking = Booking & {
  hotel: Hotel;
  location: Location;
  transaction?: Transaction;
  roomBookings: (RoomBooking & {
    room: Room;
  })[];
};

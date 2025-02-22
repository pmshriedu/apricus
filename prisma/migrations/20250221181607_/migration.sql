/*
  Warnings:

  - You are about to drop the `RoomAvailability` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RoomAvailability" DROP CONSTRAINT "RoomAvailability_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "RoomAvailability" DROP CONSTRAINT "RoomAvailability_roomId_fkey";

-- DropTable
DROP TABLE "RoomAvailability";

-- DropEnum
DROP TYPE "AvailabilityStatus";

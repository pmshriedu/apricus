/*
  Warnings:

  - You are about to drop the column `amenities` on the `Hotel` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Hotel` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Hotel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Hotel" DROP COLUMN "amenities",
DROP COLUMN "images",
DROP COLUMN "price";

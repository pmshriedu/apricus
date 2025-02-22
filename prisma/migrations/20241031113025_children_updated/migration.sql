/*
  Warnings:

  - You are about to drop the column `children` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `childrens` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "children",
ADD COLUMN     "childrens" INTEGER NOT NULL;

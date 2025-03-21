/*
  Warnings:

  - A unique constraint covering the columns `[pluralOrderId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "paymentMethod" TEXT DEFAULT 'RAZORPAY',
ADD COLUMN     "pluralOrderId" TEXT,
ADD COLUMN     "pluralTransactionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_pluralOrderId_key" ON "Transaction"("pluralOrderId");

-- CreateIndex
CREATE INDEX "Transaction_pluralOrderId_idx" ON "Transaction"("pluralOrderId");

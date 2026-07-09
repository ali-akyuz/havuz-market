-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "paymentProvider" TEXT,
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'WAITING_PAYMENT',
ADD COLUMN     "paytrCurrency" TEXT,
ADD COLUMN     "paytrFailedReasonCode" TEXT,
ADD COLUMN     "paytrFailedReasonMsg" TEXT,
ADD COLUMN     "paytrPaymentType" TEXT,
ADD COLUMN     "paytrRaw" JSONB,
ADD COLUMN     "paytrTotalAmount" INTEGER;

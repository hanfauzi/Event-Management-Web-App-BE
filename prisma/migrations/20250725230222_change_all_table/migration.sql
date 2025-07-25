/*
  Warnings:

  - You are about to drop the column `schedule` on the `events` table. All the data in the column will be lost.
  - Added the required column `end_time` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `events` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `category` on the `events` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `price` on the `events` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `events` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `transactions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `type` to the `user_point_logs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('WAITING_PAYMENT', 'WAITING_CONFIRMATION', 'DONE', 'REJECTED', 'EXPIRED', 'CANCELED');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('UPCOMING', 'ONGOING', 'DONE');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('CULINARY', 'MUSIC', 'SPORT', 'COMEDY', 'WORKSHOP', 'ART', 'TRAVEL', 'EDUCATION', 'COMMUNITY', 'FASHION', 'GAMING', 'HEALTH', 'FAMILY', 'RELIGION', 'OTHER');

-- CreateEnum
CREATE TYPE "PointLogType" AS ENUM ('EARN', 'SPEND');

-- AlterTable
ALTER TABLE "events" DROP COLUMN "schedule",
ADD COLUMN     "end_time" TIME NOT NULL,
ADD COLUMN     "start_time" TIME NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" "Category" NOT NULL,
DROP COLUMN "price",
ADD COLUMN     "price" INTEGER NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "EventStatus" NOT NULL;

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "isCheckedIn" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "transaction_id" TEXT;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "coupon_id" TEXT,
ADD COLUMN     "voucher_id" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "TransactionStatus" NOT NULL;

-- AlterTable
ALTER TABLE "user_point_logs" ADD COLUMN     "type" "PointLogType" NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "referred_by_id" TEXT,
ADD COLUMN     "reset_token" TEXT,
ADD COLUMN     "reset_token_exp" TIMESTAMP(3),
ALTER COLUMN "first_name" DROP NOT NULL,
ALTER COLUMN "last_name" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "phone_number" DROP NOT NULL,
ALTER COLUMN "photo_url" DROP NOT NULL,
ALTER COLUMN "referral_code" DROP NOT NULL;

-- AlterTable
ALTER TABLE "vouchers" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_voucher_id_fkey" FOREIGN KEY ("voucher_id") REFERENCES "vouchers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `coupon_id` on the `transactions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "vouchers" DROP CONSTRAINT "vouchers_event_id_fkey";

-- DropForeignKey
ALTER TABLE "vouchers" DROP CONSTRAINT "vouchers_organizer_id_fkey";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "coupon_id";

-- AlterTable
ALTER TABLE "vouchers" ALTER COLUMN "organizer_id" DROP NOT NULL,
ALTER COLUMN "event_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "organizers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

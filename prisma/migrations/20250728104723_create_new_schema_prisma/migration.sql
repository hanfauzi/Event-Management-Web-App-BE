/*
  Warnings:

  - You are about to drop the column `organizer_id` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `tickets` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `tickets` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `user_point_logs` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `photo_url` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `reset_token` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `reset_token_exp` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `coupons` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `end_day` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizerId` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_day` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticketCategoryId` to the `tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quota` to the `vouchers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "coupons" DROP CONSTRAINT "coupons_user_id_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_organizer_id_fkey";

-- DropForeignKey
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_user_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_coupon_id_fkey";

-- DropForeignKey
ALTER TABLE "vouchers" DROP CONSTRAINT "vouchers_organizer_id_fkey";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "organizer_id",
ADD COLUMN     "end_day" DATE NOT NULL,
ADD COLUMN     "organizerId" TEXT NOT NULL,
ADD COLUMN     "start_day" DATE NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'UPCOMING';

-- AlterTable
ALTER TABLE "tickets" DROP COLUMN "quantity",
DROP COLUMN "user_id",
ADD COLUMN     "ticketCategoryId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user_point_logs" DROP COLUMN "reason";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "address",
DROP COLUMN "photo_url",
DROP COLUMN "reset_token",
DROP COLUMN "reset_token_exp",
DROP COLUMN "role",
ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "resetPasswordExpiry" TIMESTAMP(3),
ADD COLUMN     "resetPasswordToken" TEXT;

-- AlterTable
ALTER TABLE "vouchers" ADD COLUMN     "quota" INTEGER NOT NULL;

-- DropTable
DROP TABLE "coupons";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "organizers" (
    "id" TEXT NOT NULL,
    "orgName" TEXT,
    "orgUsername" TEXT NOT NULL,
    "orgEmail" TEXT NOT NULL,
    "orgPassword" TEXT NOT NULL,
    "orgAddress" TEXT,
    "orgPhoneNumber" TEXT,
    "logoUrl" TEXT,
    "orgBio" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "resetPasswordToken" TEXT,
    "resetPasswordExpiry" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "organizers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketCategory" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "quota" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "TicketCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizers_orgUsername_key" ON "organizers"("orgUsername");

-- CreateIndex
CREATE UNIQUE INDEX "organizers_orgEmail_key" ON "organizers"("orgEmail");

-- CreateIndex
CREATE UNIQUE INDEX "TicketCategory_eventId_name_key" ON "TicketCategory"("eventId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "organizers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketCategory" ADD CONSTRAINT "TicketCategory_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_ticketCategoryId_fkey" FOREIGN KEY ("ticketCategoryId") REFERENCES "TicketCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "organizers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

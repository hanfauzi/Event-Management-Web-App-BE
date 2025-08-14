/*
  Warnings:

  - You are about to drop the column `resetPasswordExpiry` on the `organizers` table. All the data in the column will be lost.
  - You are about to drop the column `resetPasswordExpiry` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."organizers" DROP COLUMN "resetPasswordExpiry";

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "resetPasswordExpiry";

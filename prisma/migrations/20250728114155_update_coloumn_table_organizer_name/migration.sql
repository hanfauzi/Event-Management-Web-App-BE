/*
  Warnings:

  - You are about to drop the column `orgAddress` on the `organizers` table. All the data in the column will be lost.
  - You are about to drop the column `orgBio` on the `organizers` table. All the data in the column will be lost.
  - You are about to drop the column `orgEmail` on the `organizers` table. All the data in the column will be lost.
  - You are about to drop the column `orgPassword` on the `organizers` table. All the data in the column will be lost.
  - You are about to drop the column `orgPhoneNumber` on the `organizers` table. All the data in the column will be lost.
  - You are about to drop the column `orgUsername` on the `organizers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `organizers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `organizers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `organizers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `organizers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `organizers` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "organizers_orgEmail_key";

-- DropIndex
DROP INDEX "organizers_orgUsername_key";

-- AlterTable
ALTER TABLE "organizers" DROP COLUMN "orgAddress",
DROP COLUMN "orgBio",
DROP COLUMN "orgEmail",
DROP COLUMN "orgPassword",
DROP COLUMN "orgPhoneNumber",
DROP COLUMN "orgUsername",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "organizers_username_key" ON "organizers"("username");

-- CreateIndex
CREATE UNIQUE INDEX "organizers_email_key" ON "organizers"("email");

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ORGANIZER');

-- AlterTable
ALTER TABLE "organizers" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'ORGANIZER';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

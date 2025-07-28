/*
  Warnings:

  - You are about to drop the `TicketCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_point_logs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TicketCategory" DROP CONSTRAINT "TicketCategory_eventId_fkey";

-- DropForeignKey
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_ticketCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "user_point_logs" DROP CONSTRAINT "user_point_logs_user_id_fkey";

-- DropTable
DROP TABLE "TicketCategory";

-- DropTable
DROP TABLE "user_point_logs";

-- CreateTable
CREATE TABLE "ticketCategory" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "quota" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ticketCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userPointLogs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" "PointLogType" NOT NULL,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "userPointLogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ticketCategory_eventId_name_key" ON "ticketCategory"("eventId", "name");

-- AddForeignKey
ALTER TABLE "ticketCategory" ADD CONSTRAINT "ticketCategory_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_ticketCategoryId_fkey" FOREIGN KEY ("ticketCategoryId") REFERENCES "ticketCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userPointLogs" ADD CONSTRAINT "userPointLogs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

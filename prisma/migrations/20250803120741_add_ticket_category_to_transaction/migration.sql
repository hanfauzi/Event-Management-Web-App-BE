/*
  Warnings:

  - Added the required column `ticket_category_id` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "ticket_category_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_ticket_category_id_fkey" FOREIGN KEY ("ticket_category_id") REFERENCES "ticketCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

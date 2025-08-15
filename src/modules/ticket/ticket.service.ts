import prisma from "../prisma/prisma.service";

export class TicketService {
  createTicketsForTransaction = async (transactionId: string) => {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { ticketCategory: true }, 
    });

    if (!transaction) throw new Error("Transaction not found");
    if (transaction.status !== "DONE") throw new Error("Transaction has not completed yet");

    const ticketsToCreate = Array(transaction.quantity).fill({
      eventId: transaction.eventId,
      ticketCategoryId: transaction.ticketCategoryId,
      transactionId: transaction.id,
    });

    const createdTickets = await prisma.ticket.createMany({
      data: ticketsToCreate,
    });

    return createdTickets;
  };
}

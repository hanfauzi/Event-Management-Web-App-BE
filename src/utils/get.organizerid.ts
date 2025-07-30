import prisma from "../modules/prisma/prisma.service";

export const getOrganizerByUserId = async (userId: string) => {
  return prisma.organizer.findUnique({
    where: {
      id: userId,
    },
  });
};

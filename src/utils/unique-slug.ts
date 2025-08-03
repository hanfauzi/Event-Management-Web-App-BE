import prisma from "../modules/prisma/prisma.service";
import { generateSlug } from "./generate-slug";

// utils/generateUniqueSlug.ts
export const generateUniqueSlug = async (title: string): Promise<string> => {
  const baseSlug = generateSlug(title);
  let slug = baseSlug;
  let count = 1;

  while (await prisma.event.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  return slug;
};

import { type Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const locales: Prisma.LocaleCreateManyInput[] = [
  { name: "臺灣", code: "zh_TW" },
  { name: "新加坡", code: "en_SG" },
];

export const seedLocales = async () => {
  // Check if locales are already seeded
  const existing = await prisma.locale.count();
  if (existing) return console.log("Locales already seeded.");

  await prisma.locale.createMany({
    data: locales,
  });

  console.log("🌱 Locales seeded successfully.");
};

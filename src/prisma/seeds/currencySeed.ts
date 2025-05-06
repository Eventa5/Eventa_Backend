import { type Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const currencies: Prisma.CurrencyCreateManyInput[] = [
  { name: "台幣", code: "TWD" },
  { name: "美元", code: "USD" },
  { name: "日圓", code: "JPY" },
  { name: "人民幣", code: "CNY" },
  { name: "港幣", code: "HKD" },
  { name: "歐元", code: "EUR" },
  { name: "新加坡幣", code: "SGD" },
  { name: "澳幣", code: "AUD" },
];

export const seedCurrencies = async () => {
  // Check if currencies are already seeded
  const existing = await prisma.currency.count();
  if (existing) return console.log("Currencies already seeded.");

  await prisma.currency.createMany({
    data: currencies,
  });

  console.log("🌱 Currencies seeded successfully.");
};

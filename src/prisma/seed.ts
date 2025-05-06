import { PrismaClient } from "@prisma/client";
import { seedCategories } from "./seeds/categorySeed";
import { seedCurrencies } from "./seeds/currencySeed";
import { seedLocales } from "./seeds/localeSeed";
const prisma = new PrismaClient();

async function main() {
  await seedCategories();
  await seedCurrencies();
  await seedLocales();
}

main()
  .then(async () => {
    console.log("Seeding finished");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("seeding failed:", e);
    return prisma.$disconnect().finally(() => process.exit(1));
  });

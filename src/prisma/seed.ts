import { PrismaClient } from "@prisma/client";
import { seedActivities } from "./seeds/activitySeed";
import { seedCategories } from "./seeds/categorySeed";
import { seedCurrencies } from "./seeds/currencySeed";
import { seedLocales } from "./seeds/localeSeed";
import { seedOrganizers } from "./seeds/organizerSeed";
import { seedUsers } from "./seeds/userSeed";

const prisma = new PrismaClient();

async function main() {
  await seedCategories();
  await seedCurrencies();
  await seedLocales();
  await seedUsers();
  if (process.env.NODE_ENV !== "production") {
    // 正式環境下不建立organizer和activities
    await seedOrganizers();
    await seedActivities();
  }
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

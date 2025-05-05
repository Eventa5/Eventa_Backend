import { PrismaClient } from "../generated/prisma";
import { seedCategories } from "./seeds/categorySeed";
const prisma = new PrismaClient();

async function main() {
  await seedCategories();
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

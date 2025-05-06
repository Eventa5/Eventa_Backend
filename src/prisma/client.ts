// create global prisma client instance
import { PrismaClient } from "@prisma/client";

// add prisma to global type
const globalForPrisma = globalThis as {
  prisma?: PrismaClient;
};

// avoid multiple instances
const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

async function connectionTest() {
  try {
    await prisma.$connect();
    console.log("Prisma connected successfully.");
  } catch (error) {
    console.error("Prisma failed to connect:", error);
  }
}

connectionTest();

export default prisma;

import { type Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const ticketTypes: Prisma.TicketTypeCreateManyInput[] = [
  {
    activityId: 1,
    name: "一般票",
    price: 500,
    totalQuantity: 10,
    remainingQuantity: 10,
    startTime: new Date(),
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  },
  {
    activityId: 1,
    name: "早鳥票",
    price: 250,
    totalQuantity: 5,
    remainingQuantity: 5,
    startTime: new Date(),
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  },
];

export const seedTicketTypes = async () => {
  // check if ticketTypes are already seeded
  const existing = await prisma.ticketType.count();
  if (existing) return console.log("TicketTypes already seeded.");

  await prisma.ticketType.createMany({ data: ticketTypes });
  console.log("🌱 TicketTypes seeded successfully.");
};

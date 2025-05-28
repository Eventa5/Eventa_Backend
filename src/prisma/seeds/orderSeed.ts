import { OrderStatus, type Prisma, PrismaClient } from "@prisma/client";
import { generateId } from "../../utils/idGenerator";

const prisma = new PrismaClient();
const orders: Prisma.OrderCreateManyInput[] = [
  {
    id: generateId("O"),
    userId: 2,
    activityId: 1,
    status: OrderStatus.pending,
  },
  {
    id: generateId("O"),
    userId: 2,
    activityId: 1,
    status: OrderStatus.paid,
  },
];

export const seedOrders = async () => {
  const existing = await prisma.order.count();
  if (existing) return console.log("orders already seeded.");

  await prisma.order.create({
    data: {
      id: generateId("O"),
      userId: 2,
      activityId: 1,
      status: OrderStatus.pending,
      orderItems: {
        create: [{ ticketTypeId: 1, quantity: 1 }],
      },
      tickets: {
        create: [
          {
            id: generateId("T"),
            ticketTypeId: 1,
            activityId: 1,
            qrCodeToken: "exampleToken123",
            refundDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
          },
        ],
      },
    },
  });
  console.log("🌱 orders seeded successfully.");
};
